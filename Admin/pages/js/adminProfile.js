document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("admin"));

  if (!user) {
    window.location.href = "../../../Login & Register/pages/html/adminAuth.html";
    return;
  }

  // Fill profile with user data
  document.getElementById("profileFullName").textContent = `${admin.firstName} ${admin.lastName}`;
  document.getElementById("profileEmail").textContent = admin.email;
  document.getElementById("profileFirstName").textContent = admin.firstName;
  document.getElementById("profileLastName").textContent = admin.lastName;
  document.getElementById("profilePhone").textContent = admin.phone;
});
