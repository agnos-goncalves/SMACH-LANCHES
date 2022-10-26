function tableOrdersListeners() {
  const buttons = document.querySelectorAll(".table-all-orders .btn.__event");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("order-id");
      changeOrderStatus(productId);
      tableOrdersRender();
    });
  });
}

function tableOrdersRender() {
  const btn = {
    received: "btn btn-default __event __received",
    done: "btn btn-warning __event __done",
    delivered: "btn btn-success __delivered",
  };
  const ordersMapped = SMACH.orders.map((order) => ({
    ...order,
    id: `<input class="row-field-checkbox" type="checkbox" />${order.id}`,
    status: `<button order-id="${order.id}" class="${btn[order.status]}">${
      order.status
    }</button>`,
  }));

  tableRender(".table-all-orders", ordersMapped, [
    "id",
    "name",
    "type",
    "priceTotal",
    "status",
  ]);

  tableOrdersListeners();
}

function changeOrderStatus(orderId) {
  const getStatus = {
    [ORDER_STATE.RECEIVED]: ORDER_STATE.DONE,
    [ORDER_STATE.DONE]: ORDER_STATE.DELIVERED,
    [ORDER_STATE.DELIVERED]: ORDER_STATE.DELIVERED,
  };

  SMACH.orders = SMACH.orders.map((order) => {
    if (order.id === orderId) {
      return { ...order, status: getStatus[order.status] };
    }
    return order;
  });
  return SMACH.orders;
}

function getTotalPriceToNewOrder() {
  return SMACH.newOrder.products.reduce(
    (priceTotal, product) => (priceTotal += product.priceTotal),
    0
  );
}

function addNewOrderInOrder(newOrder) {
  const name = newOrder.products.reduce(
    (name, product) => (name += `${product.quantity} - ${product.name}`),
    ""
  );
  const priceTotal = newOrder.products.reduce(
    (priceTotal, product) => (priceTotal += product.priceTotal),
    0
  );

  const order = {
    id: uuid(),
    name,
    priceTotal,
    status: ORDER_STATE.RECEIVED,
    ...newOrder,
  };
  SMACH.orders.push(order);
  SMACH.newOrder.products = [];
}

function addProductToNewOrder(product) {
  const productIndex = SMACH.newOrder.products.findIndex(
    (orderItem) => orderItem.code === product.code
  );
  const productFinded = SMACH.newOrder.products[productIndex];
  if (productFinded) {
    productFinded.quantity += product.quantity;
    productFinded.priceTotal = productFinded.quantity * product.price;
  } else {
    const priceTotal = product.quantity * product.price;
    SMACH.newOrder.products.push({ ...product, priceTotal });
  }
  return SMACH.newOrder;
}

function searchProductAndFillFormNewOrder() {
  const productFind = getFormData(".form-new-order").get("productCode");
  const product = findProduct(productFind);
  if (product) {
    setFormData(".form-new-order", {
      productName: product.name,
      productQuantity: 1,
      productPrice: product.price,
    });
  } else {
    alert("Produto nao encontrado insira um codigo valido");
  }
}

function addNewOrderToOrderList() {
  if (!SMACH.newOrder.products.length) {
    alert("adiciona algum produto no pedido");
    return;
  }
  addNewOrderInOrder({
    ...SMACH.newOrder,
    type: getFormData(".form-new-order").get("orderType"),
  });
  tableNewOrderRender();
  tableOrdersRender();
}

function addProductToNewOrderList() {
  const productCode = getFormData(".form-new-order").get("productCode");
  const productFinded = findProduct(productCode);
  const allFieldsFilled = isValidForm(".form-new-order", [
    "productName",
    "orderType",
    "productQuantity",
    "productPrice",
  ]);
  if (!productFinded) {
    alert("produto nao encontrado");
    return;
  }
  if (!allFieldsFilled) {
    alert("preencha todos os campos");
    return;
  }
  const quantity = Number(
    getFormData(".form-new-order").get("productQuantity")
  );
  addProductToNewOrder({ ...productFinded, quantity });
  tableNewOrderRender();
  setFormData(".form-new-order", {
    productCode: "", // fix no clear search
    productName: "",
    productQuantity: "",
    productPrice: "",
  });
}

function tableNewOrderRender() {
  const tableTotal = document.querySelector(".table-new-order__total strong");
  const priceTotal = getTotalPriceToNewOrder();
  tableRender(".table-new-order", SMACH.newOrder.products, [
    "code",
    "name",
    "quantity",
    "priceTotal",
  ]);
  tableTotal.innerHTML = priceTotal;
}
