

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
        const visiblePart = input.substring(0, 2); // Show the first 2 characters
        const obscuredPart = '*'.repeat(input.length - 4); // Obfuscate the middle characters
        const endPart = input.slice(-2); // Show the last 2 characters
        return `${visiblePart}${obscuredPart}${endPart}`;
    } else {
        return '*'.repeat(input.length); // If the string is too short, hide it entirely
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
        url: `${baseurl}/api/get-wallet-by-user/${userId}`, 
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

         // Check if the wallet data is already loaded, indicating that it's a modification
    const isModification = ($('#modifyButton').text() === 'Modify');
    

    if (isModification) {
        // Open the modal to confirm the modification
        $('#forgotPasswordModal').modal('show');
        
    }else{

        // Make an AJAX call to bind/update the wallet
        $.ajax({
            type: 'POST',
            url: `${baseurl}/api/bind-wallet`, 
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
    }

        
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
    