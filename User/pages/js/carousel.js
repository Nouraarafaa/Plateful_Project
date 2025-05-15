document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".carousel-images img");
    const customerName = document.querySelector(".customer-name");
    const customerLocation = document.querySelector(".customer-location");
    const customerFeedback = document.querySelector(".customer-feedback");

    // Full testimonials list
    const allTestimonials = [
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

    let testimonials = [...allTestimonials]; // Default to all testimonials
    let filteredImages = [...images]; // Default to all images
    let currentIndex = 0;

    // Function to filter testimonials and images for small screens
    function filterTestimonialsForSmallScreens() {
        if (window.innerWidth <= 768) {
            // console.log("Small screen detected. Filtering testimonials...");
            testimonials = allTestimonials.filter(
                (testimonial) =>
                    testimonial.name !== "Smith Johnson" &&
                    testimonial.name !== "Emily Davis"
            );

            // Filter images to match the filtered testimonials
            filteredImages = Array.from(images).filter((img, index) => {
                const testimonial = allTestimonials[index];
                return (
                    testimonial.name !== "Smith Johnson" &&
                    testimonial.name !== "Emily Davis"
                );
            });

            // Hide images that are not part of the filtered testimonials
            images.forEach((img) => {
                img.style.display = "none"; // Hide all images by default
            });
            filteredImages.forEach((img) => {
                img.style.display = "block"; // Show only filtered images
            });
        } else {
            // console.log("Large screen detected. Restoring all testimonials...");
            testimonials = [...allTestimonials]; // Restore all testimonials
            filteredImages = [...images]; // Restore all images

            // Show all images
            images.forEach((img) => {
                img.style.display = "block";
            });
        }
        // console.log("Filtered testimonials:", testimonials);
        currentIndex = 0; // Reset index
        updateCarousel(); // Update the carousel
    }

    function updateCarousel() {
        // Remove active class from all images
        filteredImages.forEach(img => img.classList.remove("active"));

        // Add active class to the current image
        if (filteredImages[currentIndex] && testimonials[currentIndex]) {
            filteredImages[currentIndex].classList.add("active");
        }

        // Update testimonial content only if the testimonial exists
        if (testimonials[currentIndex]) {
            customerName.textContent = testimonials[currentIndex].name;
            customerLocation.textContent = testimonials[currentIndex].location;
            customerFeedback.textContent = testimonials[currentIndex].feedback;
        } else {
            // Clear the testimonial content if no testimonial exists
            customerName.textContent = "";
            customerLocation.textContent = "";
            customerFeedback.textContent = "";
        }

        // Move to the next index
        currentIndex = (currentIndex + 1) % testimonials.length;
    }

    // Initial update
    filterTestimonialsForSmallScreens();

    // Switch every 2 seconds
    setInterval(updateCarousel, 2000);

    // Listen for window resize to adjust testimonials
    window.addEventListener("resize", filterTestimonialsForSmallScreens);
});