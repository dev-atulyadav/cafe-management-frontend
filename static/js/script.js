const forms = document.forms;
// console.log(forms[0].getAttribute("id"));

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
          .then(
            (data) =>
              data.status == 201 && window.location.replace("/frontend/")
          );
      }
    });
  }
