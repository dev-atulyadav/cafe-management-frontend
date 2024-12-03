function updateStatus(id) {
  const dropdown = document.querySelector(`select[data-id="${id}"]`);
  const status = dropdown.value;
  alert(`Delivery status for Dish ID ${id} updated to: ${status}`);
}
const url = window.location.href;
const urlParams = new URL(url);
const orderId = urlParams.searchParams.get("orderId");
const email = urlParams.searchParams.get("email");
let userData = {};
const getUserByEmail = async () => {
  const response = await fetch(
    `http://localhost:3000/user/getUserByEmail/${email}`
  );
  const data = await response.json();
  userData = data;
  renderOrderDetails();
};

getUserByEmail();

function createTableRow(
  index,
  dishName,
  quantity,
  orderId,
  address,
  price,
  status
) {
  const row = document.createElement("tr");

  row.innerHTML = `
      <td>${index}</td>
      <td>${dishName}</td>
      <td>${quantity}</td>
      <td>${orderId}</td>
      <td>${address}</td>
      <td>${price}</td>
      <td>
        <select
          class="form-select form-select-sm delivery-status"
          data-id="${orderId}"
          onchange="updateStatus(${orderId})"
        >
          <option value="not-delivered" ${
            status === "not-delivered" ? "selected" : ""
          }>Pending</option>
          <option value="Delivered" ${
            status === "Delivered" ? "selected" : ""
          }>Delivered</option>
        </select>
      </td>
    `;

  const tableBody = document.getElementById("tableBody");
  tableBody.appendChild(row);
}
function updateStatus(id) {
  const selectElement = document.querySelector(`select[data-id="${id}"]`);
  const status = selectElement.value;
  console.log(`Order ${id} status updated to: ${status}`);
}

const renderOrderDetails = () => {
  console.log(userData.data.orders);

  if (userData.data.orders) {
    const orderDetails = userData.data.orders;
    orderDetails.forEach((order, index) => {
      if (order.orderStatus === "payment-successful") {
        createTableRow(
          index + 1,
          order.dishId,
          order.quantity,
          order.orderId,
          order.deliveryLocation,
          order.price,
          order.deliveryStatus
        );
      }
    });
  } else {
    setTimeout(() => {
      renderOrderDetails();
    }, 2000);
  }
};
