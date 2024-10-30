const forms = document.forms;
let userData = {};
let cart = [];
let dishes = [];

// Validation Functions
const validateEmail = (email) => {
  const emailPattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailPattern.test(String(email).toLowerCase());
};

const validPhone = (phone) => {
  const phonePattern = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
  return phonePattern.test(phone.trim().replaceAll(" ", ""));
};

// Form Submission Handling
const handleFormSubmission = async (event) => {
  event.preventDefault();
  const form = event.target;
  const name = form.elements["name"]?.value || "";
  const email = document.getElementById("email").value;
  const phone = document
    .getElementById("phone")
    .value.trim()
    .replaceAll(" ", "");
  const address = document.getElementById("address")?.value || "";
  const password = document.getElementById("password").value;

  if (validateForm(name, email, phone, password)) {
    userData = { name, email, phone, address, password };
    await submitUserData("register", userData);
  }
};

const validateForm = (name, email, phone, password) => {
  return (
    name &&
    validateEmail(email) &&
    validPhone(phone) &&
    password.length >= 8 &&
    password.length <= 20
  );
};

const submitUserData = async (action, data) => {
  try {
    const response = await fetch(`http://localhost:3000/user/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);

    if (result.status === 200 || result.status === 201) {
      localStorage.setItem("userEmail", data.email);
      window.location.replace("/");
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Error submitting user data:", error);
  }
};

// Login Handling
const handleLogin = async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (validateEmail(email) && password.length >= 8 && password.length <= 20) {
    await submitUserData("login", { email, password });
  }
};

// Setup Event Listeners for Forms
if (forms[0]) {
  const formId = forms[0].getAttribute("id");
  forms[0].addEventListener(
    "submit",
    formId === "sign-up" ? handleFormSubmission : handleLogin
  );
}

// User Button Setup
const setupUserButtons = () => {
  const userBtn = document.getElementById("userBtn");
  const profileBtn = document.getElementById("profileBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const cartBtn = document.getElementById("cartBtn");
  const userEmail = localStorage.getItem("userEmail");

  if (userEmail) {
    userBtn.removeAttribute("class");
    userBtn.style.display = "none";
    cartBtn.setAttribute("href", "/cart/my-cart.html");
    profileBtn.classList.add(
      "d-flex",
      "justify-content-center",
      "align-items-center",
      "gap-3"
    );
  } else {
    userBtn.classList.add("d-flex", "gap-2");
    if (profileBtn) {
      profileBtn.removeAttribute("class");
      profileBtn.style.display = "none";
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userEmail");
      window.location.replace("/");
    });
  }
};

setupUserButtons();

// Fetch User Data
const fetchUserData = async () => {
  const email = localStorage.getItem("userEmail");
  if (email) {
    try {
      const response = await fetch(
        `http://localhost:3000/user/getUserByEmail/${email}`
      );
      const data = await response.json();
      if (data.status === 200) {
        userData = data.data;
        displayUserData(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
};

const displayUserData = (data) => {
  if (window.location.pathname === "/my-profile.html") {
    document.getElementById("userName").textContent =
      data.name || "Please fill your name";
    document.getElementById("userEmail").textContent =
      data.email || "Please fill your email";
    document.getElementById("userPhone").textContent =
      data.phone || "Please fill your phone";
    document.getElementById("userAddress").textContent =
      data.address || "Please fill your address";
  }
};

fetchUserData();

// Delete User
const setupDeleteUserButton = () => {
  const deleteBtn = document.getElementById("deleteBtn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(
          `http://localhost:3000/user/deleteUserByEmail`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          }
        );
        const data = await response.json();
        if (data.status === 200) {
          localStorage.removeItem("userEmail");
          window.location.replace("/auth/login.html");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    });
  }
};

setupDeleteUserButton();

// Fetch Dishes
const fetchDishes = async () => {
  console.log("hi");

  try {
    const response = await fetch("http://localhost:3000/dishes/getAllDish");
    const data = await response.json();
    if (data.status === 200) {
      dishes = data.data;
      renderDishes();
    }
  } catch (error) {
    console.error("Error fetching dishes:", error);
  }
};

const renderDishes = () => {
  const cardContainer = document.getElementById("card-container");
  dishes.forEach((value) => {
    const card = createDishCard(value);
    cardContainer.appendChild(card);
  });
  addOrderButtonListeners();
};

