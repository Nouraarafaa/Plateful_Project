// Toggle between login and register forms
document.getElementById("signup").addEventListener("click", () => {
    document.getElementById("loginFormContainer").style.display = "none";
    document.getElementById("registerFormContainer").style.display = "block";
});

document.getElementById("signin").addEventListener("click", () => {
    document.getElementById("registerFormContainer").style.display = "none";
    document.getElementById("loginFormContainer").style.display = "block";
});

// Register form submission
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

    fetch("/auth/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            role: "user",
            password: password,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    throw new Error(data.detail || "Registration failed.");
                });
            }
            return response.json();
        })
        .then(() => {
            Swal.fire({
                title: "Success",
                text: "Registered successfully!",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                document.getElementById("registerform").reset();
                document.getElementById("signin").click(); // Switch to login
            });
        })
        .catch((error) => {
            Swal.fire("Error", error.message, "error");
        });
});

// Login form submission
document.getElementById("loginform").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    fetch("/auth/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    throw new Error(data.detail || "Login failed.");
                });
            }
            return response.json();
        })
        .then((data) => {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            localStorage.setItem("loggedInRole", "user");
            Swal.fire({
                title: "Welcome",
                text: `Hello, User!`,
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                window.location.href = "../../../User/pages/html/card-recipes.html";
            });
        })
        .catch((error) => {
            Swal.fire("Error", error.message, "error");
        });
});
