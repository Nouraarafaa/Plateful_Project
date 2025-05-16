// Toggle between login and register forms
document.getElementById("signup").addEventListener("click", () => {
    document.getElementById("loginFormContainer").style.display = "none";
    document.getElementById("registerFormContainer").style.display = "block";
});

document.getElementById("signin").addEventListener("click", () => {
    document.getElementById("registerFormContainer").style.display = "none";
    document.getElementById("loginFormContainer").style.display = "block";
});

// Helper function to get CSRF token
function getCSRFToken() {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "csrftoken") {
            return value;
        }
    }
    return null;
}

const csrfToken = getCSRFToken();

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

    if (password.length < 8 || !/[+!@#$%^&*]/.test(password)) {
        Swal.fire("Error", "Password must be at least 8 characters long and include a special character.", "error");
        return;
    }

    Swal.fire({
        title: "Processing...",
        text: "Please wait while we process your request.",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    fetch("http://127.0.0.1:8000/api/auth/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            role: "admin",
            password: password,
        }),
    })
        .then((response) => {
            Swal.close();
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
                text: "Admin registered successfully!",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                document.getElementById("registerform").reset();
                document.getElementById("signin").click(); // Switch to login
            });
        })
        .catch((error) => {
            Swal.close();
            Swal.fire("Error", error.message, "error");
        });
});

// Login form submission
document.getElementById("loginform").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("AdminId").value.trim();
    const password = document.getElementById("loginPassword").value;

    Swal.fire({
        title: "Processing...",
        text: "Please wait while we log you in.",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        Swal.close();

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || "Login failed.");
        }

        const data = await response.json();
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("loggedInRole", "admin");
        // Store all admin info in localStorage for navigation and profile
        localStorage.setItem("loggedInAdmin", JSON.stringify({
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone,
            adminId: data.id
        }));

        await Swal.fire("Welcome", `Hello, Admin!`, "success");
        window.location.href = "../../../Admin/pages/html/card-recipes.html";
    } catch (error) {
        Swal.close();
        await Swal.fire("Error", error.message, "error");
    }
});