const createDishCard = (value) => {
  const card = document.createElement("div");
  card.id = value._id;
  card.className = "card";
  card.style.width = "18rem";

  const img = document.createElement("img");
  img.src = value.image || "";
  img.className = "card-img-top h-50";
  img.alt = value.name;
  card.appendChild(img);

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const cardTitle = document.createElement("h5");
  cardTitle.className = "card-title";
  cardTitle.textContent = value.name;

  const cardText = document.createElement("p");
  cardText.className = "card-text";
  cardText.innerHTML = value.description;

  const orderBtn = document.createElement("a");
  orderBtn.href = "#";
  orderBtn.className = "btn btn-primary orderBtn";
  orderBtn.textContent = "Order Now";

  cardBody.append(cardTitle, cardText, orderBtn);
  card.appendChild(cardBody);

  return card;
};

const addOrderButtonListeners = () => {
  const orderBtns = document.getElementsByClassName("orderBtn");
  Array.from(orderBtns).forEach((orderBtn) => {
    orderBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const dishId = orderBtn.closest(".card").id;
      const quantity = 1;
      const existingDish = cart.find((item) => item.dishId === dishId);

      if (existingDish) {
        existingDish.quantity += quantity;
      } else {
        cart.push({ dishId, quantity });
      }

      await updateCartOnServer(orderBtn);
    });
  });
};

const updateCartOnServer = async (orderBtn) => {
  try {
    const response = await fetch(
      `http://localhost:3000/dishes/addToCart/${userData.email}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart),
      }
    );
    const data = await response.json();
    if (data.status === 200) {
      orderBtn.setAttribute("class","btn-success btn orderBtn")
      setTimeout(() => {
        orderBtn.setAttribute("class","btn-primary btn orderBtn")
      }, 1000);
      console.log(cart, data);}
    else alert("Please Login to add meals in cart");
  } catch (error) {
    console.error("Error updating cart on server:", error);
  }
};

// Get Cart Data
const getCartDataFromServer = async (dishCart) => {
  const loader = document.getElementById("loader");
  if (userData.cart) {
    if (userData.cart.length > 0) {
      for (const element of userData.cart) {
        try {
          const response = await fetch(
            `http://localhost:3000/dishes/getDishByDishId/${element.dishId}`
          );
          const data = await response.json();
          if (data.data) {
            createProductCard(data.data);
          }
        } catch (error) {
          console.error("Error fetching dish data for cart:", error);
        }
      }
      dishCart.style.display = "block";
      loader.remove();
      loader.style.display = "none";
    } else {
      const loaderImage = document.getElementById("loaderImage");
      loaderImage.src = "/static/images/empty-cart.png";
    }
  } else {
    setTimeout(() => getCartDataFromServer(dishCart), 3000);
  }
};

// Create Product Card in Cart
const createProductCard = (dishData) => {
  const container = document.createElement("div");
  container.className = "d-flex border-bottom p-3";

  const img = document.createElement("img");
  img.src = dishData.image;
  img.style.width = "20rem";
  img.className = "rounded border";

  const textContainer = document.createElement("div");
  textContainer.className = "col-md-8";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const cardTitle = document.createElement("h5");
  cardTitle.className = "card-title";
  cardTitle.textContent = dishData.name;

  const cardText = document.createElement("p");
  cardText.className = "card-text";
  cardText.textContent = dishData.description;

  const quantityText = document.createElement("p");
  const quantity =
    userData.cart.find((item) => item.dishId === dishData._id)?.quantity || 0;
  quantityText.innerHTML = `Quantity: <small>${quantity}</small>`;

  const buttonContainer = document.createElement("div");
  buttonContainer.className =
    "d-flex justify-content-start align-items-center gap-3";

  const removeButton = createButton("Remove", "btn btn-danger");
  const confirmButton = createButton("Confirm", "btn btn-success");

  buttonContainer.append(removeButton, confirmButton);
  cardBody.append(cardTitle, cardText, quantityText, buttonContainer);
  textContainer.appendChild(cardBody);
  container.append(img, textContainer);
  document.getElementById("cartContainer").appendChild(container);
};

const createButton = (text, className) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = text;
  return button;
};

if (
  window.location.pathname === "/index.html" ||
  window.location.pathname === "/"
) {
  fetchDishes();
}

if (window.location.pathname === "/cart/my-cart.html") {
  const dishCart = document.getElementById("dishCart");
  dishCart.style.display = "none";
  getCartDataFromServer(dishCart);
}
