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
        cart = userData.cart;
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
  try {
    const response = await fetch("http://localhost:3000/dishes/getAllDish");
    const data = await response.json();
    if (data.status === 200) {
      dishes = data.data;
      for (const dish of dishes) {
        if (
          dish.category === "top-rated" &&
          (window.location.pathname === "/index.html" ||
            window.location.pathname === "/")
        ) {
          createTopRatedDishCard(dish);
        }
      }
      if (window.location.pathname === "/menu.html") {
        renderDishesOnMenu();
      }
    }
  } catch (error) {
    console.error("Error fetching dishes:", error);
  }
};

function createTopRatedDishCard(dish) {
  const colA = document.createElement("a");
  colA.style.textDecoration = "none";
  colA.href = "/menu.html";
  colA.classList.add("col");
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  const img = document.createElement("img");
  img.src = dish.image;
  img.classList.add("card-img-top");
  img.style.height = "200px";
  img.style.objectFit = "cover";
  img.alt = dish.altText;
  cardDiv.appendChild(img);
  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.classList.add("card-body");
  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = dish.name;
  const cardText = document.createElement("p");
  cardText.classList.add("card-text");
  cardText.textContent = dish.description;
  cardBodyDiv.appendChild(cardTitle);
  cardBodyDiv.appendChild(cardText);
  cardDiv.appendChild(cardBodyDiv);
  colA.appendChild(cardDiv);
  document.getElementById("card-container").appendChild(colA);
}

const addOrderButtonListener = async (e) => {
  e.preventDefault();
  const dishId = e.target.closest(".dish-container").id;
  const quantity = 1;
  const existingDish = cart.find((item) => item.dishId === dishId);

  if (existingDish) {
    existingDish.quantity += quantity;
  } else {
    cart.push({ dishId, quantity });
  }

  await updateCartOnServer(e.target);
  document.getElementById("cartCounter").textContent = cart.length;
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
    if (orderBtn) {
      if (data.status === 200) {
        orderBtn.setAttribute("class", "btn-success btn position-absolute");
        setTimeout(() => {
          orderBtn.setAttribute("class", "btn btn-primary position-absolute");
        }, 1000);
      } else alert("Please Login to add meals in cart");
    } else {
      window.location.reload();
    }
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
          console.log(data);

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
const removeProductFromCart = (dishId) => {
  const dish = userData.cart.filter((item) => item.dishId == dishId)[0];
  if (Number(dish.quantity) > 1) {
    const newQuantity = dish.quantity - 1;
    cart.map((val) => {
      if (val.dishId == dishId) {
        val.quantity = newQuantity;
      }
    });
  } else {
    let dishCard = document.getElementById(dishId);
    cart.map((val, index) => {
      if (val.dishId == dishId) {
        cart.splice(index, 1);
      }
    });
    dishCard.remove();
  }
  updateCartOnServer();
};
// Create Product Card in Cart
const createProductCard = (dishData) => {
  const container = document.createElement("div");
  container.id = dishData._id;
  container.className = "d-flex border-bottom p-3 flex-column flex-sm-row";

  const img = document.createElement("img");
  img.src = dishData.image;
  img.className = "rounded border cartImage";

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
  const totalAmount = Number(quantity) * Number(dishData.price);
  const buttonContainer = document.createElement("div");
  buttonContainer.className =
    "d-flex justify-content-start align-items-center gap-3";

  const removeButton = createButton("Remove", "btn btn-danger");
  removeButton.addEventListener("click", (e) => {
    e.preventDefault();
    removeProductFromCart(dishData._id);
  });
  const confirmButton = createButton("Confirm", "btn btn-success");
  confirmButton.addEventListener("click", async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/order/add-order/${userData.email}/${dishData._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (data.status==200) {
        userData.cart = data.orders
        console.log(userData);
        
        localStorage.setItem("currentOrderId", userData.orders.orderId);
        alert(
          "Payable amount is: " +
            totalAmount +
            " You will be redirected to payment page!"
        );
        window.location.pathname = "/payment/payment-method.html";
      }
    } catch (error) {}
  });

  buttonContainer.append(removeButton, confirmButton);
  cardBody.append(cardTitle, cardText, quantityText, buttonContainer);
  textContainer.appendChild(cardBody);
  container.append(img, textContainer);
  const cartContainer = document.getElementById("cartContainer");
  cartContainer.style.height = "auto";
  cartContainer.appendChild(container);
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
  window.location.pathname === "/" ||
  window.location.pathname === "/menu.html"
) {
  fetchDishes();
}

if (window.location.pathname === "/cart/my-cart.html") {
  const dishCart = document.getElementById("dishCart");
  dishCart.style.display = "none";
  getCartDataFromServer(dishCart);
}

function createMenuCard(dish) {
  const colDiv = document.createElement("div");
  colDiv.id = dish._id;
  colDiv.classList.add("col", "dish-container");
  const cardDiv = document.createElement("div");
  cardDiv.style.paddingBottom = "3rem";
  cardDiv.classList.add("card", "h-100", "position-relative");
  const img = document.createElement("img");
  img.src = dish.image;
  img.classList.add("card-img-top");
  img.alt = dish.altText;
  cardDiv.appendChild(img);
  const cardBodyDiv = document.createElement("div");
  cardBodyDiv.classList.add("card-body");
  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = dish.name;
  const cardText = document.createElement("p");
  cardText.classList.add("card-text");
  cardText.textContent = dish.description;
  const cardPrice = document.createElement("p");
  cardPrice.classList.add("card-text");
  cardPrice.innerHTML = `<strong>Price:</strong> ₹${dish.price}`;
  const orderButton = document.createElement("button");
  orderButton.style.bottom = "1rem";
  orderButton.classList.add("btn", "btn-primary", "position-absolute");
  orderButton.textContent = "Order Now";
  orderButton.addEventListener("click", addOrderButtonListener);
  cardBodyDiv.appendChild(cardTitle);
  cardBodyDiv.appendChild(cardText);
  cardBodyDiv.appendChild(cardPrice);
  cardBodyDiv.appendChild(orderButton);
  cardDiv.appendChild(cardBodyDiv);
  colDiv.appendChild(cardDiv);
  return colDiv;
}

const renderDishesOnMenu = () => {
  const menuContainer = document.getElementById("menu-container");
  dishes.forEach((dish) => {
    const dishCard = createMenuCard(dish);
    menuContainer.appendChild(dishCard);
  });
  document.getElementById("cartCounter").textContent = cart.length;
};
