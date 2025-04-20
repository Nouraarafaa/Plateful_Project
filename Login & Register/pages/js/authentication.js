document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    // Handle nav buttons visibility
    document.getElementById("loginBtn").style.display = isLoggedIn ? "none" : "inline";
    document.getElementById("registerBtn").style.display = isLoggedIn ? "none" : "inline";
    document.getElementById("profileBtn").style.display = isLoggedIn ? "inline" : "none";
    document.getElementById("contactBtn").style.display = isLoggedIn ? "inline" : "none";
    document.getElementById("favouritesBtn").style.display = isLoggedIn ? "inline" : "none";
    document.getElementById("logoutBtn").style.display = isLoggedIn ? "inline" : "none";
    document.getElementById("getStartedBtn").style.display = isLoggedIn ? "none" : "inline";
    
});

let users = JSON.parse(localStorage.getItem('users')) || [];

document.getElementById('signup').addEventListener('click', function () {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('registerFormContainer').style.display = 'block';
});

document.getElementById('signin').addEventListener('click', function () {
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('registerFormContainer').style.display = 'none';
});

document.getElementById('loginform').addEventListener('submit', function (event) {
    event.preventDefault();
    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;

    if (!validateEmail(email)) {
        document.getElementById('loginErrorMessage').textContent = 'Invalid email format!';
        document.getElementById('loginErrorMessage').style.display = 'block';
        return;
    }

    var user = users.find(user =>
        user.password === password &&
        user.email.toLowerCase() === email.toLowerCase()
    );

    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        document.getElementById('loginErrorMessage').style.display = 'none';
        window.location.href = "../../../User/pages/html/about.html";
    } else {
        document.getElementById('loginErrorMessage').textContent = 'Invalid email or password';
        document.getElementById('loginErrorMessage').style.display = 'block';
    }
});

document.getElementById('registerform').addEventListener('submit', function (event) {
    event.preventDefault();

    var Fname = document.getElementById('registerFName').value.trim();
    var Lname = document.getElementById('registerLName').value.trim();
    var password = document.getElementById('registerPassword').value.trim();
    var confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
    var phone = document.getElementById('registerPhone').value.trim();
    var email = document.getElementById('registerEmail').value.trim();

    if (!validateEmail(email)) {
        document.getElementById('registerErrorMessage').textContent = 'Invalid email format!';
        document.getElementById('registerErrorMessage').style.display = 'block';
        return;
    }

    if (!validatePassword(password)) {
        document.getElementById('registerErrorMessage').innerHTML = 'Password must be at least 8 characters long<br>and include uppercase, lowercase, number, and <br> special character.';
        document.getElementById('registerErrorMessage').style.display = 'block';
        return;
    }

    if (password !== confirmPassword) {
        document.getElementById('registerErrorMessage').textContent = 'Passwords do not match!';
        document.getElementById('registerErrorMessage').style.display = 'block';
        return;
    }

    var userExists = users.find(user => user.email.toLowerCase() === email.toLowerCase());

    if (userExists) {
        document.getElementById('registerErrorMessage').textContent = 'Email is already registered';
        document.getElementById('registerErrorMessage').style.display = 'block';
        return;
    }

    var newUser = {
        firstName: Fname,
        lastName: Lname,
        email,
        phone,
        password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem("isLoggedIn", "true");

    // Show success and switch to login form
    Swal.fire({
        title: "Registration Successful!",
        text: "You are now logged in.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#70974C"
    });
    window.location.href = "../../../User/pages/html/about.html";
    // Update navbar buttons
    document.getElementById("loginBtn").style.display = "none";
    document.getElementById("seperator").style.display = "none";
    document.getElementById("registerBtn").style.display = "none";
    document.getElementById("profileBtn").style.display = "inline";
    document.getElementById("logoutBtn").style.display = "inline";
    document.getElementById("getStartedBtn").style.display = "none";

    document.getElementById('registerErrorMessage').style.display = 'none';
    document.getElementById('registerFormContainer').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('registerform').reset();

});

function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "../../../index.html";
}

function validateEmail(email) {
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
}

