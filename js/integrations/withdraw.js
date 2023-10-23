// // Function to parse JWT token
// function parseJwt(token) {
//   const base64Url = token.split(".")[1];
//   const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//   const jsonPayload = decodeURIComponent(
//     atob(base64)
//       .split("")
//       .map(function (c) {
//         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join("")
//   );

//   return JSON.parse(jsonPayload);
// }

// // Function to show the loading spinner
// function showLoadingSpinner() {
//   $("#loadingSpinner").removeClass("d-none");
// }

// // Function to hide the loading spinner
// function hideLoadingSpinner() {
//   $("#loadingSpinner").addClass("d-none");
// }

// function showMessageModal(message, isError) {
//   const modal = $("#messageModal");
//   const modalContent = modal.find(".modal-content");
//   const messageContent = $("#messageContent");

//   // Set the message and style based on whether it's an error or success
//   messageContent.text(message);
//   if (isError) {
//     modalContent.removeClass("bg-success").addClass("bg-danger");
//   } else {
//     modalContent.removeClass("bg-danger").addClass("bg-success");
//   }

//   modal.modal("show");
//   setTimeout(function () {
//     modal.modal("hide");
//   }, 5000); // Hide the modal after 2 seconds
// }

// // ##############  WITHDRAWAL API CALL #################
// $("#withdrawSubmitButton").on("click", function () {
//   const token = localStorage.getItem("user_token");
//   const decodedToken = parseJwt(token);
//   const userId = decodedToken.userId;

//   const withdrawAmount = parseFloat($("#withdrawAmountInput").val()) || 0;
//   const withdrawPassword = $("#withdrawPasswordInput").val();

//   // Validate withdrawal amount (must be a positive number)
//   if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
//     showMessageModal("Please enter a valid withdrawal amount.", true);
//     return;
//   }

//   // Show loading spinner while the withdrawal request is in progress
//   showLoadingSpinner();

//   // Create the withdrawal request data
//   const withdrawalData = {
//     userId: userId,
//     amount: withdrawAmount,
//     withdrawPassword: withdrawPassword,
//   };

//   // Make an AJAX POST request to the withdrawal API endpoint
//   $.ajax({
//     type: "POST",
//     url: "http://localhost:5000/api/withdraw_amount",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     data: JSON.stringify(withdrawalData),
//     success: function (response) {
//       console.log(response.supportWhatsAppData);
//       // Handle the success response here
//       const supportWhatsAppData = response.supportWhatsAppData;

//       // Update the modal with WhatsApp links, names, and statuses
//       const whatsappLinksList = $(".whatsappLinks");
//       whatsappLinksList.empty();

//       supportWhatsAppData.forEach((contact) => {
//         console.log(contact);
//         if (contact.status === "active") {
//           whatsappLinksList.append(
//             `<li><a href="${contact.whatsappLink}" target="_blank">${contact.name}</a></li>`
//           );
//         } else {
//           whatsappLinksList.append(`<li>${contact.name} (Closed)</li>`);
//         }
//       });

//       // Open the modal
//       $("#withdrawalModal").modal("show");
//     },
//     error: function (error) {
//       console.log(error);
//       // Handle the error response here
//       showMessageModal(error.responseJSON.error, true);
//     },
//     complete: function () {
//       // Hide loading spinner when the API request is complete
//       hideLoadingSpinner();
//     },
//   });
// });
// // Close the confirmation modal when cancel button is clicked
// $("#closeModalButton").off("click").on("click", function () {
//   $("#withdrawalModal").modal("hide");
// });





// // Function to parse JWT token
// function parseJwt(token) {
//   const base64Url = token.split(".")[1];
//   const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//   const jsonPayload = decodeURIComponent(
//     atob(base64)
//       .split("")
//       .map(function (c) {
//         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join("")
//   );

//   return JSON.parse(jsonPayload);
// }

// // Function to show the loading spinner
// function showLoadingSpinner() {
//   $("#loadingSpinner").removeClass("d-none");
// }

// // Function to hide the loading spinner
// function hideLoadingSpinner() {
//   $("#loadingSpinner").addClass("d-none");
// }

// function showMessageModal(message, isError) {
//   const modal = $("#messageModal");
//   const modalContent = modal.find(".modal-content");
//   const messageContent = $("#messageContent");

//   // Set the message and style based on whether it's an error or success
//   messageContent.text(message);
//   if (isError) {
//     modalContent.removeClass("bg-success").addClass("bg-danger");
//   } else {
//     modalContent.removeClass("bg-danger").addClass("bg-success");
//   }

//   modal.modal("show");
//   setTimeout(function () {
//     modal.modal("hide");
//   }); 
// }

