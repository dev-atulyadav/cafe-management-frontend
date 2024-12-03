let userData = {};
const userEmail = window.localStorage.getItem("userEmail");
if (!userEmail) {
  window.location.pathname = "/auth/login.html";
}
async function getBankName() {
  try {
    const response = await fetch("../bankname.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const selectElement = document.getElementById("bankSelect");
    for (const [code, name] of Object.entries(data)) {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = name;
      selectElement.appendChild(option);
    }
    console.log("Bank data loaded:", data);
  } catch (error) {
    console.error("Failed to fetch bank names:", error);
  }
}

getBankName();

const submitBtns = document.querySelectorAll(` button[type ="submit"]`);
console.log(submitBtns);

// get user email from local storage and fetch user data from db
(async () => {
  if (userEmail) {
    try {
      const response = await fetch(
        `http://localhost:3000/user/getUserByEmail/${userEmail}`
      );
      const data = await response.json();
      if (data.status === 200) {
        userData = data.data;
        userData.orders.forEach((order) => {
          if (order.orderStatus === "payment pending") {
            console.log(order.orderId);
          }
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
})();

const updateUserPaymentStatus = async (orderId, orderStatus) => {
  const response = await fetch(
    `http://localhost:3000/order/update-user-order-status/${userEmail}/${orderId}/${orderStatus}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (data.status === 200) {
    console.log("Payment status updated successfully");
  }
};
function handleFormSubmission(event, paymentType) {
  event.preventDefault();
  const formData = new FormData(event.target);
  for (let [key, value] of formData.entries()) {
    if (!value.trim()) {
      alert(`Please fill out the ${key} field for ${paymentType}.`);
      return;
    }
  }
  userData.orders.forEach((order) => {
    if (order.orderStatus === "payment-pending") {
      updateUserPaymentStatus(order.orderId, "payment-successful");
      alert(
        ` Payment Confirmed of Rs.${order.price} !! Your Order ID: ${order.orderId}`
      );
    } else if (order.orderStatus !== "payment-successful") {
      updateUserPaymentStatus(order.orderId, "payment-failed");
      alert(" Payment failed");
    }
  });
  window.location.pathname = "/my-orders.html";
  const modal = bootstrap.Modal.getInstance(event.target.closest(".modal"));
  modal.hide();
  event.target.reset();
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("#cardModal form")
    .addEventListener("submit", (event) => {
      handleFormSubmission(event, "Credit/Debit Card");
    });
  document
    .querySelector("#paypalModal form")
    .addEventListener("submit", (event) => {
      handleFormSubmission(event, "PayPal");
    });
  document
    .querySelector("#netBankingModal form")
    .addEventListener("submit", (event) => {
      handleFormSubmission(event, "Net Banking");
    });
  document
    .querySelector("#upiModal form")
    .addEventListener("submit", (event) => {
      handleFormSubmission(event, "UPI");
    });
  document
    .querySelector("#mastercardModal form")
    .addEventListener("submit", (event) => {
      handleFormSubmission(event, "Mastercard");
    });
  document
    .querySelector("#walletModal form")
    .addEventListener("submit", (event) => {
      handleFormSubmission(event, "Wallet");
    });
});
