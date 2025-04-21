document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".categories-carousel");
    const items = document.querySelectorAll(".category-item");

    // Clone the items to create a seamless loop
    items.forEach(item => {
        const clone = item.cloneNode(true);
        carousel.appendChild(clone);
    });

    // Set the width of the carousel dynamically
    const totalItems = document.querySelectorAll(".category-item").length;
    carousel.style.width = `${totalItems * 150}px`; // Adjust width based on item count
});