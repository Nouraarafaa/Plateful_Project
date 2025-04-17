document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
      const protectedLinks = [
          "../../../user/pages/html/card-recipes.html",
          "../../../User/pages/html/favourites.html",
          "../../../User/pages/html/profile.html",
          "../../../User/pages/html/contact.html"
      ];

      // Lock desktop nav
      document.querySelectorAll("nav .nav-links a").forEach(link => {
          if (protectedLinks.includes(link.getAttribute("href"))) {
              link.style.pointerEvents = "none";
              link.style.opacity = "0.5";
              link.title = "Login required";
          }
      });

      // Lock mobile nav
      document.querySelectorAll(".mobile-nav a").forEach(link => {
          if (protectedLinks.includes(link.getAttribute("href"))) {
              link.style.pointerEvents = "none";
              link.style.opacity = "0.5";
              link.title = "Login required";
          }
      });
  }
});
let users = JSON.parse(localStorage.getItem('users')) || [];  

document.getElementById('signup').addEventListener('click', function() {
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('registerFormContainer').style.display = 'block';
});

document.getElementById('signin').addEventListener('click', function() {
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('registerFormContainer').style.display = 'none';
});

document.getElementById('loginform').addEventListener('submit', function(event) {
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
        localStorage.setItem('username', user.username); 
        window.location.href = "../../../User/pages/html/about.html"; 
        document.getElementById('loginErrorMessage').style.display = 'none';
    } else {
        document.getElementById('loginErrorMessage').textContent = 'Invalid email or password';
        document.getElementById('loginErrorMessage').style.display = 'block';
    }
});

document.getElementById('registerform').addEventListener('submit', function(event) {
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
    document.getElementById('registerErrorMessage').textContent = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.';
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

  Swal.fire({
    title: "Registration Successful!",
    text: "You can now log in with your account.",
    icon: "success",
    confirmButtonText: "OK",
    confirmButtonColor: "#70974C"
  });

  document.getElementById('registerErrorMessage').style.display = 'none';
  document.getElementById('registerFormContainer').style.display = 'none';
  document.getElementById('loginFormContainer').style.display = 'block';
  document.getElementById('registerform').reset();
});


function validateEmail(email) {
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
}
  
