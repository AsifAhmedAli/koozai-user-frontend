
// error and success message function 

function showMessageModal(message, isError) {
  const modal = $('#messageModal');
  const modalContent = modal.find('.modal-content');
  const messageContent = $('#messageContent');

  // Set the message and style based on whether it's an error or success
  messageContent.text(message);
  if (isError) {
      modalContent.removeClass('bg-success').addClass('bg-danger');
  } else {
      modalContent.removeClass('bg-danger').addClass('bg-success');
  }

  modal.modal('show');
  setTimeout(function () {
      modal.modal('hide');
  }, 2000); // Hide the modal after 2 seconds
}



  $(document).ready(function () {
    $("#submit-button").click(function (e) {
      e.preventDefault();

      


      // Get input values
      const username = $("#username").val();
      const phone = $("#phone").val();
      const password = $("#password").val();
      const confirm_password = $("#confirm-password").val();
      const withdraw_password = $("#withdraw-password").val();
      const gender = $("#gender").val();
      const invitation_code = $("#invitation-code").val();
      const agreedToTerms = $("#agreedToTerms").prop("checked");

      // Front-end validation for password confirmation
      if (password !== confirm_password) {
        $("#password-error").text("Passwords do not match");
        return;
      } else {
        $("#password-error").text(""); 
      }

      // Check if any field is empty
      const fields = [
        { id: "username", name: "Username" },
        { id: "phone", name: "Phone" },
        { id: "password", name: "Password" },
        { id: "confirm-password", name: "Confirm Password" },
        { id: "withdraw-password", name: "Withdraw Password" },
        { id: "gender", name: "Gender" },
        { id: "invitation-code", name: "Invitation Code" },
      ];

      for (const field of fields) {
        const value = $(`#${field.id}`).val().trim();
        if (value === "") {
          // toastr.error(`${field.name} is required.`, "Registration Error", toastrOptions);
          showMessageModal(`${field.name} is required.`, true);
          return; // Stop processing if any field is empty
        }
      }

      // Create the data object to send to the API
      const data = {
        username,
        phone,
        password,
        confirm_password,
        withdraw_password,
        gender,
        invitation_code,
        agreedToTerms,
      };

      // Show the loading spinner
      $("#loadingSpinner").removeClass("d-none");

      // Make an AJAX POST request to your API endpoint
      $.ajax({
        type: "POST",
        url: `${baseurl}/api/user-registration`,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (response) {
          // Hide the loading spinner
          $("#loadingSpinner").addClass("d-none");

          // Handle successful registration
          showMessageModal("Registration successful.Please go to login page and continue.",true);

          // Clear the form
          $("#username").val("");
          $("#phone").val("");
          $("#password").val("");
          $("#confirm-password").val("");
          $("#withdraw-password").val("");
          $("#gender").val("");
          $("#invitation-code").val("");
          $("#agreedToTerms").prop("checked", false);

        //   Redirect to login.html
          window.location.href = "login.html";
        },
        error: function (error) {
          // Hide the loading spinner
          $("#loadingSpinner").addClass("d-none");

          // Handle registration errors
          // console.log(error);

          if (error.responseJSON && error.responseJSON.error) {
            // Display the specific error message from the server using Toastr
            showMessageModal(
              error.responseJSON.error,
              true
            );
          } else {
            // Generic error message
            // alert("Registration failed. Please try again.");
          }
        },
      });
    });
  });



//   #### LOGIN API CALL


$(document).ready(function () {
  $("#login-button").click(function (e) {
    e.preventDefault();

    // Get input values
    const identifier = $("input[name='identifier']").val();
    const password = $("input[name='password']").val();

    // Create the data object to send to the API
    const data = {
      identifier,
      password,
    };

    // Show the loading spinner for login
    $("#loadingSpinner").removeClass("d-none");

    // Make an AJAX POST request to your login API endpoint
    $.ajax({
      type: "POST",
      url: `${baseurl}/api/user-login`,
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function (response) {
        // Store the token in local storage
        localStorage.setItem("user_token", response.token);

        // Redirect to index.html
        window.location.href = "index.html";
      },
      error: function (error) {
        if (error.responseJSON && error.responseJSON.error) {
          // Display the specific error message from the server using Toastr
          showMessageModal(error.responseJSON.error, true);
        } else {
          // Generic error message
          showMessageModal("Login failed. Please try again.", true);
        }
      },
      complete: function () {
        // Hide the loading spinner after the request is complete
        $("#loadingSpinner").addClass("d-none");
      },
    });
  });
});



// CUSTOMER SUPPORT API INTEGRATION


        // Function to create a customer service link
    function createCustomerServiceLink(contact) {
        const link = `<a class="forgot-password-action border-bottom" href="https://api.whatsapp.com/send/?phone=${contact.whatsapp_number}&type=phone_number&app_absent=0">
            ${contact.name} <br> ${contact.status === 'active' ? '  ' : '(Closed)'}
        </a>`;
        return link;
    }

    $(document).ready(function () {
        $.ajax({
            url: 'http://localhost:5000/api/get-customer-support',
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response) {
                    const customerServiceLinks = $('#customerServiceLinks');
                    response.forEach(contact => {
                        const link = createCustomerServiceLink(contact);
                        customerServiceLinks.append(link);
                    });
                } else {
                    console.error('Error fetching customer service data');
                }
            },
            error: function (error) {
                console.error('Error fetching customer service data', error);
            }
        });
    });
      
   
// $(document).ready(function () {
//     $("#login-button").click(function (e) {
//       e.preventDefault();

//       // Get input values
//       const identifier = $("input[name='identifier']").val();
//       const password = $("input[name='password']").val();

//       // Create the data object to send to the API
//       const data = {
//         identifier,
//         password,
//       };
        

//       // Make an AJAX POST request to your login API endpoint
//       $.ajax({
//         type: "POST",
//         url: `${baseurl}/api/user-login`, 
//         data: JSON.stringify(data),
//         contentType: "application/json",
//         success: function (response) {
//             // console.log(response)
//           // Store the token in local storage
//           localStorage.setItem("user_token", response.token);

//           // Redirect to index.html
//           window.location.href = "index.html";
//         },
//         error: function (error) {
//           // console.log(error);

//           if (error.responseJSON && error.responseJSON.error) {
//             // Display the specific error message from the server using Toastr
//             showMessageModal(error.responseJSON.error, true);
//           } else {
//             // Generic error message
//             showMessageModal("Login failed. Please try again.",true);
//           }
//         },
//       });
//     });
//   });
