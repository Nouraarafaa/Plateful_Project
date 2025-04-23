document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".carousel-images img");
    const customerName = document.querySelector(".customer-name");
    const customerLocation = document.querySelector(".customer-location");
    const customerFeedback = document.querySelector(".customer-feedback");

    const testimonials = [
        {
            name: "John Doe",
            location: "United States",
            feedback: "This platform has completely transformed the way I cook. The recipes are easy to follow and delicious!"
        },
        {
            name: "Smith Johnson",
            location: "Canada",
            feedback: "I love the variety of recipes available. There's something for everyone!"
        },
        {
            name: "Michael Brown",
            location: "Australia",
            feedback: "The step-by-step instructions make cooking so much easier. Highly recommend!"
        },
        {
            name: "Emily Davis",
            location: "United Kingdom",
            feedback: "A fantastic resource for home cooks. The recipes are creative and inspiring!"
        },
        {
            name: "Arlene McCoy",
            location: "Germany",
            feedback: "This platform has helped me discover new cuisines and improve my cooking skills."
        },
        {
            name: "Linda Wilson",
            location: "Italy",
            feedback: "The community aspect is great. I love sharing my own recipes and trying others' creations!"
        },
    ];

    let currentIndex = 0;

    function updateCarousel() {
        // Remove active class from all images
        images.forEach(img => img.classList.remove("active"));

        // Add active class to the current image
        images[currentIndex].classList.add("active");

        // Update testimonial content
        customerName.textContent = testimonials[currentIndex].name;
        customerLocation.textContent = testimonials[currentIndex].location;
        customerFeedback.textContent = testimonials[currentIndex].feedback;

        // Move to the next index
        currentIndex = (currentIndex + 1) % testimonials.length;
    }

    // Initial update
    updateCarousel();

    // Switch every 2 seconds
    setInterval(updateCarousel, 2000);
});