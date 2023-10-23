


$(document).ready(function () {

  
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
    

    // Fetch the user's profile using the bearer token
    const token = localStorage.getItem('user_token');
    const decodedToken = parseJwt(token);
    const userId = decodedToken.userId;

    // Function to update drive data status
    function updateDriveDataStatus() {
        $.ajax({
            url: `${baseurl}/api/get-drive-data-status/${userId}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            success: function (driveDataResponse) {
                // Update the UI with the drive_data status here
                $("#drive-data").html(`<b>Drive Data (${driveDataResponse.driveData})</b>`);
            },
            error: function (error) {
                console.error(error.responseJSON.error);
                // Handle the error if needed
            },
        });
    }



    // Event listener for tab visibility change
document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
        // The tab is now visible, update balance and commission
        // Show the loader while updating
        $("#loadingSpinner").removeClass("d-none");
        updateBalanceAndCommission();
    }
});


    // Function to update balance and commission in real-time
    function updateBalanceAndCommission() {
        // Fetch user's balance and commission using AJAX
        $.ajax({
            url: `${baseurl}/api/get-user-profile/${userId}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            success: function (data) {
                // Update the HTML elements with the received data
                $("#todayProfit").text(data.commission);
                $("#totalBalance").text(data.balance);
                // Hide the loading spinner
                $("#loadingSpinner").addClass("d-none");
            },
            error: function (error) {
                console.error(error.responseJSON.error);
                // Handle the error if needed
                // Hide the loading spinner in case of error
                $("#loadingSpinner").addClass("d-none");
            },
        });
    }


    // Call the updateDriveDataStatus function on page load
    updateDriveDataStatus();

    // Attach click event to Drive Data button
    $("#drive-data").click(function () {
        // Show the loading spinner while updating balance and commission
        // $("#loadingSpinner").removeClass("d-none");
        $("#loading-gif").removeClass("d-none");
       
          

        // Fetch product details
        $.ajax({
            url: `${baseurl}/api/drive-data`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "POST",
            data: {
                user_id: userId,
            },
            success: function (response) {
                // console.log(response)
                if (response.message === "Product merged successfully") {
                    // Show the deposit modal
                    $("#confirmDepositModal").modal("show");
            
                    // Attach click event to Deposit Now button within the deposit modal
                    $("#depositButton").click(function () {
                        // Redirect the user to deposit.html
                        window.location.href = "deposit.html";
                    });
            
                    // Attach click event to Cancel button within the deposit modal
                    $("#cancelButton").click(function () {
                        // Redirect the user to start.html
                        window.location.href = "start.html";
                    });
                }
                // $("#loadingSpinner").addClass("d-none");
                $("#loading-gif").addClass("d-none");
                // console.log(response);
                // Check if there are no errors
                if (!response.error) {
                    // Update modal content with product details using IDs
                    $("#product_img").attr("src", response.selected_product.product_image_url);
                    $("#product_description").html(response.selected_product.product_description);
                    $("#product_price").html(`USDT ${response.selected_product.product_price}`);
                    $("#product_commission").html(`USDT ${response.commission.toFixed(2)}`);
                    $("#creation_time").html(moment(response.selected_product.user_product_created_at).format("YYYY-MM-DD HH:mm:ss"));
                    $("#data_no").html(`${response.selected_product.id}`);

                    
                    // Attach click event to Submit button within the modal
                    $("#submit-btn").off().click(function () {
                        
                        // Call the submit data API
                        $.ajax({
                            url: `${baseurl}/api/submit-data`,
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            method: "POST",
                            data: {
                                user_id: userId,
                                // product_id: response.selected_product ? response.selected_product.product_id : response.merged_product.product_id,
                            },
                            success: function (submitResponse) {

                                console.log(submitResponse)
                                // Update the drive data status after submitting
                                updateDriveDataStatus();

                                // Update balance and commission
                                updateBalanceAndCommission();

                             

                                
           

                                // Close the Drive Data modal on success
                                $("#driveDataModal").modal("hide");
                                
                                
                                
                            },
                            error: function (submitError) {
                                
                                if (submitError.responseJSON.error === "You have low balance, kindly make a deposit to your account by contacting Customer Support") {
                                    // Show the deposit modal
                                    $("#confirmDepositModal").modal("show");
                            
                                    // Attach click event to Deposit Now button within the deposit modal
                                    $("#depositButton").click(function () {
                                        // Redirect the user to deposit.html
                                        window.location.href = "deposit.html";
                                    });
                            
                                    // Attach click event to Cancel button within the deposit modal
                                    $("#cancelButton").click(function () {
                                        // Redirect the user to start.html
                                        window.location.href = "start.html";
                                    });
                                } else {
                                    // Handle other error cases if needed
                                    // Show error message in the Bootstrap modal
                                    $("#errorSuccessModalLabel").text("Error");
                                    $("#errorSuccessMessage").text(submitError.responseJSON.error);
                                    $("#errorSuccessModal").modal("show");
                                    // Hide the loading spinner in case of error
                                    $("#loadingSpinner").addClass("d-none");
                                    
                                }
                                
                            }
                            
                        });
                    });

                    // Show the Drive Data modal
                    $("#driveDataModal").modal("show");
                } else {
                    // Show error message in the Bootstrap modal
                    $("#errorSuccessModalLabel").text("Error");
                    $("#errorSuccessMessage").text(response.error);
                    $("#errorSuccessModal").modal("show");
                    // Hide the loading spinner in case of error
                    $("#loadingSpinner").addClass("d-none");
                }
            },
            error: function (error) {
                $("#loading-gif").addClass("d-none");
                if (error.responseJSON.error === "Insufficient balance") {
                    // Show the deposit modal
                    $("#confirmDepositModal").modal("show");
            
                    // Attach click event to Deposit Now button within the deposit modal
                    $("#depositButton").click(function () {
                        // Redirect the user to deposit.html
                        window.location.href = "deposit.html";
                    });
            
                    // Attach click event to Cancel button within the deposit modal
                    $("#cancelButton").click(function () {
                        // Redirect the user to start.html
                        window.location.href = "start.html";
                    });
                }else{
                    $("#loading-gif").addClass("d-none");
                // Handle the error if fetching product details fails
                // Show error message in the Bootstrap modal
                $("#errorSuccessModalLabel").text("Error");
                $("#errorSuccessMessage").text(error.responseJSON.error);
                $("#errorSuccessModal").modal("show");
                // Hide the loading spinner in case of error
                $("#loadingSpinner").addClass("d-none");
                }
            },
        });
        
    });
            // Add an event listener for the Drive Data modal close event
        $("#driveDataModal").on("hidden.bs.modal", function (e) {
            // Call the function to update balance and commission when the modal is closed
            updateBalanceAndCommission();
        });

    // Close the error message modal when the "Confirm" button is pressed
    $("#confirmButton").click(function () {
        $("#errorSuccessModal").modal("hide");
    });
});