// function getWithdrawHistory(userId) {
//   // Make an AJAX GET request to the withdrawal history API
//   $.ajax({
//     type: "GET",
//     url: `http://localhost:5000/api/withdraw-history-by-user/${userId}`,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${localStorage.getItem("user_token")}`,
//     },
//     success: function (response) {
//       // Handle the success response here
//       const withdrawalHistory = response.withdrawalHistory;
//       const historyContainer = $("#withdraw-history");

//       // Clear the existing content
//       historyContainer.empty();

//       // Display the withdrawal history
//       withdrawalHistory.forEach((entry) => {
//         const historyItem = document.createElement("div");
//         historyItem.classList.add("history-item");
       
//         historyItem.innerHTML = `
//          <div class="deposit-history text-light">
//         <div
//           class="history d-flex justify-content-between align-items-center py-2 border-bottom"
//         >
//           <div>
//             <div><b>Withdraw</b></div>
//             <div class="text-black-50">
//               <small>${moment(entry.timestamp).format("YYYY-MM-DD HH:mm:ss")}</small>
//             </div>
//           </div>
//           <div>
//             <div class="paid-status">Paid</div>
//             <div class="text-black-50"><b>${entry.amount.toFixed(2)}</b></div>
//           </div>
//         </div>
//       </div> 
//         `;
//         historyContainer.append(historyItem);
//       });
//     },
//     error: function (error) {
//       // Handle the error response here
//       showMessageModal(error.responseJSON.error, true);
//     },
//   });
// }

// // When the "Withdraw History" tab is selected
// $("#withdraw-history-tab").on("click", function () {
//   const token = localStorage.getItem("user_token");
//   const decodedToken = parseJwt(token);
//   const userId = decodedToken.userId;

//   // Show loading spinner while the request is in progress
//   showLoadingSpinner();

//   // Fetch and display withdrawal history
//   getWithdrawHistory(userId);

//   // Hide loading spinner when the request is complete
//   hideLoadingSpinner();
// });

// // ##############  WITHDRAWAL API CALL #################
// $("#withdrawSubmitButton").on("click", function () {
//   const token = localStorage.getItem("user_token");
//   const decodedToken = parseJwt(token);
//   const userId = decodedToken.userId;

//   const withdrawAmount = parseFloat($("#withdrawAmountInput").val()) || 0;
//   const withdrawPassword = $("#withdrawPasswordInput").val();

//   // Validate withdrawal amount (must be a positive number)
//   if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
//     showMessageModal("Please enter a valid withdrawal amount.", true);
//     return;
//   }

//   // Show loading spinner while the withdrawal request is in progress
//   showLoadingSpinner();

//   // Create the withdrawal request data
//   const withdrawalData = {
//     userId: userId,
//     amount: withdrawAmount,
//     withdrawPassword: withdrawPassword,
//   };

//   // Make an AJAX POST request to the withdrawal API endpoint
//   $.ajax({
//     type: "POST",
//     url: "http://localhost:5000/api/withdraw_amount", // Replace with the actual API endpoint URL
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     data: JSON.stringify(withdrawalData),
//     success: function (response) {
//       console.log(response.supportWhatsAppData);
//       // Handle the success response here
//       const supportWhatsAppData = response.supportWhatsAppData;

//       // Update the modal with WhatsApp links, names, and statuses
//       const whatsappLinksList = $(".whatsappLinks");
//       whatsappLinksList.empty();

//       supportWhatsAppData.forEach((contact) => {
//         console.log(contact);
//         if (contact.status === "active") {
//           whatsappLinksList.append(
//             `<li><a href="${contact.whatsappLink}" target="_blank">${contact.name}</a></li>`
//           );
//         } else {
//           whatsappLinksList.append(`<li>${contact.name} (Closed)</li>`);
//         }
//       });

//       // Open the modal
//       $("#withdrawalModal").modal("show");
//     },
//     error: function (error) {
//       console.log(error);
//       // Handle the error response here
//       showMessageModal(error.responseJSON.error, true);
//     },
//     complete: function () {
//       // Hide loading spinner when the API request is complete
//       hideLoadingSpinner();
//     },
//   });
// });

// // Close the confirmation modal when the cancel button is clicked
// $("#closeModalButton").off("click").on("click", function () {
//   $("#withdrawalModal").modal("hide");
// });



// Function to parse JWT token
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

// Function to show the loading spinner
function showLoadingSpinner() {
  $("#loadingSpinner").removeClass("d-none");
}

// Function to hide the loading spinner
function hideLoadingSpinner() {
  $("#loadingSpinner").addClass("d-none");
}

