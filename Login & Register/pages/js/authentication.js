document.getElementById("signup").addEventListener("click", () => {
    document.getElementById("loginFormContainer").style.display = "none";
    document.getElementById("registerFormContainer").style.display = "block";
});

document.getElementById("signin").addEventListener("click", () => {
    document.getElementById("registerFormContainer").style.display = "none";
    document.getElementById("loginFormContainer").style.display = "block";
});

document.getElementById("registerform").addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("registerFName").value.trim();
    const lastName = document.getElementById("registerLName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const phone = document.getElementById("registerPhone").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;

    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        Swal.fire("Error", "All fields are required!", "error");
        return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        Swal.fire("Error", "Please enter a valid email address!", "error");
        return;
    }
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
    if (password !== confirmPassword) {
        Swal.fire("Error", "Passwords do not match!", "error");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find(user => user.email === email);

    if (userExists) {
        Swal.fire("Error", "E-mail already exists!", "error");
        return;
    }

    users.push({ firstName, lastName, email, phone, password });
    localStorage.setItem("users", JSON.stringify(users));
    Swal.fire({
        title: "Success",
        text: "Registered successfully!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
            confirmButton: "my-swal-button"
        }
    }).then(() => {
        document.getElementById("registerform").reset();
        document.getElementById("signin").click(); 
    });
    
});

document.getElementById("loginform").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        Swal.fire("Error", "Both E-mail and password are required!", "error");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
        console.log("Valid user found:", validUser); // Debugging log
        localStorage.setItem("loggedInUser", JSON.stringify(validUser));
        localStorage.setItem("loggedInRole", "user"); // Store role
        console.log("Logged in user stored in localStorage:", localStorage.getItem("loggedInUser")); // Debugging log
        Swal.fire({
            title: "Welcome",
            text: `Hello, ${validUser.firstName}!`,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
                confirmButton: "my-swal-button"
            }
        }).then(() => {
            window.location.href = "../../../User/pages/html/card-recipes.html";
        });
    } else {
        Swal.fire("Error", "Invalid E-mail or password!", "error");
    }
});
