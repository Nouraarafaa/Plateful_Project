
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    document.getElementById("loginBtn")?.style.display = isLoggedIn ? "none" : "inline";
    document.getElementById("registerBtn")?.style.display = isLoggedIn ? "none" : "inline";
    document.getElementById("profileBtn")?.style.display = isLoggedIn ? "inline" : "none";
    document.getElementById("contactBtn")?.style.display = isLoggedIn ? "inline" : "none";
    document.getElementById("favouritesBtn")?.style.display = isLoggedIn ? "inline" : "none";
    document.getElementById("logoutBtn")?.style.display = isLoggedIn ? "inline" : "none";
    document.getElementById("getStartedBtn")?.style.display = isLoggedIn ? "none" : "inline";
});

let users = JSON.parse(localStorage.getItem('users')) || [];

document.getElementById('signup').addEventListener('click', () => {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('registerFormContainer').style.display = 'block';
});

document.getElementById('signin').addEventListener('click', () => {
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('registerFormContainer').style.display = 'none';
});

document.getElementById('loginform').addEventListener('submit', function (event) {
    event.preventDefault();
    const id = document.getElementById('AdminId').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    let user = users.find(u =>
        u.password === password &&
        (u.email.toLowerCase() === id.toLowerCase() || u.adminId?.toLowerCase() === id.toLowerCase())
    );

    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        document.getElementById('loginErrorMessage').style.display = 'none';

        if (user.role === 'admin') {
            window.location.href = "../html/adminAuth.html";
        } else {
            window.location.href = "../../../User/pages/html/about.html";
        }
    } else {
        document.getElementById('loginErrorMessage').textContent = 'Invalid email or password';
        document.getElementById('loginErrorMessage').style.display = 'block';
    }
});

document.getElementById('registerform').addEventListener('submit', function (event) {
    event.preventDefault();

    const adminId = document.getElementById('adminId').value.trim();
    const Fname = document.getElementById('registerFName').value.trim();
    const Lname = document.getElementById('registerLName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();

    if (!validateEmail(email)) {
        showError('registerErrorMessage', 'Invalid email format!');
        return;
    }

    if (!validatePassword(password)) {
        showError('registerErrorMessage', 'Password must be at least 8 characters long<br>and include uppercase, lowercase, number, and <br> special character.');
        return;
    }

    if (password !== confirmPassword) {
        showError('registerErrorMessage', 'Passwords do not match!');
        return;
    }

    const userExists = users.some(user =>
        user.email.toLowerCase() === email.toLowerCase() ||
        (adminId && user.adminId?.toLowerCase() === adminId.toLowerCase())
    );

    if (userExists) {
        showError('registerErrorMessage', 'Email or Admin ID is already registered');
        return;
    }

    const newUser = {
        adminId: adminId || null,
        firstName: Fname,
        lastName: Lname,
        email,
        phone,
        password,
        role: adminId ? "admin" : "user"
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem("isLoggedIn", "true");

    Swal.fire({
        title: "Registration Successful!",
        text: "You are now logged in.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#70974C"
    }).then(() => {
        if (newUser.role === 'admin') {
            window.location.href = "../html/adminAuth.html";
        } else {
            window.location.href = "../../../User/pages/html/about.html";
        }
    });

    document.getElementById('registerform').reset();
    document.getElementById('registerErrorMessage').style.display = 'none';
});

function showError(id, message) {
    const el = document.getElementById(id);
    el.innerHTML = message;
    el.style.display = 'block';
}

function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "../../../index.html";
}

function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
}