function showMessageModal(message, isError) {
  const modal = $("#messageModal");
  const modalContent = modal.find(".modal-content");
  const messageContent = $("#messageContent");

  // Set the message and style based on whether it's an error or success
  messageContent.text(message);
  if (isError) {
    modalContent.removeClass("bg-success").addClass("bg-danger");
  } else {
    modalContent.removeClass("bg-danger").addClass("bg-success");
  }

  modal.modal("show");
  setTimeout(function () {
    modal.modal("hide");
  }); 
}

function getWithdrawHistory(userId) {
  // Make an AJAX GET request to the withdrawal history API
  $.ajax({
    type: "GET",
    url: `http://localhost:5000/api/withdraw-history-by-user/${userId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    },
    success: function (response) {
      // Handle the success response here
      const withdrawalHistory = response.withdrawalHistory;
      const historyContainer = $("#withdraw-history");

      // Clear the existing content
      historyContainer.empty();

      // Display the withdrawal history
      withdrawalHistory.forEach((entry) => {
        const historyItem = document.createElement("div");
        historyItem.classList.add("history-item");

        historyItem.innerHTML = `
          <div class="deposit-history text-light">
            <div
              class="history d-flex justify-content-between align-items-center py-2 border-bottom"
            >
              <div>
                <div><b>Withdraw</b></div>
                <div class="text-black-50">
                  <small>${moment(entry.timestamp).format("YYYY-MM-DD HH:mm:ss")}</small>
                </div>
              </div>
              <div>
                <div class="paid-status">Paid</div>
                <div class="text-black-50"><b>${entry.amount.toFixed(2)}</b></div>
              </div>
            </div>
          </div>
        `;
        historyContainer.append(historyItem);
      });
    },
    error: function (error) {
      // Handle the error response here
      showMessageModal(error.responseJSON.error, true);
    },
  });
}

// When the "Withdraw History" tab is selected
$("#withdraw-history-tab").on("click", function () {
  const token = localStorage.getItem("user_token");
  const decodedToken = parseJwt(token);
  const userId = decodedToken.userId;

  // Show loading spinner while the request is in progress
  showLoadingSpinner();

  // Fetch and display withdrawal history
  getWithdrawHistory(userId);

  // Hide loading spinner when the request is complete
  hideLoadingSpinner();
});

// Function to open the confirmation modal
function openConfirmationModal() {
  $("#confirmationModalWithdrawl").modal("show");
}

// ##############  WITHDRAWAL API CALL #################
$("#withdrawSubmitButton").on("click", function () {
  // Open the confirmation modal
  openConfirmationModal();
});

// When the "Okay" button in the confirmation modal is clicked
$("#okayButton").on("click", function () {
  const token = localStorage.getItem("user_token");
  const decodedToken = parseJwt(token);
  const userId = decodedToken.userId;

  const withdrawAmount = parseFloat($("#withdrawAmountInput").val()) || 0;
  const withdrawPassword = $("#withdrawPasswordInput").val();

  // Validate withdrawal amount (must be a positive number)
  if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
    showMessageModal("Please enter a valid withdrawal amount.", true);
    return;
  }

  // Show loading spinner while the withdrawal request is in progress
  showLoadingSpinner();

  // Create the withdrawal request data
  const withdrawalData = {
    userId: userId,
    amount: withdrawAmount,
    withdrawPassword: withdrawPassword,
  };

  // Make an AJAX POST request to the withdrawal API endpoint
  $.ajax({
    type: "POST",
    url: "http://localhost:5000/api/withdraw_amount",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: JSON.stringify(withdrawalData),
    success: function (response) {
      $("#confirmationModalWithdrawl").modal("hide");
      // console.log(response.supportWhatsAppData);
      // Handle the success response here
      const supportWhatsAppData = response.supportWhatsAppData;

      // Update the modal with WhatsApp links, names, and statuses
      const whatsappLinksList = $(".whatsappLinks");
      whatsappLinksList.empty();
      

      supportWhatsAppData.forEach((contact) => {
        // console.log(contact);
      
          whatsappLinksList.append(
            `<li><a href="${contact.whatsappLink}" target="_blank">${contact.name}</a></li>`
          );
        
      });

      // Open the withdrawal modal
      $("#withdrawalModal").modal("show");
    },
    error: function (error) {
      console.log(error);
      // Handle the error response here
      showMessageModal(error.responseJSON.error, true);
    },
    complete: function () {
      // Hide loading spinner when the API request is complete
      hideLoadingSpinner();
    },
  });
});

// Close the confirmation modal when the cancel button is clicked
$("#closeModalButton").off("click").on("click", function () {
  $("#confirmationModalWithdrawl").modal("hide");
});
