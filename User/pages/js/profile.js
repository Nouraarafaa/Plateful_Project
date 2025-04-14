document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    if (document.getElementById("profileName"))
      document.getElementById("profileName").textContent = `${user.firstName} ${user.lastName}`;
    if (document.getElementById("profileEmail"))
      document.getElementById("profileEmail").textContent = user.email;
    if (document.getElementById("firstName"))
      document.getElementById("firstName").textContent = user.firstName;
    if (document.getElementById("lastName"))
      document.getElementById("lastName").textContent = user.lastName;
    if (document.getElementById("phone"))
      document.getElementById("phone").textContent = user.phone;
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      let users = JSON.parse(localStorage.getItem("users")) || [];
  
      // Remove current user from users array
      users = users.filter(user => user.email !== currentUser.email);
  
      // Update the users list in localStorage
      localStorage.setItem("users", JSON.stringify(users));
  
      // Remove current session
      localStorage.removeItem("user");
  
      // Redirect to login page
      window.location.href = "../../../Login & Register/pages/html/authentication.html";
    });
  }
});