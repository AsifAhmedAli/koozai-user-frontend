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


$(document).ready(function () {
    // Check if a token exists in local storage
    const token = localStorage.getItem('user_token');
    
    if (!token) {
        console.log('No token found. Please log in to get the user profile.');
        return;
    }
    
    // Parse the token to get the user ID
    const decodedToken = parseJwt(token);
    const userId = decodedToken.userId;
    $.ajax({
        url: `${baseurl}/api/get-user-profile/${userId}`,
        headers: {
            Authorization: `Bearer ${token}`,
          },
        type: 'GET',
        success: function(data) {
        const currentLevel = data.level_name.toLowerCase();
        
        // Set "Current" text based on the current level
        if (currentLevel === 'bronze') {
            $('#current-membership-bronze').text('Current');
            $('#current-membership-bronze').addClass('current-member');
        } else if (currentLevel === 'silver') {
            $('#current-membership-silver').text('Current');
            $('#current-membership-silver').addClass('current-member');
        } else if (currentLevel === 'gold') {
            $('#current-membership-gold').text('Current');
            $('#current-membership-gold').addClass('current-member');
        } else if (currentLevel === 'diamond') {
            $('#current-membership-diamond').text('Current');
            $('#current-membership-diamond').addClass('current-member');
        }
        },
        error: function() {
        // Handle errors if the API request fails
        console.log('Failed to fetch current level');
        }
    });
  



    
});

  
  
  
  