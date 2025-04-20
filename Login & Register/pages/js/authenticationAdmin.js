document.addEventListener("DOMContentLoaded", () => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const isLoggedInAdmin = localStorage.getItem("isLoggedInAdmin") === "true";

    // Handle nav buttons visibility
    document.getElementById("loginBtn")?.style && (document.getElementById("loginBtn").style.display = isLoggedInAdmin ? "none" : "inline");
    document.getElementById("registerBtn")?.style && (document.getElementById("registerBtn").style.display = isLoggedInAdmin ? "none" : "inline");
    document.getElementById("profileBtn")?.style && (document.getElementById("profileBtn").style.display = isLoggedInAdmin ? "inline" : "none");
    document.getElementById("contactBtn")?.style && (document.getElementById("contactBtn").style.display = isLoggedInAdmin ? "inline" : "none");
    document.getElementById("favouritesBtn")?.style && (document.getElementById("favouritesBtn").style.display = isLoggedInAdmin ? "inline" : "none");
    document.getElementById("logoutBtn")?.style && (document.getElementById("logoutBtn").style.display = isLoggedInAdmin ? "inline" : "none");
    document.getElementById("getStartedBtn")?.style && (document.getElementById("getStartedBtn").style.display = isLoggedInAdmin ? "none" : "inline");
});

// Load admins or initialize
let admins = JSON.parse(localStorage.getItem('admins')) || [];

// Switch to Register Form
document.getElementById('signup').addEventListener('click', function () {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('registerFormContainer').style.display = 'block';
});

// Switch to Login Form
document.getElementById('signin').addEventListener('click', function () {
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('registerFormContainer').style.display = 'none';
});

// Login Submission
document.getElementById('loginform').addEventListener('submit', function (event) {
    event.preventDefault();
    const adminId = document.getElementById('AdminId').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    const admin = admins.find(admin => admin.adminId === adminId && admin.password === password);

    if (admin) {
        localStorage.setItem('admin', JSON.stringify(admin));
        localStorage.setItem('isLoggedInAdmin', 'true');
        document.getElementById('loginErrorMessage').style.display = 'none';
        window.location.href = "../../../Admin/pages/html/about.html";
    } else {
        document.getElementById('loginErrorMessage').textContent = 'Invalid Admin ID or password!';
        document.getElementById('loginErrorMessage').style.display = 'block';
    }
});

// Register Submission
document.getElementById('registerform').addEventListener('submit', function (event) {
    event.preventDefault();

    const Fname = document.getElementById('registerFName').value.trim();
    const Lname = document.getElementById('registerLName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
    const adminId = document.getElementById('adminId').value.trim();

    if (!validateEmail(email)) {
        document.getElementById('registerErrorMessage').textContent = 'Invalid email format!';
        document.getElementById('registerErrorMessage').style.display = 'block';
        return;
    }

    if (!validatePassword(password)) {
        document.getElementById('registerErrorMessage').innerHTML = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.';
        document.getElementById('registerErrorMessage').style.display = 'block';
        return;
    }

    if (password !== confirmPassword) {
        document.getElementById('registerErrorMessage').textContent = 'Passwords do not match!';
        document.getElementById('registerErrorMessage').style.display = 'block';
        return;
    }

    const adminExists = admins.find(admin => admin.email.toLowerCase() === email.toLowerCase());

    if (adminExists) {
        document.getElementById('registerErrorMessage').textContent = 'Email is already registered!';
        document.getElementById('registerErrorMessage').style.display = 'block';
        return;
    }

    const newAdmin = {
        firstName: Fname,
        lastName: Lname,
        email,
        phone,
        password,
        adminId
    };

    admins.push(newAdmin);
    localStorage.setItem('admins', JSON.stringify(admins));
    localStorage.setItem('admin', JSON.stringify(newAdmin));
    localStorage.setItem('isLoggedInAdmin', 'true');

    Swal.fire({
        title: "Registration Successful!",
        text: "You are now logged in as Admin.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#70974C"
    }).then(() => {
        window.location.href = "../../../Admin/pages/html/about.html";
    });

    document.getElementById('registerFormContainer').style.display = 'none';
});
function logout() {
    localStorage.removeItem("admin");
    localStorage.removeItem("isLoggedInAdmin");
    window.location.href = "../../../Admin/pages/html/adminHome.html";
}