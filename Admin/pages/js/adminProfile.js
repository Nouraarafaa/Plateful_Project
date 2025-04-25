document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the logged-in admin's data from localStorage
  const loggedInAdmin = JSON.parse(localStorage.getItem("loggedInAdmin"));

  // Check if the admin is logged in
  if (loggedInAdmin) {
    // Populate profile information
    document.getElementById("profileFullName").textContent = `${loggedInAdmin.firstName} ${loggedInAdmin.lastName}`;
    document.getElementById("profileEmail").textContent = loggedInAdmin.email;
    document.getElementById("profileFirstName").textContent = loggedInAdmin.firstName;
    document.getElementById("profileLastName").textContent = loggedInAdmin.lastName;
    document.getElementById("profilePhone").textContent = loggedInAdmin.phone;
    document.getElementById("ID").textContent = loggedInAdmin.adminId;
    
    // If you have a profile picture URL in localStorage, set it here
    // document.querySelector(".profile-img").src = loggedInAdmin.profilePicture || "../../../imgs/user.jpg"; // Optional profile picture
  } else {
    // If no logged-in admin found, redirect to login page
    window.location.href = "../../../Login & Register/pages/html/authentication.html";
  }
});

// Change Password Function
function changePassword() {
  const oldPassword = document.getElementById("oldPassword").value;
  const newPassword = document.getElementById("newPassword").value;

  const loggedInAdmin = JSON.parse(localStorage.getItem("loggedInAdmin"));

  if (loggedInAdmin.password === oldPassword) {
    // Update password in localStorage
    loggedInAdmin.password = newPassword;
    localStorage.setItem("loggedInAdmin", JSON.stringify(loggedInAdmin));
    Swal.fire("Success", "Password updated successfully", "success");
  } else {
    Swal.fire("Error", "Incorrect old password", "error");
  }
}

// Save Profile Function (in case you want to update other info)
function saveProfile() {
  const loggedInAdmin = JSON.parse(localStorage.getItem("loggedInAdmin"));

  loggedInAdmin.firstName = document.getElementById("profileFirstName").textContent;
  loggedInAdmin.lastName = document.getElementById("profileLastName").textContent;
  loggedInAdmin.email = document.getElementById("profileEmail").textContent;
  loggedInAdmin.phone = document.getElementById("profilePhone").textContent;

  // Save the updated data back to localStorage
  localStorage.setItem("loggedInAdmin", JSON.stringify(loggedInAdmin));

  Swal.fire("Success", "Profile saved successfully", "success");
}

function logout() {
  // Clear logged-in admin data from localStorage
  localStorage.removeItem("loggedInAdmin");

  // Set admin to false
  localStorage.setItem("admin", "false");

  // Redirect to login page
  window.location.href = "../../../Login & Register/pages/html/authentication.html";

  // Log the admin value from localStorage for debugging
  console.log(localStorage.getItem("admin"));
}
