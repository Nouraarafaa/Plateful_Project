window.onload = () => {
  // Check if a user is logged in
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (loggedInUser) {
      // If logged in, display user data on the profile page
      document.getElementById("profileFullName").textContent = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
      document.getElementById("profileEmail").textContent = loggedInUser.email;
      document.getElementById("profileFirstName").textContent = loggedInUser.firstName;
      document.getElementById("profileLastName").textContent = loggedInUser.lastName;
      document.getElementById("profilePhone").textContent = loggedInUser.phone;

      // Optional: Hide login/register buttons if logged in
      document.getElementById("loginBtn").style.display = "none";
      document.getElementById("registerBtn").style.display = "none";
  } else {
      // If no user is logged in, redirect to login page
      window.location.href = "../../../Login & Register/pages/html/authentication.html";
  }
};

// Log out function
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "../../../Login & Register/pages/html/authentication.html";
}

// Save Profile function (if needed)
function saveProfile() {
  const firstName = document.getElementById("profileFirstName").textContent;
  const lastName = document.getElementById("profileLastName").textContent;
  const phone = document.getElementById("profilePhone").textContent;

  // You can update the profile details here, for example, saving back to localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  loggedInUser.firstName = firstName;
  loggedInUser.lastName = lastName;
  loggedInUser.phone = phone;

  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

  Swal.fire("Success", "Profile updated successfully!", "success");
}

// Change Password (optional function)
function changePassword() {
  const oldPassword = document.getElementById("oldPassword").value;
  const newPassword = document.getElementById("newPassword").value;

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (loggedInUser.password === oldPassword) {
      loggedInUser.password = newPassword;
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

      Swal.fire("Success", "Password changed successfully!", "success");
  } else {
      Swal.fire("Error", "Incorrect old password!", "error");
  }
}
