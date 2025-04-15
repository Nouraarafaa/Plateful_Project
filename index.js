// Navigation bar

// Get the current page name from the URL
const currentPage = window.location.pathname;

// Select all navigation links
const navLinks = document.querySelectorAll('nav a');

// Loop through each link and add the "active" class if it matches the current page
navLinks.forEach(link => {
  if (link.href.includes(`${currentPage}`)) {
    link.classList.add('active'); // Add "active" class to the current link

  }
});