

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
  
// Check if a token is available in localStorage
const auth_token = localStorage.getItem('user_token');

if (!auth_token) {
    // No token is available, so redirect to the login page
    window.location.href = './login.html';
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

// Configure Toastr options
const toastrOptions = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-center",
    timeOut: 5000,
    extendedTimeOut: 2000,
    showDuration: 1000,
    hideDuration: 5000,
    preventDuplicates: true,
    newestOnTop: true,
};

$(document).ready(function () {
    // Function to show the loading spinner
    function showLoadingSpinner() {
        $('#loadingSpinner').removeClass('d-none');
    }

    // Function to hide the loading spinner
    function hideLoadingSpinner() {
        $('#loadingSpinner').addClass('d-none');
    }

    // Function to partially obscure a string
    function obscureString(input) {
        if (input.length > 4) {
            const prefix = input.substring(0, 4);
            const obscuredPart = '*'.repeat(input.length - 4);
            return `${prefix}${obscuredPart}`;
        } else {
            return '*'.repeat(input.length);
        }
    }

    // Function to update the form with wallet data
    function updateFormWithWalletData(walletData) {
        if (walletData && walletData.length > 0) {
            const firstWallet = walletData[0];

            // Update form fields with wallet data
            $('#full_name').val(firstWallet.full_name);
            $('#crypto_exchange_platform').val(obscureString(firstWallet.crypto_exchange_platform));
            $('#usdt_trc20_address').val(obscureString(firstWallet.usdt_trc20_address));
            $('#phone').val(firstWallet.phone);

            // Change labels and button text
            $('#fullNameLabel').text('User Name');
            $('#cryptoPlatformLabel').text('Crypto Exchange');
            $('#usdtAddressLabel').text('USDT TRC20 Address');
            $('#phoneLabel').text('Phone Number');
            $('#modifyButton').text('Modify');
        }
    }

    // Fetch the user's profile using the bearer token
    const token = localStorage.getItem('user_token');
    const decodedToken = parseJwt(token);
    const userId = decodedToken.userId;

    // Make an AJAX call to get wallet data for the user
    $.ajax({
        type: 'GET',
        url: `http://localhost:5000/api/get-wallet-by-user/${userId}`, // Replace with your API endpoint URL
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        beforeSend: function (xhr) {
            // Show loading spinner before the AJAX call
            showLoadingSpinner();
        },
        success: function (response) {
            // Hide loading spinner when the API request is complete
            hideLoadingSpinner();

            // Update the form with wallet data
            updateFormWithWalletData(response.walletData);
        },
        error: function (error) {
            // Hide loading spinner when the API request is complete
            hideLoadingSpinner();

            // Show an error notification using Toastr
            showMessageModal(error.responseJSON.error, true);
        }
    });

    // Handle form submission
    $('#walletForm').submit(function (e) {
        e.preventDefault();

        // Get data by their IDs
        const full_name = $('#full_name').val();
        const crypto_exchange_platform = $('#crypto_exchange_platform').val();
        const usdt_trc20_address = $('#usdt_trc20_address').val();
        const phone = $('#phone').val();

        // Prepare data to send
        const data = {
            user_id: userId,
            full_name,
            crypto_exchange_platform,
            usdt_trc20_address,
            phone
        };

        // Make an AJAX call to bind/update the wallet
        $.ajax({
            type: 'POST',
            url: 'http://localhost:5000/api/bind-wallet', // Replace with your API endpoint URL
            data: JSON.stringify(data),
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            beforeSend: function (xhr) {
                // Show loading spinner before the AJAX call
                showLoadingSpinner();
            },
            success: function (response) {
                // Hide loading spinner when the API request is complete
                hideLoadingSpinner();

                // Show a success notification using Toastr
                showMessageModal(response.message, true);
            },
            error: function (error) {
                // Hide loading spinner when the API request is complete
                hideLoadingSpinner();

                // Show an error notification using Toastr
                showMessageModal(error.responseJSON.error, true);
            }
        });
    });
});




// // Check if a token is available in localStorage
// const auth_token = localStorage.getItem('user_token');

// if (!auth_token) {
//   // No token is available, so redirect to the login page
//   window.location.href = './login.html';
// }

