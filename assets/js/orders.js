function formActionsUpdateStateRender() {
  const itemsSelected = document.querySelectorAll(
    ".table-all-orders .row-field-checkbox:checked"
  );

  if (itemsSelected.length > 0) {
    changePage(PAGE_STATE.SELECTED_ORDERS);
  } else {
    changePage(PAGE_STATE.ALL_ORDERS);
  }
}

function getCheckedItemsOnTable(tableSelector) {
  const itensChecked = document.querySelectorAll(
    `${tableSelector} input[type=checkbox]:checked`
  );
  return itensChecked;
}

function getOrdersCheckedOnTable(orders) {
  const ordersChecked = getCheckedItemsOnTable(".table-all-orders");
  const ordersID = Array.from(ordersChecked).map((selected) =>
    selected.getAttribute("order-id")
  );
  const ordersSelected = orders.filter((order) =>
    ordersID.some((id) => id === order.id)
  );
  return ordersSelected;
}

function filterAllOrdersAndTableRender(orderType, orderStatus) {
  const orders = getAllOrdersFiltered(orderType, orderStatus);
  tableAllOrdersRender(orders);
}

function checkAllItemsOnTable(tableSelector, checked) {
  checkedAllItemsRender(`${tableSelector} input[type="checkbox"]`, checked);
  formActionsUpdateStateRender();
}
function printOrders() {
  if (SMACH.orders.length == 0) {
    alert("Não ha nenhum pedido para ser impresso");
    return;
  }
  window.print();
}

function deleteOrders(orders, ordersRemoved) {
  const ordersUpdated = orders.filter((order) =>
    ordersRemoved.every((removed) => removed.id !== order.id)
  );
  return ordersUpdated;
}

function tableOrderListeners() {
  const buttonDeleteProduct = document.querySelectorAll(
    ".table-new-order .icon-trash"
  );
  buttonDeleteProduct.forEach((button) => {
    button.addEventListener("click", () => {
      const product = findProduct(button.getAttribute("product-id"));
      deleteProductToNewOrder(product);
      tableOrderRender(SMACH.newOrder);
    });
  });
}

function tableAllOrdersListeners() {
  const buttonsStatus = document.querySelectorAll(
    ".table-all-orders .btn.__event"
  );
  const buttonsCheckbox = document.querySelectorAll(
    ".table-all-orders .row-field-checkbox"
  );

  buttonsStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const orderID = button.getAttribute("order-id");
      SMACH.orders = changeOrderStatus(SMACH.orders, orderID);
      tableAllOrdersRender(SMACH.orders);
    });
  });

  buttonsCheckbox.forEach((button) => {
    button.addEventListener("change", (e) => {
      formActionsUpdateStateRender();
    });
  });
}

function tableAllOrdersRender(orders) {
  const btn = {
    received: "btn btn-default __event __received",
    done: "btn btn-warning __event __done",
    delivered: "btn btn-success __delivered",
  };
  const legend = {
    received: "Recebido",
    done: "Pronto",
    delivered: "Entregue",
  };

  const ordersMapped = orders.map((order) => ({
    ...order,
    id: `<fieldset class="field"><input order-id="${order.id}" class="row-field-checkbox" type="checkbox" /></fieldset>${order.id}`,
    status: `<button disabled order-id="${order.id}" class="${
      btn[order.status]
    }">${legend[order.status]}</button>`,
  }));

  tableRender(".table-all-orders", ordersMapped, [
    "id",
    "name",
    "type",
    "priceTotal",
    "status",
  ]);

  tableAllOrdersListeners();
}

function changeOrderStatus(orders, orderId) {
  const getStatus = {
    [ORDER_STATE.RECEIVED]: ORDER_STATE.DONE,
    [ORDER_STATE.DONE]: ORDER_STATE.DELIVERED,
    [ORDER_STATE.DELIVERED]: ORDER_STATE.DELIVERED,
  };

  const ordersMapped = orders.map((order) => {
    if (order.id === orderId) {
      return { ...order, status: getStatus[order.status] };
    }
    return order;
  });
  return ordersMapped;
}

function getTotalPriceToNewOrder(products) {
  return products.reduce(
    (priceTotal, product) => (priceTotal += product.priceTotal),
    0
  );
}

function getNewOrderComputedDate(newOrder) {
  const name = newOrder.products.reduce(
    (name, product) => (name += `${product.quantity} - ${product.name}`),
    ""
  );
  const priceTotal = newOrder.products.reduce(
    (priceTotal, product) => (priceTotal += product.priceTotal),
    0
  );

  return { name, priceTotal };
}

function updateOrder(order, orderPayload) {
  const { id, type, products } = orderPayload;
  const orderMapped = { ...order, id, type, products };
  return orderMapped;
}

