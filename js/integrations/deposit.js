$(document).ready(function () {
  // Fetch the user's profile using the bearer token
  const token = localStorage.getItem("user_token");
  const decodedToken = parseJwt(token);
  const userId = decodedToken.userId;

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
    }, 2000); // Hide the modal after 2 seconds
  }

  // Handle predefined deposit amount box clicks
  $(".deposit-amount-box").on("click", function () {
    const amount = $(this).data("amount");
    $("#customDepositAmount").val(amount);

    // Remove background color from all boxes
    $(".deposit-amount-box").removeClass("amount-selected");

    // Add background color class to the selected box
    $(this).addClass("amount-selected");
  });

  // Handle the deposit button click event
  $("#depositButton").on("click", function () {
    const customAmount = parseFloat($("#customDepositAmount").val()) || 0;

    // If a predefined amount is selected, use it; otherwise, use the custom amount
    const amount =
      customAmount > 0
        ? customAmount
        : parseFloat($(".deposit-amount-box.selected").data("amount"));

    if (isNaN(amount) || amount <= 0) {
      showMessageModal("Please enter a valid deposit amount.", true);
      return;
    }

    // Show loading spinner while the API request is in progress
    showLoadingSpinner();

    // Make an AJAX call to the deposit API
    $.ajax({
      type: "POST",
      url: `${baseurl}/api/deposit-amount`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({ userId, amount }),
      success: function (response) {
        // Handle the success response here
        const supportWhatsAppData = response.supportWhatsAppData;

        // Update the modal with WhatsApp links, names, and statuses
        const whatsappLinksList = $(".whatsappLinks");
        whatsappLinksList.empty();

        supportWhatsAppData.forEach((contact) => {
          if (contact.status === "active") {
            whatsappLinksList.append(
              `<li><a href="${contact.whatsappLink}" target="_blank">${contact.name}</a></li>`
            );
          } else {
            whatsappLinksList.append(`<li>${contact.name} (Closed)</li>`);
          }
        });
        // Open the modal
        $("#depositModal").modal("show");
      },
      error: function (error) {
        // Handle the error response here
        showMessageModal(
          "An error occurred while submitting the deposit request.",
          true
        );
      },
      complete: function () {
        // Hide loading spinner when the API request is complete
        hideLoadingSpinner();
      },
    });
  });

  $("#closeModalButton").on("click", function () {
    $("#depositModal").modal("hide");
  });

  // Clear the selection color when the custom amount input field is focused
  $("#customDepositAmount").on("focus", function () {
    $(".deposit-amount-box").removeClass("amount-selected");
  });
});




//  ##############  DEPOSIT HISTORY API CALL #################

$(document).ready(function () {
  // Fetch the user's profile using the bearer token
  const token = localStorage.getItem("user_token");
  const decodedToken = parseJwt(token);
  const userId = decodedToken.userId;

  // console.log(first)

  // Function to show the loading spinner
  function showLoadingSpinner() {
    $(".loader-container").removeClass("d-none");
  }

  // Function to hide the loading spinner
  function hideLoadingSpinner() {
    $(".loader-container").addClass("d-none");
  }

  // Function to format timestamp using Moment.js
  function formatTimestamp(timestamp) {
    return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
  }

  // Function to fetch and display deposit history
  function fetchDepositHistory() {
    showLoadingSpinner();

    $.ajax({
      type: "GET",
      url: `${baseurl}/api/get-deposit-history/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (response) {
        hideLoadingSpinner();

        const depositHistory = response.depositHistory;
        const historyContainer = $(".deposit-history-container");

        if (depositHistory.length > 0) {
          // Iterate through deposit history and create entries
          depositHistory.forEach((entry) => {
            const historyEntry = `
                <div class="history d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <div><b class="text-white">Deposit</b></div>
                    <div class="text-black-50">
                      <small>${formatTimestamp(entry.timestamp)}</small>
                    </div>
                  </div>
                  <div>
                    <div class="paid-status">Paid</div>
                    <div class="text-black-50"><b>+${entry.amount.toFixed(
                      2
                    )}</b></div>
                  </div>
                </div>
              `;

            // Append the entry to the history container
            historyContainer.append(historyEntry);
          });
        } else {
          // Handle case where there is no deposit history to display
          historyContainer.html(
            '<h1 class="text-center">No deposit history available.<h1/>'
          );
        }
      },
      error: function (error) {
        hideLoadingSpinner();
        // Handle error
        console.error("Error fetching deposit history: ", error);
      },
    });
  }

  // Call the function to fetch and display deposit history
  fetchDepositHistory();
});
