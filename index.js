// Navigation bar

// Get the current page name from the URL
let currentPage = window.location.pathname;

// Extract just the file name 
currentPage = currentPage.substring(currentPage.lastIndexOf('/') + 1);

// If empty, assume it's index.html
if (currentPage === '') {
  currentPage = 'index.html';
}

// Select all navigation links
const navLinks = document.querySelectorAll('nav a');

// Reset all links by removing the "active" class
navLinks.forEach(link => {
  link.classList.remove('active');
});

// Loop through each link and add the "active" class if it matches the current page
navLinks.forEach(link => {
  const linkHref = link.getAttribute('href');

  // Skip this link if it goes to index.html and has class "btn"
  if (linkHref.includes('index.html') && link.classList.contains('auth-btn')) return;

  if (linkHref.includes(currentPage)) {
    link.classList.add('active');
  }
});
