// Toggle between login and register forms
document.getElementById("signup").addEventListener("click", () => {
    document.getElementById("loginFormContainer").style.display = "none";
    document.getElementById("registerFormContainer").style.display = "block";
});

document.getElementById("signin").addEventListener("click", () => {
    document.getElementById("registerFormContainer").style.display = "none";
    document.getElementById("loginFormContainer").style.display = "block";
});

// Register user
document.getElementById("registerform").addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("registerFName").value.trim();
    const lastName = document.getElementById("registerLName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const phone = document.getElementById("registerPhone").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;

    // Check if all fields are filled out
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        Swal.fire("Error", "All fields are required!", "error");
        return;
    }

    // Email validation (basic format)
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        Swal.fire("Error", "Please enter a valid email address!", "error");
        return;
    }
    // Password strength check (at least 8 characters, one uppercase, one number)
    const passwordStrengthPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordStrengthPattern.test(password)) {
        Swal.fire("Error", "Password must be at least 8 characters, contain one uppercase letter, and one number.", "error");
        return;
    }
    const phonePattern = /^[0-9]{11}$/;
    if (!phonePattern.test(phone)) {
        Swal.fire("Error", "Please enter a valid phone number (11 digits).", "error");
        return;
    }
    // Password check
    if (password !== confirmPassword) {
        Swal.fire("Error", "Passwords do not match!", "error");
        return;
    }

    // Check for duplicate email
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find(user => user.email === email);

    if (userExists) {
        Swal.fire("Error", "E-mail already exists!", "error");
        return;
    }

    // Add user to localStorage
    users.push({ firstName, lastName, email, phone, password });
    localStorage.setItem("users", JSON.stringify(users));

    Swal.fire("Success", "Registered successfully!", "success").then(() => {
        document.getElementById("registerform").reset();
        document.getElementById("signin").click(); // Switch to login
    });
});

// Login user
document.getElementById("loginform").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    // Check if email and password are filled
    if (!email || !password) {
        Swal.fire("Error", "Both E-mail and password are required!", "error");
        return;
    }

    // Retrieve users from localStorage and validate login
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
        Swal.fire("Welcome", `Hello, ${validUser.firstName}!`, "success").then(() => {
            localStorage.setItem("loggedInUser", JSON.stringify(validUser));
            window.location.href = "../../../User/pages/html/card-recipes.html"; // Redirect to user profile
        });
    } else {
        Swal.fire("Error", "Invalid E-mail or password!", "error");
    }
});
