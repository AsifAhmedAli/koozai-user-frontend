
  // Check if a token is available in localStorage
  const auth_token = localStorage.getItem('user_token');

  if (!auth_token) {
    // No token is available, so redirect to the login page
    window.location.href = './login.html';
  } 

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





// Function to parse JWT token
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

$(document).ready(function () {

  // Fetch the user's profile using the bearer token
  const token = localStorage.getItem('user_token');
  const decodedToken = parseJwt(token);
  const userId = decodedToken.userId;


  // Check if a token is available in localStorage
const auth_token = localStorage.getItem('user_token');

if (!auth_token) {
  // No token is available, so redirect to the login page
  window.location.href = './login.html';
} else {
  // Token is available; parse and check its expiration
  try {
    const tokenPayload = JSON.parse(atob(auth_token.split('.')[1])); // Decode the payload
    const tokenExpiration = tokenPayload.exp * 1000; // Convert seconds to milliseconds
    const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

    // Calculate the current time
    const currentTime = Date.now();

    // Check if the token has expired (current time is greater than or equal to expiration time)
    if (currentTime >= tokenExpiration) {
      // Token has expired; redirect to the login page
      window.location.href = './login.html';
    } else if (tokenExpiration - currentTime <= twoDaysInMilliseconds) {
     
     
    } else {
      // Token is valid; continue normal operations
    }
  } catch (error) {
    console.error('Error parsing or checking token:', error);
    // Handle any token parsing errors gracefully, e.g., redirect to login
    window.location.href = './login.html';
  }
}


  // console.log({ token, userId })

  $.ajax({
    type: "GET",
    url: `${baseurl}/api/get-user-profile/${userId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: function (response) {
      // Update the user's name and image
      $("#username").text(response.username);
      $("#referralCode").text(response.referral_code);
      $("#todayProfit").text(`USDT ${response.commission}`);
      $("#totalBalance").text(` USDT ${response.balance}`);
      $("#gender").val(response.gender);

      const userLevel = response.level_id;

      // Define the membership levels and their descriptions based on level_id
      const membershipLevels = {
        1: {
          name: "Bronze Membership",
          description:
            "0.5% Commission per data, 40 data per set & 2 sets every day",
        },
        2: {
          name: "Silver Membership",
          description:
            "1.0% Commission per data, 40 data per set & 2 sets every day",
        },
        3: {
          name: "Gold Membership",
          description:
            "1.5% Commission per data, 45 data per set & 2 sets every day",
        },
        4: {
          name: "Diamond Membership",
          description:
            "2.0% Commission per data, 50 data per set & 2 sets every day",
        },
      };

      
      if (membershipLevels[userLevel]) {
        // Set the level name and description based on level_id
        const levelName = membershipLevels[userLevel].name;
        const levelDescription = membershipLevels[userLevel].description;
        $("#levelName").text(levelName);
        $("#levelDescription").text(levelDescription);

        // const userImage = document.getElementById("userImage");
        // userImage.src = `./assets/images/badge${userLevel}.png`;

        if ($("#userImage").length > 0) {
            const userImage = document.getElementById("userImage");
            userImage.src = `./assets/images/badge${userLevel}.png`;
          }
         // Check if the user has a profile picture
      if (response.profile_pic !== null) {
        // Set the user's profile image if available
        $("#profile-img").attr("src", response.profile_pic);
      } else {
        // Set a default profile image if the user doesn't have one
        $("#profile-img").attr("src", "./assets/images/default_headimg.jpg");
      }
      } else {
        // Handle the case where the user's level doesn't match any defined level
        showMessageModal("Invalid user level:", userLevel,true);
      }
    },
    error: function (error) {
      console.error(error);
      showMessageModal(error,true);
    },
  });
});


  


$(document).ready(function () {
  
  
    // Fetch the user's profile using the bearer token
    const token = localStorage.getItem('user_token');
    const decodedToken = parseJwt(token);
    const userId = decodedToken.userId;
  
    // Function to handle changes to the profile image or gender
    function handleProfileChanges() {
      // Show the "Save Changes" button
      $('#save-changes').show();
    }
  
    // Attach event listeners for profile image upload and gender change
    $('#profile-image-upload').on('change', function () {
      handleProfileChanges();
      // Preview the selected profile image (if available)
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          $('#profile-img').attr('src', e.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  
    $('#gender').on('change', function () {
      handleProfileChanges();
    });
  
    // Fetch the user's profile information
    $.ajax({
      type: 'GET',
      url: `${baseurl}/api/get-user-profile/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (response) {
        // Hide loading spinner when API data has loaded
        hideLoadingSpinner();
  
        // Update the user's name and gender
        $('#username').text(response.username);
        $('#gender').val(response.gender);
  
        // If the user has a profile image, display it
        if (response.profile_pic) {
          $('#profile-img').attr('src', response.profile_pic);
        }
      },
      error: function (error) {
        console.error(error);
        showMessageModal(error,true);
      },
    });
  
    // Handle the "Save Changes" button click event
    $('#save-changes').on('click', function (e) {
      e.preventDefault();
  
      const newGender = $('#gender').val();
      const newProfileImage = $('#profile-image-upload')[0].files[0];
  
      // Show loading spinner while the API request is in progress
      showLoadingSpinner();
  
      // Perform the API call to update the profile
      const formData = new FormData();
      formData.append('gender', newGender);
      if (newProfileImage) {
        formData.append('profile_pic', newProfileImage);
      }
  
      $.ajax({
        type: 'PUT',
        url: `${baseurl}/api/edit-user-profile/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
          // Hide loading spinner when API request is complete
          hideLoadingSpinner();
  
          
          showMessageModal('Profile updated successfully','', true);
          // Hide the "Save Changes" button
          $('#save-changes').hide();
        },
        error: function (error) {
          console.error(error);
          // Hide loading spinner when API request is complete
          hideLoadingSpinner();
          // Show an error message (you can use toastr here)
          showMessageModal('Error updating profile',true);
        },
      });
    });
  });
  
  // Function to show the loading spinner
  function showLoadingSpinner() {
    $('#loadingSpinner').removeClass('d-none');
  }
  
  // Function to hide the loading spinner
  function hideLoadingSpinner() {
    $('#loadingSpinner').addClass('d-none');
  }
  











//   change login password API call



function showLoadingSpinner() {
    $('#loadingSpinner').removeClass('d-none');
}

function hideLoadingSpinner() {
    $('#loadingSpinner').addClass('d-none');
}



function changePassword() {
    
    const oldPassword = $('#oldPassword').val();
    const newPassword = $('#newPassword').val();
    const confirmNewPassword = $('#confirmNewPassword').val();


  

    // Show loading spinner while the API request is in progress
    showLoadingSpinner();

    // Fetch the user's profile using the bearer token
    const token = localStorage.getItem('user_token');
    const decodedToken = parseJwt(token);
    const userId = decodedToken.userId;

    $.ajax({
        type: 'PUT',
        url: `${baseurl}/api/change-login-password`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        data: JSON.stringify({
            userId,
            old_password: oldPassword,
            new_password: newPassword,
            confirm_new_password: confirmNewPassword,
        }),
        success: function (data) {
        //   console.log(data.error)
            if (data.error) {
                // Display the API error message using toastr
                showMessageModal(data.error, true);
            } else {
                // Display a success message using toastr
                showMessageModal('Password changed successfully', true);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            // console.error(xhr);
            // Display a generic error message using toastr
            
            showMessageModal(xhr.responseJSON.error,true);
        },
        complete: function () {
            // Hide loading spinner when API request is complete
            hideLoadingSpinner();
        },
    });
}








//   change login password API call



function showLoadingSpinner() {
  $('#loadingSpinner').removeClass('d-none');
}

function hideLoadingSpinner() {
  $('#loadingSpinner').addClass('d-none');
}


function changePasswordOfWithdrawl() {
  
  const oldPassword = $('#oldPasswordOfWithdrawl').val();
  const newPassword = $('#newPasswordOfWithdrawl').val();
  const confirmNewPassword = $('#confirmNewPasswordOfWithdrawl').val();




  // Show loading spinner while the API request is in progress
  showLoadingSpinner();

  // Fetch the user's profile using the bearer token
  const token = localStorage.getItem('user_token');
  const decodedToken = parseJwt(token);
  const userId = decodedToken.userId;

  $.ajax({
      type: 'PUT',
      url: `${baseurl}/api/change-withdraw-password`,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
      data: JSON.stringify({
          userId,
          old_password: oldPassword,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
      }),
      success: function (data) {
      //   console.log(data.error)
          if (data.error) {
              // Display the API error message using toastr
              showMessageModal(data.error, true);
          } else {
              // Display a success message using toastr
              showMessageModal('Password changed successfully', true);
          }
      },
      error: function (xhr, textStatus, errorThrown) {
          // console.error(xhr);
          // Display a generic error message using toastr
          
          showMessageModal(xhr.responseJSON.error,true);
      },
      complete: function () {
          // Hide loading spinner when API request is complete
          hideLoadingSpinner();
      },
  });
}

















// LOGOUT API CALL ##############

$(document).ready(function () {
    // Add an event listener to the "Log out" button
    $('#logoutButton').on('click', function (e) {
      e.preventDefault();
  
      // Show loading spinner while the logout request is in progress
      showLoadingSpinner();
  
      // Fetch the user's token from localStorage
      const token = localStorage.getItem('user_token');
  
      // Make an AJAX request to the logout API
      $.ajax({
        type: 'POST', 
        url: `${baseurl}/api/user-logout`, 
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        success: function (response) {
          // Hide loading spinner when the logout request is complete
          hideLoadingSpinner();
  
          // Check if the logout was successful
          if (response.message === 'Logout successful') {
            // Clear the user's token from localStorage
            localStorage.removeItem('user_token');
  
            window.location.href = './login.html';
          } else {
            // Display an error message using toastr
            showMessageModal('Logout failed',true);
          }
        },
        error: function (error) {
          // Hide loading spinner when the logout request is complete
          hideLoadingSpinner();
  
          // Display an error message using toastr
          showMessageModal('An error occurred while logging out',true);
        },
      });
    });
  
    // Function to show the loading spinner
    function showLoadingSpinner() {
      $('#loadingSpinner').removeClass('d-none');
    }
  
    // Function to hide the loading spinner
    function hideLoadingSpinner() {
      $('#loadingSpinner').addClass('d-none');
    }
  });
  


  


  // ####### EVENTS API INTEGRATION CALL


  $(document).ready(function () {
    const auth_token = localStorage.getItem('user_token');
      // Function to show the loading spinner
      function showLoadingSpinner() {
          $('#loadingSpinner').removeClass('d-none');
      }

      // Function to hide the loading spinner
      function hideLoadingSpinner() {
          $('#loadingSpinner').addClass('d-none');
      }

      // Function to fetch events and update the event images
      function fetchEvents() {
          // Show loading spinner
          showLoadingSpinner();

          // Make an AJAX call to get events
          $.ajax({
              type: 'GET',
              url: `${baseurl}/api/get-all-events`,
              headers: {
                  'Authorization': `Bearer ${auth_token}`,
              },
              beforeSend: function (xhr) {
                  // Set any additional headers here if needed
              },
              success: function (response) {
                  // Hide loading spinner
                  hideLoadingSpinner();

                  // Display all event images
                  const eventImagesContainer = $('#eventImages');
                  const modalImagesContainer = $('#modalImages');

                  response.events.forEach((event) => {
                      const eventImageUrl = event.event_img_url;

                      // Add event image to the main page
                      // const eventImageHtml = `
                      //     <div class="event-image" style="background-image: url('${eventImageUrl}');"></div>
                      // `;
                      // eventImagesContainer.append(eventImageHtml);

                      // Add event image to the modal
                      const modalImageHtml = `
                          <img src="${eventImageUrl}" class="img-fluid" />
                      `;
                      modalImagesContainer.append(modalImageHtml);
                  });
              },
              error: function (error) {
                  // Hide loading spinner
                  hideLoadingSpinner();

                  // Show an error notification using Toastr
                  showMessageModal(error.responseJSON.error, true);
              }
          });
      }

      // Call the fetchEvents function when the page loads
      fetchEvents();
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
              url: `${baseurl}/api/get-customer-support`,
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
  