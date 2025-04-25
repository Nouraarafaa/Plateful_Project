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
      // Set the admin variable to true
      const admin = true;

      // Store the admin status in localStorage
      localStorage.setItem("admin", admin);

      Swal.fire("Welcome", `Hello, Admin ${validAdmin.firstName}!`, "success").then(() => {
          localStorage.setItem("loggedInAdmin", JSON.stringify(validAdmin));
          window.location.href = "../../../Admin/pages/html/card-recipes.html"; // Redirect to admin dashboard
      });
  } else {
      Swal.fire("Error", "Invalid Admin ID or password!", "error");
  }
});
