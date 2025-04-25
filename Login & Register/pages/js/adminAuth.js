// Toggle between login and register forms
document.getElementById("signup").addEventListener("click", () => {
  document.getElementById("loginFormContainer").style.display = "none";
  document.getElementById("registerFormContainer").style.display = "block";
});

document.getElementById("signin").addEventListener("click", () => {
  document.getElementById("registerFormContainer").style.display = "none";
  document.getElementById("loginFormContainer").style.display = "block";
});

// Admin Register
document.getElementById("registerform").addEventListener("submit", function (e) {
  e.preventDefault();

  const adminId = document.getElementById("adminId").value.trim();
  const firstName = document.getElementById("registerFName").value.trim();
  const lastName = document.getElementById("registerLName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const phone = document.getElementById("registerPhone").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("registerConfirmPassword").value;

  
  const adminIdPattern = /^[a-zA-Z0-9]{8}$/;
  if (!adminIdPattern.test(adminId)) {
      Swal.fire("Error", "Admin ID must be 8 characters and alphanumeric.", "error");
      return;
  }

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

  const admins = JSON.parse(localStorage.getItem("admins")) || [];

  const adminExists = admins.find(admin => admin.email === email);

  if (adminExists) {
      Swal.fire("Error", "E-mail already exists!", "error");
      return;
  }

  // Adding the admin to localStorage
  admins.push({ adminId, firstName, lastName, email, phone, password });
  localStorage.setItem("admins", JSON.stringify(admins));

  Swal.fire("Success", "Admin registered successfully!", "success").then(() => {
      document.getElementById("registerform").reset();
      document.getElementById("signin").click(); // Switch to login
  });
});

// Admin Login
document.getElementById("loginform").addEventListener("submit", function (e) {
  e.preventDefault();

  const adminId = document.getElementById("AdminId").value.trim();
  const password = document.getElementById("loginPassword").value;

  const admins = JSON.parse(localStorage.getItem("admins")) || [];

  const validAdmin = admins.find(admin => admin.adminId === adminId && admin.password === password);

  if (validAdmin) {
      Swal.fire("Welcome", `Hello, Admin ${validAdmin.firstName}!`, "success").then(() => {
          localStorage.setItem("loggedInAdmin", JSON.stringify(validAdmin));
          window.location.href = "../../../Admin/pages/html/adminProfile.html"; // Redirect to admin dashboard
      });
  } else {
      Swal.fire("Error", "Invalid Admin ID or password!", "error");
  }
});
