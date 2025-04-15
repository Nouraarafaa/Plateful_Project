// Navigation bar
// Select all navigation links
const navLinks = document.querySelectorAll('nav a');

// Get the current page name from the URL
const currentPage = window.location.pathname.split('/').pop().toLowerCase();

// Loop through each link and add the "active" class if it matches the current page
navLinks.forEach(link => {
  const linkHref = link.getAttribute('href').toLowerCase();
  if (linkHref.includes(currentPage)) {
    link.classList.add('active'); // Add "active" class to the current link
  } else {
    link.classList.remove('active'); // Remove "active" class from other links
  }
});