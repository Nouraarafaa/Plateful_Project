
document.getElementById("adminContact")?.style.display = "inline";
document.getElementById("adminRecipes")?.style.display = "inline";
document.getElementById("userRecipes")?.style.display = "inline";
document.getElementById("userContact")?.style.display = "inline";
// Select form containers
const loginFormContainer = document.getElementById("loginFormContainer");
const registerFormContainer = document.getElementById("registerFormContainer");

// Switch to register form
document.getElementById("signup").addEventListener("click", () => {
    loginFormContainer.style.display = "none";
    registerFormContainer.style.display = "block";
});

// Switch to login form
document.getElementById("signin").addEventListener("click", () => {
    registerFormContainer.style.display = "none";
    loginFormContainer.style.display = "block";
});

// Registration
document.getElementById("registerform").addEventListener("submit", function (e) {
    e.preventDefault();

    const adminId = document.getElementById("adminId").value.trim();
    const firstName = document.getElementById("registerFName").value.trim();
    const lastName = document.getElementById("registerLName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const phone = document.getElementById("registerPhone").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;
    const errorMessage = document.getElementById("registerErrorMessage");

    // Check if email already exists
    const admins = JSON.parse(localStorage.getItem("admins")) || [];
    const existingAdmin = admins.find(admin => admin.email === email);

    if (existingAdmin) {
        errorMessage.textContent = "E-mail already exists!";
        errorMessage.style.display = "block";
        return;
    }

    // Check password match
    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match!";
        errorMessage.style.display = "block";
        return;
    }

    // Save admin data
    admins.push({ adminId, firstName, lastName, email, phone, password });
    localStorage.setItem("admins", JSON.stringify(admins));

    // Clear and redirect to login
    this.reset();
    alert("Registration successful! Please log in.");
    registerFormContainer.style.display = "none";
    loginFormContainer.style.display = "block";
    errorMessage.style.display = "none";
});

// Login
document.getElementById("loginform").addEventListener("submit", function (e) {
    e.preventDefault();

    const adminId = document.getElementById("AdminId").value.trim();
    const password = document.getElementById("loginPassword").value;
    const errorMessage = document.getElementById("loginErrorMessage");

    const admins = JSON.parse(localStorage.getItem("admins")) || [];
    const admin = admins.find(admin => admin.adminId === adminId && admin.password === password);

    if (admin) {
        // Store login state
        localStorage.setItem("loggedInAdminId", admin.adminId);
        errorMessage.style.display = "none";
        alert("Login successful!");
        window.location.href = "../../../Admin/pages/html/card-recipes.html"; // Redirect
    } else {
        errorMessage.textContent = "Invalid ID or password!";
        errorMessage.style.display = "block";
    }
});
