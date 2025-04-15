// Navigation bar

// Get the current page name from the URL
let currentPage = window.location.pathname.split("/").pop();
if (currentPage === "") currentPage = "index.html";

// Select all navigation links
const navLinks = document.querySelectorAll('nav a');

// Loop through each link and add the "active" class if it matches the current page
navLinks.forEach(link => {
  if (link.getAttribute('href').includes(currentPage)) {
    link.classList.add('active'); // Add "active" class to the current link

  }
});