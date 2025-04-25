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

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
        Swal.fire("Welcome", `Hello, ${validUser.firstName}!`, "success").then(() => {
            localStorage.setItem("loggedInUser", JSON.stringify(validUser));
            window.location.href = "../../../User/pages/html/card-recipes.html";
        });
    } else {
        Swal.fire("Error", "Invalid E-mail or password!", "error");
    }
});
