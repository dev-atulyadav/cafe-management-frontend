const forms = document.forms;
let userData = {};
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
if (forms[0] !== undefined)
  if (forms[0].getAttribute("id") == "sign-up") {
    forms[0].addEventListener("submit", async function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      if (
        validateEmail(email) &&
        password.length >= 8 &&
        password.length <= 20
      ) {
        console.log("Email and password are valid");
        // Send the form data to the server
        const response = await fetch(
          `http://localhost:3000/register/${email}/${password}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            userData = data;
            if (data.status == 201) {
              localStorage.setItem("userEmail", email);
              setTimeout(() => {
                window.location.replace("/");
              }, 2000);
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
        console.log("Email and password are valid");
        // Send the form data to the server
        const response = await fetch(
          `http://localhost:3000/login/${email}/${password}`
        )
          .then((response) => response.json())
          .then((data) => data.status == 200 && window.location.replace("/"));
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