function editOrder(allOrders, order) {
  const { name, priceTotal } = getNewOrderComputedDate(order);
  const ordersMapped = allOrders.map((orderItem) => {
    if (orderItem.id === order.id) {
      return { ...order, name, priceTotal, status: ORDER_STATE.RECEIVED };
    }
    return order;
  });
  return ordersMapped;
}

function addOrder(allOrders, order) {
  const { name, priceTotal } = getNewOrderComputedDate(order);
  const newOrder = {
    id: uuid(),
    name,
    priceTotal,
    status: ORDER_STATE.RECEIVED,
    ...order,
  };
  allOrders.unshift(newOrder);
  return allOrders;
}

function deleteProductToNewOrder(product) {
  const productIndex = SMACH.newOrder.products.findIndex(
    (orderItem) => orderItem.code === product.code
  );
  if (productIndex >= 0) {
    SMACH.newOrder.products.splice(productIndex, 1);
  }
  return SMACH.newOrder;
}
function addProductToOrder(order, product) {
  const productIndex = order.products.findIndex(
    (orderItem) => orderItem.code === product.code
  );
  const productFinded = order.products[productIndex];
  if (productFinded) {
    productFinded.quantity += product.quantity;
    productFinded.priceTotal = productFinded.quantity * product.price;
  } else {
    const priceTotal = product.quantity * product.price;
    order.products.push({ ...product, priceTotal });
  }
  return order;
}

function searchProductAndFillFormNewOrder() {
  const productCode = getFormData(".form-new-order").get("productCode");
  const product = findProduct(productCode);
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

function addOrderAndTableRender() {
  if (!SMACH.newOrder.products.length) {
    alert("adiciona algum produto no pedido");
    return false;
  }
  const order = {
    ...SMACH.newOrder,
    type: getFormData(".form-new-order").get("orderType"),
  };

  if (!SMACH.newOrder.id) {
    SMACH.orders = addOrder(SMACH.orders, order);
  } else {
    SMACH.orders = editOrder(SMACH.orders, order);
  }

  SMACH.newOrder = [];

  tableAllOrdersRender(SMACH.orders);
  changePage(PAGE_STATE.ALL_ORDERS);
}

function addProductToOrderAndTableRender() {
  const productCode = getFormData(".form-new-order").get("productCode");
  const productQuantity = getFormData(".form-new-order").get("productQuantity");
  const product = findProduct(productCode);
  const allFieldsFilled = isValidForm(".form-new-order", [
    "productName",
    "orderType",
    "productQuantity",
    "productPrice",
  ]);

  if (!product) {
    alert("produto nao encontrado");
    return;
  }
  if (!allFieldsFilled) {
    alert("preencha todos os campos");
    return;
  }

  setFormData(".form-new-order", {
    productCode: "", // fix no clear search
    productName: "",
    productQuantity: "",
    productPrice: "",
  });

  SMACH.newOrder = addProductToOrder(SMACH.newOrder, {
    ...product,
    quantity: Number(productQuantity),
  });

  tableOrderRender(SMACH.newOrder);
}

function editOrderChecked() {
  const ordersSelecteds = getOrdersCheckedOnTable(SMACH.orders);
  const order = ordersSelecteds[0];

  if (ordersSelecteds.length !== 1) {
    alert("Voce so pode editar 1 pedido por fez");
    return;
  }
  SMACH.newOrder = updateOrder(SMACH.newOrder, order);
  changePage(PAGE_STATE.EDIT_ORDER);
  tableOrderRender(SMACH.newOrder);
}
function deleteOrdersChecked() {
  const orders = getOrdersCheckedOnTable(".table-all-orders");
  SMACH.orders = deleteOrders(SMACH.orders, orders);
  tableAllOrdersRender();
  changePage(PAGE_STATE.ALL_ORDERS);
}

function getAllOrdersFiltered(type, status) {
  let ordersFiltered = SMACH.orders.filter(
    (order) => order.type === type || type === "all"
  );
  ordersFiltered = ordersFiltered.filter(
    (order) => order.status === status || status === "all"
  );
  return ordersFiltered;
}

function tableOrderRender(order) {
  const tableTotal = document.querySelector(".table-new-order__total strong");
  const priceTotal = getTotalPriceToNewOrder(order.products);
  const formTitle =
    getPageState() === PAGE_STATE.EDIT_ORDER
      ? `Editar Pedido - ${order.id}`
      : "Novo Pedido";

  const formAddOrderTitle = document.querySelector(
    ".form-new-order .form-title"
  );
  formAddOrderTitle.innerText = formTitle;

  const productsMap = order.products.map((product) => ({
    ...product,
    action: `<i product-id="${product.code}" class="icon icon-trash"></i>`,
  }));

  tableRender(".table-new-order", productsMap, [
    "code",
    "name",
    "quantity",
    "priceTotal",
    "action",
  ]);
  tableOrderListeners();
  tableTotal.innerHTML = priceTotal;
}
