// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get form element
  const form = document.querySelector("form");
  const submitButton = form.querySelector('button[type="submit"]');

  // Lesson type and group size elements
  const lessonTypeRadios = document.querySelectorAll(
    'input[name="lesson-type"]'
  );
  const groupSizeContainer = document.getElementById("group-size-container");
  const groupSizeSelect = document.getElementById("group-size");
  const agesContainer = document.getElementById("ages-container");

  // Handle lesson type change
  lessonTypeRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      if (this.value === "group") {
        groupSizeContainer.classList.remove("hidden");
        updateAgeFields(parseInt(groupSizeSelect.value));
      } else {
        groupSizeContainer.classList.add("hidden");
        updateAgeFields(1);
      }
    });
  });

  // Handle group size change
  groupSizeSelect.addEventListener("change", function () {
    updateAgeFields(parseInt(this.value));
  });

  // Function to dynamically create age fields
  function updateAgeFields(count) {
    agesContainer.innerHTML = "";

    for (let i = 1; i <= count; i++) {
      const wrapper = document.createElement("div");
      wrapper.className = "age-field-wrapper mb-4";

      const label = document.createElement("label");
      label.setAttribute("for", `age-${i}`);
      label.className = "block text-sm font-medium text-gray-700 mb-1";
      label.textContent =
        count === 1 ? "Age of Student" : `Age of Student ${i}`;

      const input = document.createElement("input");
      input.type = "number";
      input.id = `age-${i}`;
      input.name = `age-${i}`;
      input.required = true;
      input.min = "3";
      input.max = "100";
      input.className =
        "age-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
      input.style.fontFamily = "'Inter', sans-serif";

      // Add input event listener for error clearing
      input.addEventListener("input", function () {
        removeError(this.id);
      });

      wrapper.appendChild(label);
      wrapper.appendChild(input);
      agesContainer.appendChild(wrapper);
    }
  }

  // Form validation and submission handler
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    // SPAM PROTECTION: Check honeypot field
    const honeypot = document.getElementById("website").value;
    if (honeypot !== "") {
      // Bot detected - silently fail
      console.log("Spam detected - honeypot field filled");
      return;
    }

    // SPAM PROTECTION: Rate limiting (max 1 submission per 60 seconds)
    const lastSubmission = localStorage.getItem("lastSubmissionTime");
    const now = Date.now();
    if (lastSubmission && now - parseInt(lastSubmission) < 60000) {
      const waitTime = Math.ceil(
        (60000 - (now - parseInt(lastSubmission))) / 1000
      );
      showMessage(
        `Please wait ${waitTime} seconds before submitting again.`,
        "error"
      );
      return;
    }

    // Get form values
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const lessonType = document.querySelector(
      'input[name="lesson-type"]:checked'
    ).value;
    const groupSize =
      lessonType === "group" ? parseInt(groupSizeSelect.value) : 1;

    // Collect all ages
    const ageInputs = document.querySelectorAll(".age-input");
    const ages = [];
    ageInputs.forEach((input) => {
      const ageValue = input.value.trim();
      if (ageValue) {
        ages.push(parseInt(ageValue));
      }
    });

    const location = document.getElementById("location").value.trim();
    const preferredTime = document
      .getElementById("preferred-time")
      .value.trim();
    const contactPreference = document.querySelector(
      'input[name="contact-preference"]:checked'
    ).value;

    // Validation flags
    let isValid = true;
    let errorMessages = [];

    // Validate name (required, min 2 characters)
    if (name.length < 2) {
      isValid = false;
      errorMessages.push("Please enter a valid name (at least 2 characters)");
      highlightError("name");
    } else {
      removeError("name");
    }

    // Validate phone number (required, basic format check)
    // Malaysia format: 01X-XXXXXXX or 01X-XXXXXXXX (10-11 digits total)
    const phonePattern = /^01[0-9]-?\d{7,8}$/; // Malaysia phone format
    if (!phonePattern.test(phone.replace(/\s+/g, ""))) {
      isValid = false;
      errorMessages.push(
        "Please enter a valid Malaysia phone number (e.g., 012-3456789 or 0123456789)"
      );
      highlightError("phone");
    } else {
      removeError("phone");
    }

    // Validate ages (all must be valid)
    if (ages.length === 0) {
      isValid = false;
      errorMessages.push("Please enter at least one age");
    } else {
      ageInputs.forEach((input, index) => {
        const ageValue = parseInt(input.value);
        if (isNaN(ageValue) || ageValue < 3 || ageValue > 100) {
          isValid = false;
          errorMessages.push(
            `Age ${index + 1}: Please enter a valid age (3-100)`
          );
          highlightError(input.id);
        } else {
          removeError(input.id);
        }
      });
    }

    // If validation fails, show errors and stop
    if (!isValid) {
      showMessage(errorMessages.join("<br>"), "error");
      return;
    }

    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
    submitButton.classList.add("opacity-50", "cursor-not-allowed");

    // Create entry object
    const entry = {
      name,
      phone,
      lessonType,
      groupSize,
      ages,
      location,
      preferredTime,
      contactPreference,
      status: "waiting",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // Save to Firestore
    db.collection("waitlist")
      .add(entry)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);

        // Update last submission time for rate limiting
        localStorage.setItem("lastSubmissionTime", Date.now().toString());

        // Success! Clear form and show success message
        form.reset();
        submitButton.disabled = false;
        submitButton.textContent = "Join Waitlist";
        submitButton.classList.remove("opacity-50", "cursor-not-allowed");

        showMessage(
          `Thank you, ${name}! You've been added to the waitlist. Coach Wong will contact you as soon as the slots is available.`,
          "success"
        );
      })
      .catch((error) => {
        // Error handling
        console.error("Error adding document: ", error);

        submitButton.disabled = false;
        submitButton.textContent = "Join Waitlist";
        submitButton.classList.remove("opacity-50", "cursor-not-allowed");

        showMessage(
          "Sorry, there was an error submitting your form. Please try again.",
          "error"
        );
      });
  });

  // Helper function to highlight error fields
  function highlightError(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.add("border-red-500", "bg-red-50");
    field.classList.remove("border-gray-300");
  }

  // Helper function to remove error highlighting
  function removeError(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.remove("border-red-500", "bg-red-50");
    field.classList.add("border-gray-300");
  }

  // Clear error highlighting when user starts typing
  const inputs = form.querySelectorAll(
    'input[type="text"], input[type="tel"], input[type="number"]'
  );
  inputs.forEach((input) => {
    input.addEventListener("input", function () {
      removeError(this.id);
    });
  });

  // Show success/error messages
  function showMessage(message, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement("div");
    messageDiv.className = `form-message fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg shadow-lg z-50 max-w-md text-center transition-all duration-300 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`;
    messageDiv.innerHTML = `
            <div class="flex items-center justify-between gap-4">
                <span>${message}</span>
                <button class="close-message text-white hover:text-gray-200 font-bold text-xl">&times;</button>
            </div>
        `;

    // Add to page
    document.body.appendChild(messageDiv);

    // Animate in
    setTimeout(() => {
      messageDiv.style.opacity = "1";
      messageDiv.style.transform = "translateX(-50%) translateY(0)";
    }, 10);

    // Close button handler
    messageDiv.querySelector(".close-message").addEventListener("click", () => {
      hideMessage(messageDiv);
    });

    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideMessage(messageDiv);
    }, 5000);
  }

  // Hide message with animation
  function hideMessage(messageDiv) {
    messageDiv.style.opacity = "0";
    messageDiv.style.transform = "translateX(-50%) translateY(-20px)";
    setTimeout(() => {
      messageDiv.remove();
    }, 300);
  }
});
