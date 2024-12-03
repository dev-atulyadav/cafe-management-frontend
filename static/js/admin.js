let adminData = {};
const getAdminByEmail = async (email) => {
  fetch(`http://localhost:3000/admin/getAdminByEmail/${email}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 200) adminData = data;
      console.log(adminData);
    })
    .catch((error) => console.error("Error:", error));
};
if (localStorage.getItem("adminEmail")) {
  getAdminByEmail(localStorage.getItem("adminEmail"));
} 
if (window.location.pathname === "/admin/auth-admin.html") {
  const formTitle = document.getElementById("form-title");
  const authForm = document.getElementById("auth-form");
  const confirmPasswordGroup = document.getElementById(
    "confirm-password-group"
  );
  const submitBtn = document.getElementById("submit");
  const toggleLink = document.querySelector(".toggle-link");
  let isLogin = true;

  function toggleForm() {
    isLogin = !isLogin;
    if (isLogin) {
      formTitle.innerText = "Admin Login";
      confirmPasswordGroup.style.display = "none";
      toggleLink.innerText = "Don't have an account? Sign Up";
      authForm.querySelector("button").innerText = "Login";
    } else {
      formTitle.innerText = "Admin Sign-Up";
      confirmPasswordGroup.style.display = "block";
      toggleLink.innerText = "Already have an account? Login";
      authForm.querySelector("button").innerText = "Sign Up";
    }
  }
  const handleAdminAuth = async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirm-password")
      .value.trim();
    if (email && password) {
      if (isLogin) {
        try {
          const response = await fetch("http://localhost:3000/admin/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
          const data = await response.json();
          if (data.status === 201) {
            localStorage.setItem("adminEmail", email);
            window.location.href = "/admin/dashboard.html";
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        if (password === confirmPassword) {
          try {
            const response = await fetch(
              "http://localhost:3000/admin/sign-up",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
              }
            );
            const data = await response.json();
            if (data.status === 200) {
              localStorage.setItem("adminEmail", email);
              window.location.href = "/admin/dashboard.html";
            } else {
              alert(data.message);
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  };

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleAdminAuth();
  });
}
// Function to create a table row
function createUserRow(id, name, orderId, deliveryStatus, email) {
  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${orderId}</td>
        <td>${deliveryStatus}</td>
        <td>
            <a href= "/admin/order-details.html?orderId=${orderId}&email=${email}" class="btn btn-sm btn-success">View Orders</a>
        </td>
    `;

  return row;
}
if (window.location.pathname === "/admin/dashboard.html") {
  document.getElementById("adminEmail").textContent =
    localStorage.getItem("adminEmail");
  const tableBody = document.querySelector("tbody");
  document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("adminEmail");
    window.location.pathname = "/admin/auth-admin.html";
  });
  const renderUers = () => {
    if (adminData.data) {
      document.getElementById("loader").remove();
      console.log(adminData.data.users);

      adminData.data.users.forEach((user, index) => {
        console.log(user.order);

        tableBody.appendChild(
          createUserRow(
            index + 1,
            user.userName,
            user.order.orderId,
            user.order.deliveryStatus.replace("-", " "),
            user.userEmail
          )
        );
      });
    } else {
      setTimeout(() => {
        renderUers();
      }, 2000);
    }
  };
  renderUers();
}
