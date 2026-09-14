// ==========================================
// GOOGLE APPS SCRIPT API URL
// ==========================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbx2CybyqqbYGL-L6M1hhwHNiDwNQZ-wFSALY8aidfxaw8e6UTMMmDb_6IiwSerSJC3VZQ/exec";


// ==========================================
// ELEMENTS
// ==========================================

const form =
  document.getElementById("kycForm");

const photoInput =
  document.getElementById("photo");

const photoPreview =
  document.getElementById("photoPreview");

const familyMembersContainer =
  document.getElementById("familyMembers");

const addFamilyButton =
  document.getElementById("addFamilyButton");

const submitButton =
  document.getElementById("submitButton");

const messageBox =
  document.getElementById("message");


// ==========================================
// PHOTO PREVIEW
// ==========================================

photoInput?.addEventListener(
  "change",
  function () {

    const file = this.files[0];

    if (!file) {
      photoPreview.style.display = "none";
      return;
    }

    // 5 MB validation
    if (file.size > 5 * 1024 * 1024) {

      alert(
        "Photo must be smaller than 5 MB."
      );

      this.value = "";

      photoPreview.style.display = "none";

      return;
    }

    // File type validation
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {

      alert(
        "Only JPG, PNG and WEBP images are allowed."
      );

      this.value = "";

      photoPreview.style.display = "none";

      return;
    }

    const reader =
      new FileReader();

    reader.onload =
      function (event) {

        photoPreview.src =
          event.target.result;

        photoPreview.style.display =
          "block";

      };

    reader.readAsDataURL(file);

  }
);


// ==========================================
// ADD FAMILY MEMBER
// ==========================================

addFamilyButton?.addEventListener(
  "click",
  function () {

    const row =
      document.createElement("div");

    row.className =
      "family-row";

    row.innerHTML = `

      <input
        type="text"
        name="family_name[]"
        placeholder="Family member name / परिवारका सदस्यको नाम"
      >

      <input
        type="text"
        name="family_occupation[]"
        placeholder="Occupation / पेशा"
      >

      <input
        type="text"
        name="family_relation[]"
        placeholder="Relation / नाता"
      >

      <input
        type="text"
        name="family_age[]"
        placeholder="Age / Year (वर्ष)"
      >

      <button
        type="button"
        class="remove-family"
      >
        Remove
      </button>

    `;

    familyMembersContainer.appendChild(row);

  }
);


// ==========================================
// REMOVE FAMILY MEMBER
// ==========================================

familyMembersContainer?.addEventListener(
  "click",
  function (event) {

    if (
      event.target.classList.contains(
        "remove-family"
      )
    ) {

      event.target
        .closest(".family-row")
        .remove();

    }

  }
);


// ==========================================
// GET FAMILY MEMBERS
// ==========================================

function getFamilyMembers() {

  const rows =
    document.querySelectorAll(
      "#familyMembers .family-row"
    );

  const members = [];

  rows.forEach(function (row) {

    const name =
      row.querySelector(
        '[name="family_name[]"]'
      )?.value.trim() || "";

    const occupation =
      row.querySelector(
        '[name="family_occupation[]"]'
      )?.value.trim() || "";

    const relation =
      row.querySelector(
        '[name="family_relation[]"]'
      )?.value.trim() || "";

    const age =
      row.querySelector(
        '[name="family_age[]"]'
      )?.value.trim() || "";

    // Only add non-empty rows
    if (
      name ||
      occupation ||
      relation ||
      age
    ) {

      members.push({

        name: name,

        occupation: occupation,

        relation: relation,

        age: age

      });

    }

  });

  return members;

}


// ==========================================
// CONVERT IMAGE TO BASE64
// ==========================================

function convertImageToBase64(file) {

  return new Promise(
    function (resolve, reject) {

      const reader =
        new FileReader();

      reader.onload =
        function () {

          // Remove:
          // data:image/jpeg;base64,

          const base64 =
            reader.result
              .split(",")[1];

          resolve(base64);

        };

      reader.onerror =
        function () {

          reject(
            new Error(
              "Unable to read photo."
            )
          );

        };

      reader.readAsDataURL(file);

    }
  );

}


