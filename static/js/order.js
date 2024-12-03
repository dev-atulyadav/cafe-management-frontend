function createOrderCard(orderData, dishData) {
  const orderDiv = document.createElement("div");
  orderDiv.id = dishData._id;
  orderDiv.className =
    "d-flex border-bottom p-3 flex-column align-item-center  gap-4";

  const img = document.createElement("div");
  img.style.backgroundImage = `url(${dishData.image})`;
  img.alt = dishData.name;
  img.className = "rounded orderImage border";

  const contentDiv = document.createElement("div");
  contentDiv.className = "col-md-8";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const cardTitle = document.createElement("h5");
  cardTitle.className = "card-title mb-4";
  cardTitle.textContent = dishData.name;

  const orderDetails = `
      <p>Order ID: <strong>${orderData.orderId}</strong></p>
      <p>Order Date: <strong>${orderData.orderDate}</strong></p>
      <p>Address: <strong>${orderData.deliveryLocation}</strong></p>
      <p>Order Status: <strong class="text-capitalize text-success">${orderData.orderStatus.replace(
        "-",
        " "
      )}</strong></p>
      <p>Delivery Status: <strong class="text-capitalize">${orderData.deliveryStatus.replace(
        "-",
        " "
      )}</strong></p>
      <p>Quantity: <small>${orderData.quantity}</small></p>
      <p>Price: <small>₹ ${dishData.price}</small></p>
      <p>Total: <small>₹ ${orderData.price}</small></p>
    `;
  cardBody.innerHTML = orderDetails;

  const buttonContainer = document.createElement("div");
  buttonContainer.className =
    "d-flex justify-content-start align-items-center gap-3";

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "btn btn-danger";
  cancelButton.textContent = "Cancel";

  contentDiv.appendChild(cardTitle);
  buttonContainer.appendChild(cancelButton);
  cardBody.appendChild(buttonContainer);
  contentDiv.appendChild(cardBody);
  orderDiv.appendChild(img);
  orderDiv.appendChild(contentDiv);
  document.getElementById("order-container").appendChild(orderDiv);
}

function renderOrders() {
  if (userData.orders && userData.orders.length > 0) {
    document.getElementById("loader").remove();
    userData.orders.forEach((order) => {
      console.log(order, dishes);
      dishes.forEach((dish) => {
        if (dish._id === order.dishId) {
          createOrderCard(order, dish);
        }
      });
    });
  } else if (userData.orders && userData.orders.length === 0) {
    document.getElementById("loaderImage").src =
      "/static/images/empty-cart.png";
  } else {
    setTimeout(() => {
      renderOrders();
    }, 2000);
  }
}
fetchDishes();
renderOrders();
