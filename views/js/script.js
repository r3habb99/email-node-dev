// Function to get a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Check if the successMessage cookie is present
const successMessage = getCookie('successMessage');
if (successMessage) {
  // Display the success message
  const successDiv = document.createElement('div');
  successDiv.className = 'success';
  successDiv.innerHTML =
    successMessage +
    '<button class="close-btn" onclick="removeMessage(this)">×</button>';
  document
    .querySelector('.container')
    .insertBefore(successDiv, document.querySelector('form'));

  // Remove the successMessage cookie after displaying it
  document.cookie = 'successMessage=; Max-Age=0; path=/';
}

// Function to remove the message
function removeMessage(element) {
  const messageDiv = element.parentElement;
  messageDiv.style.display = 'none';
}