// ==========================================
// FORM SUBMIT
// ==========================================

form?.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();

    try {

      // --------------------------------
      // DISABLE BUTTON
      // --------------------------------

      submitButton.disabled = true;

      submitButton.innerText =
        "Submitting...";


      // --------------------------------
      // GET MAIN DATA
      // --------------------------------

      const name =
        document
          .getElementById("name")
          .value
          .trim();

      const address =
        document
          .getElementById("address")
          .value
          .trim();

      const dateOfBirth =
        document
          .getElementById("dateOfBirth")
          .value
          .trim();

      const fatherName =
        document
          .getElementById("fatherName")
          .value
          .trim();

      const grandfatherName =
        document
          .getElementById("grandfatherName")
          .value
          .trim();

      const occupation =
        document
          .getElementById("occupation")
          .value
          .trim();

      const mobile =
        document
          .getElementById("mobile")
          .value
          .trim();

      const phone =
        document
          .getElementById("phone")
          .value
          .trim();


      // --------------------------------
      // REQUIRED FIELDS
      // --------------------------------

      if (!name) {

        throw new Error(
          "Please enter your name."
        );

      }

      if (!mobile) {

        throw new Error(
          "Please enter your mobile number."
        );

      }


      // --------------------------------
      // FAMILY MEMBERS
      // --------------------------------

      const familyMembers =
        getFamilyMembers();


      // --------------------------------
      // PHOTO
      // --------------------------------

      let photo = null;

      if (
        photoInput &&
        photoInput.files.length > 0
      ) {

        const file =
          photoInput.files[0];


        if (
          file.size >
          5 * 1024 * 1024
        ) {

          throw new Error(
            "Photo must be smaller than 5 MB."
          );

        }


        const base64 =
          await convertImageToBase64(
            file
          );


        photo = {

          name:
            file.name,

          mimeType:
            file.type,

          size:
            file.size,

          data:
            base64

        };

      }


      // --------------------------------
      // CREATE DATA
      // --------------------------------

      const data = {

        name:
          name,

        address:
          address,

        dateOfBirth:
          dateOfBirth,

        fatherName:
          fatherName,

        grandfatherName:
          grandfatherName,

        occupation:
          occupation,

        mobile:
          mobile,

        phone:
          phone,

        familyMembers:
          familyMembers,

        photo:
          photo,

        // Honeypot spam field
        website:
          document
            .getElementById("website")
            ?.value || ""

      };


      // --------------------------------
      // SEND TO GOOGLE APPS SCRIPT
      // --------------------------------

      const response =
        await fetch(
          API_URL,
          {

            method:
              "POST",

            headers: {

              "Content-Type":
                "text/plain;charset=utf-8"

            },

            body:
              JSON.stringify(data)

          }
        );


      // --------------------------------
      // RESPONSE
      // --------------------------------

      const result =
        await response.json();


      if (result.success) {

  sessionStorage.setItem(
    "kycNumber",
    result.kycNumber
  );

  window.location.href =
    "submitted.html";

}


      // --------------------------------
      // SUCCESS
      // --------------------------------

      messageBox.innerText =
        "KYC submitted successfully. KYC Number: " +
        result.kycNumber;

      messageBox.className =
        "success";


      // Reset form
      form.reset();


      // Hide preview
      if (photoPreview) {

        photoPreview.src = "";

        photoPreview.style.display =
          "none";

      }


      // Remove extra family rows
      const rows =
        familyMembersContainer
          .querySelectorAll(
            ".family-row"
          );

      rows.forEach(
        function (row, index) {

          if (index > 0) {

            row.remove();

          }

        }
      );


    } catch (error) {

      console.error(
        "KYC ERROR:",
        error
      );


      messageBox.innerText =
        error.message ||
        "Something went wrong.";

      messageBox.className =
        "error";


    } finally {

      submitButton.disabled =
        false;

      submitButton.innerText =
        "Submit KYC";

    }

  }
);