// // Function to parse JWT token
// function parseJwt(token) {
//   const base64Url = token.split('.')[1];
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   const jsonPayload = decodeURIComponent(
//       atob(base64)
//           .split('')
//           .map(function (c) {
//               return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//           })
//           .join('')
//   );

//   return JSON.parse(jsonPayload);
// }

// // Configure Toastr options
// const toastrOptions = {
//   closeButton: true,
//   progressBar: true,
//   positionClass: "toast-top-center",
//   timeOut: 10000,
//   extendedTimeOut: 2000,
//   showDuration: 1000,
//   hideDuration: 5000,
//   preventDuplicates: true,
//   newestOnTop: true,
// };

// $(document).ready(function () {
//   // Function to show the loading spinner
//   function showLoadingSpinner() {
//       $('#loadingSpinner').removeClass('d-none');
//   }

//   // Function to hide the loading spinner
//   function hideLoadingSpinner() {
//       $('#loadingSpinner').addClass('d-none');
//   }

//   // Function to clear and enable input fields
//   function clearAndEnableInputFields() {
//       $('#full_name').val('');
//       $('#crypto_exchange_platform').val('');
//       $('#usdt_trc20_address').val('');
//       $('#phone').val('');
//       $('#full_name').prop('disabled', false);
//       $('#crypto_exchange_platform').prop('disabled', false);
//       $('#usdt_trc20_address').prop('disabled', false);
//       $('#phone').prop('disabled', false);
//   }

//   // Function to toggle edit mode
//   function toggleEditMode(enabled) {
//       if (enabled) {
//           $('#full_name').prop('disabled', false);
//           $('#crypto_exchange_platform').prop('disabled', false);
//           $('#usdt_trc20_address').prop('disabled', false);
//           $('#phone').prop('disabled', false);
//           $('#modifyButton').text('Update Changes');
//       } else {
//           $('#full_name').prop('disabled', true);
//           $('#crypto_exchange_platform').prop('disabled', true);
//           $('#usdt_trc20_address').prop('disabled', true);
//           $('#phone').prop('disabled', true);
//           $('#modifyButton').text('Modify');
//       }
//   }

//   // Initially, set edit mode to disabled
//   toggleEditMode(false);

//   // Function to update the form with wallet data
//   function updateFormWithWalletData(walletData) {
//       if (walletData && walletData.length > 0) {
//           const firstWallet = walletData[0];

//           // Update form fields with wallet data
//           $('#full_name').val(firstWallet.full_name);
//           $('#crypto_exchange_platform').val(firstWallet.crypto_exchange_platform);
//           $('#usdt_trc20_address').val(firstWallet.usdt_trc20_address);
//           $('#phone').val(firstWallet.phone);

//           // Change labels
//           $('#fullNameLabel').text('Full Name');
//           $('#cryptoPlatformLabel').text('Crypto exchange platform');
//           $('#usdtAddressLabel').text('USDT TRC20 Address');
//           $('#phoneLabel').text('Phone No');
//       }
//   }

//   // Fetch the user's profile using the bearer token
//   const token = localStorage.getItem('user_token');
//   const decodedToken = parseJwt(token);
//   const userId = decodedToken.userId;

//   // Make an AJAX call to get wallet data for the user
//   $.ajax({
//       type: 'GET',
//       url: `http://localhost:5000/api/get-wallet-by-user/${userId}`, // Replace with your API endpoint URL
//       headers: {
//           'Authorization': `Bearer ${token}`,
//       },
//       beforeSend: function (xhr) {
//           // Show loading spinner before the AJAX call
//           showLoadingSpinner();
//       },
//       success: function (response) {
//           // Hide loading spinner when the API request is complete
//           hideLoadingSpinner();

//           // Update the form with wallet data
//           updateFormWithWalletData(response.walletData);
//       },
//       error: function (error) {
//           // Hide loading spinner when the API request is complete
//           hideLoadingSpinner();

//           // Show an error notification using Toastr
//           toastr.error(error.responseJSON.error, "Error", toastrOptions);
//       }
//   });

//   // Handle button click to toggle edit mode
//   $('#modifyButton').click(function () {
//       // Check if edit mode is enabled or not
//       const isEditModeEnabled = !$('#full_name').prop('disabled');

//       if (isEditModeEnabled) {
//           // If edit mode is enabled, validate input fields
//           const full_name = $('#full_name').val();
//           const crypto_exchange_platform = $('#crypto_exchange_platform').val();
//           const usdt_trc20_address = $('#usdt_trc20_address').val();
//           const phone = $('#phone').val();

//           // Check if any input field is empty
//           if (!full_name || !crypto_exchange_platform || !usdt_trc20_address || !phone) {
//               toastr.error('Please fill in all input fields.', "Error", toastrOptions);
//               return;
//           }

//           // Prepare data to send
//           const data = {
//               user_id: userId,
//               full_name,
//               crypto_exchange_platform,
//               usdt_trc20_address,
//               phone
//           };

//           // Make an AJAX call to update the wallet
//           $.ajax({
//               type: 'PUT',
//               url: 'http://localhost:5000/api/edit-wallet', // Replace with your API endpoint URL
//               data: JSON.stringify(data),
//               contentType: 'application/json',
//               headers: {
//                   'Authorization': `Bearer ${token}`,
//               },
//               beforeSend: function (xhr) {
//                   // Show loading spinner before the AJAX call
//                   showLoadingSpinner();
//               },
//               success: function (response) {
//                   // Hide loading spinner when the API request is complete
//                   hideLoadingSpinner();

//                   // Show a success notification using Toastr
//                   toastr.success(response.message, "Success", toastrOptions);

//                   // Clear and enable input fields, and set edit mode to disabled
//                   clearAndEnableInputFields();
//                   toggleEditMode(false);
//                     // Reload the page after a short delay (you can adjust the delay as needed)
//                     setTimeout(function () {
//                         location.reload();
//                     }, 8000); // Reload after 2 seconds (2000 milliseconds)
                
//               },
//               error: function (error) {
//                   // Hide loading spinner when the API request is complete
//                   hideLoadingSpinner();

//                   // Show an error notification using Toastr
//                   console.log(error)
//                   toastr.error(error.responseJSON.error, "Error", toastrOptions);
//               }
//           });
//       } else {
//           // If edit mode is disabled, enable input fields and set edit mode to enabled
//           toggleEditMode(true);
//           clearAndEnableInputFields();
//           $('#modifyButton').text('Update Changes');
//       }
//   });
// });


