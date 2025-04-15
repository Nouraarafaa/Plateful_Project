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
  link.classList.remove('active'); // Remove "active" class from all links
});

// Loop through each link and add the "active" class if it matches the current page
navLinks.forEach(link => {
  const linkPage = link.getAttribute('href');
  if (link.href.includes(currentPage)) {
    link.classList.add('active'); // Add "active" class to the current link
  }
});