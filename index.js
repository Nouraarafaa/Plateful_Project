// Navigation bar
// Select all navigation links
const navLinks = document.querySelectorAll('nav a');

// Get the current page name from the URL
const currentPage = window.location.pathname.split('/').pop();

// Loop through each link and add the "active" class if it matches the current page
navLinks.forEach(link => {
  if (link.getAttribute('href').includes(currentPage)) {
    link.classList.add('active'); // Add "active" class to the current link
  }
});