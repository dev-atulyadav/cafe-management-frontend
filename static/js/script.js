const forms = document.forms;
let userData = {};
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
const validPhone = (phone) => {
  return /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(
    phone.trim().replaceAll(" ", "")
  );
};

if (forms[0] !== undefined)
  if (forms[0].getAttribute("id") == "sign-up") {
    forms[0].addEventListener("submit", async function (event) {
      event.preventDefault();
      const name = forms[0].elements["name"].value;
      const email = document.getElementById("email").value;
      const phone = document
        .getElementById("phone")
        .value.trim()
        .replaceAll(" ", "");
      const address = document.getElementById("address").value;
      const password = document.getElementById("password").value;
      console.log(name, phone, email, password);

      if (
        name &&
        validateEmail(email) &&
        validPhone(phone) &&
        password.length >= 8 &&
        password.length <= 20
      ) {
        userData = {
          name,
          email,
          phone,
          address,
          password,
        };
        // console.log("Data is valid");
        // Send the form data to the server
        const response = await fetch(`http://localhost:3000/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            userData = data;
            if (data.status == 201) {
              localStorage.setItem("userEmail", email);
              window.location.replace("/");
            } else {
              alert(data.message);
            }
          });
      }
    });
  } else if (forms[0].getAttribute("id") == "login") {
    forms[0].addEventListener("submit", async function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      console.log(email, password);

      if (
        validateEmail(email) &&
        password.length >= 8 &&
        password.length <= 20
      ) {
        // console.log("Email and password are valid");
        // Send the form data to the server
        const response = await fetch(
          `http://localhost:3000/login/${email}/${password}`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.status == 200) {
              localStorage.setItem("userEmail", email);
              window.location.replace("/");
            } else {
              alert(data.message);
            }
          });
      }
    });
  }
console.log(userData);

const userBtn = document.getElementById("userBtn");
const profileBtn = document.getElementById("profileBtn");
const logoutBtn = document.getElementById("logoutBtn");
const cartBtn = document.getElementById("cartBtn");
const urlPath = window.location.pathname.toString();
console.log(userBtn);
if (userBtn && profileBtn) {
  if (localStorage.getItem("userEmail")) {
    userBtn.removeAttribute("class");
    cartBtn.setAttribute("href", "/cart/my-cart.html");
    userBtn.style.display = "none";
    profileBtn.setAttribute(
      "class",
      "d-flex justify-content-center align-items-center gap-3"
    );
  } else {
    userBtn.setAttribute("class", "d-flex gap-2");
    profileBtn.removeAttribute("class");
    profileBtn.style.display = "none";
  }
}
if (
  localStorage.getItem("userEmail") &&
  (urlPath.includes("/auth/sign-up") || urlPath.includes("/auth/login"))
) {
  window.location.replace("/");
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    localStorage.removeItem("userEmail");
    // const response = await fetch("http://localhost:3000/logout")
    //   .then((response) => response.json())
    //   .then((data) => data.status == 200 && window.location.replace("/login"));
    window.location.replace("/");
  });
}
const getUserData = async () => {
  const email = localStorage.getItem("userEmail");
  if (email) {
    const response = await fetch(
      `http://localhost:3000/getUserByEmail/${email}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          userData = data.data;
          setUserData(data.data);
        }
      });
  }
};
getUserData();
function setUserData(userData) {
  console.log(userData);
  if (window.location.pathname == "/my-profile.html") {
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const userPhone = document.getElementById("userPhone");
    const userAddress = document.getElementById("userAddress");

    userName.textContent =
      userData.name == null ? "Plese  fill in your name" : userData.name;
    userEmail.textContent =
      userData.email == null ? "Please fill in your email" : userData.email;
    userPhone.textContent =
      userData.phone == null ? "Please fill in your phone" : userData.phone;
    userAddress.textContent =
      userData.address == null
        ? "Please fill in your address"
        : userData.address;
  }
}

const deleteBtn = document.getElementById("deleteBtn");
if (deleteBtn)
  deleteBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:3000/deleteUserByEmail`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200) {
          localStorage.removeItem("userEmail");
          window.location.replace("/auth/login.html");
        }
      });
  });
