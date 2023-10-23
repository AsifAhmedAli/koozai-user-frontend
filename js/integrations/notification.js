


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
    // Function to fetch notifications and update the container
    function fetchNotifications() {
        // Show loading spinner
        $('#loadingSpinner').removeClass('d-none');

        // Fetch notifications from your API
        const token = localStorage.getItem('user_token');
        const decodedToken = parseJwt(token);
        const userId = decodedToken.userId; // Get the user ID

        $.ajax({
            type: 'GET',
            url: `${baseurl}/api/get-notifications/${userId}`, 
            headers: {
                'Authorization': `Bearer ${auth_token}`,
            },
            beforeSend: function (xhr) {
                // Set any additional headers here if needed
            },
            success: function (response) {
                // Hide loading spinner
                $('#loadingSpinner').addClass('d-none');

                // Process notifications
                const notificationsContainer = $('#notificationsContainer');
                notificationsContainer.empty();

                response.notifications.forEach((notification) => {
                    const bgColor = notification.is_read ? 'white' : 'lightblue';
                    const textClass = notification.is_read ? 'read' : 'unread';

                    const notificationHtml = `
                        <div class="box mb-3" style="background-color: ${bgColor}; cursor: pointer;" data-notification-id="${notification.id}">
                            <h6 class="notification-text ${textClass}">${notification.message}</h6>
                            <small class="text-black-50 mb-0">${moment(notification.created_at).format('YYYY-MM-DD HH:mm:ss')}</small>
                        </div>
                    `;

                    notificationsContainer.append(notificationHtml);
                });

                // Attach click event to notifications
                $('.box').click(function () {
                    const notificationId = $(this).data('notification-id');
                    markNotificationAsRead(notificationId);
                });
            },
            error: function (error) {
                // Hide loading spinner
                $('#loadingSpinner').addClass('d-none');

                // Show an error notification using Toastr
                toastr.error(error.responseJSON.error, 'Error', toastrOptions);
            },
        });
    }

    // Function to mark a notification as read
    function markNotificationAsRead(notificationId) {
        $.ajax({
            type: 'PUT',
            url: `${baseurl}/api/mark-notification-as-read`, 
            data: JSON.stringify({ notificationId }),
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${auth_token}`,
            },
            success: function (response) {
                // Mark the notification as read in the UI
                $(`.box[data-notification-id="${notificationId}"]`).css('background-color', 'white');
                $(`.notification-text[data-notification-id="${notificationId}"]`).removeClass('unread').addClass('read');
            },
            error: function (error) {
                // Show an error notification using Toastr
                toastr.error(error.responseJSON.error, 'Error', toastrOptions);
            },
        });
    }

    // Call the fetchNotifications function when the page loads
    fetchNotifications();
});
