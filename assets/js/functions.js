// SMACH LANCHES SYSTEM METHODS

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

function findProduct(productCode) {
  return SMACH.products.find((product) => product.code === Number(productCode));
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
    notify("warning", "Não ha nenhum pedido para ser impresso");
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
      SMACH.order = deleteProductToOrder(SMACH.order, product);
      notify("success", `Produto ${product.code} removido`);
      tableOrderRender(SMACH.order);
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
      notify("success", "Status alterado");
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
    status: `<button order-id="${order.id}" class="${btn[order.status]}">${
      legend[order.status]
    }</button>`,
    pricelTotalFormated: getPriceFormated(order.priceTotal),
  }));

  tableRender(".table-all-orders", ordersMapped, [
    "id",
    "name",
    "type",
    "pricelTotalFormated",
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

function getTotalPriceToOrder(products) {
  return products.reduce(
    (priceTotal, product) => (priceTotal += product.priceTotal),
    0
  );
}

function getOrderComputedData(order) {
  const name = order.products.reduce(
    (name, product) => (name += `${product.quantity} - ${product.name}  `),
    ""
  );
  const priceTotal = order.products.reduce(
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

function clearOrder() {
  return {
    products: [],
  };
}

function editOrder(allOrders, order) {
  const { name, priceTotal } = getOrderComputedData(order);
  const ordersMapped = allOrders.map((orderItem) => {
    if (orderItem.id === order.id) {
      return { ...order, name, priceTotal, status: ORDER_STATE.RECEIVED };
    }
    return order;
  });
  return ordersMapped;
}

function addOrder(allOrders, order) {
  const { name, priceTotal } = getOrderComputedData(order);
  const orderMapped = {
    id: uuid(),
    name,
    priceTotal,
    status: ORDER_STATE.RECEIVED,
    ...order,
  };
  allOrders.unshift(orderMapped);
  return allOrders;
}

function deleteProductToOrder(order, product) {
  const productIndex = order.products.findIndex(
    (orderItem) => orderItem.code === product.code
  );
  if (productIndex >= 0) {
    order.products.splice(productIndex, 1);
  }
  return order;
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

function searchProductAndFillFormOrder() {
  const productCode = getFormData(".form-new-order").get("productCode");
  const product = findProduct(productCode);
  if (product) {
    setFormData(".form-new-order", {
      productName: product.name,
      productQuantity: 1,
      productPrice: getPriceFormated(product.price),
    });
  } else {
    notify("error", "Produto nao encontrado insira um codigo valido");
  }
}

function addOrderAndTableRender() {
  if (!SMACH.order.products.length) {
    notify("error", "Adiciona algum produto no pedido");
    return false;
  }
  const order = {
    ...SMACH.order,
    type: getFormData(".form-new-order").get("orderType"),
  };

  if (!SMACH.order.id) {
    SMACH.orders = addOrder(SMACH.orders, order);
    notify("success", "Pedido adicionado");
  } else {
    SMACH.orders = editOrder(SMACH.orders, order);
    notify("success", "Pedido alterado");
  }

  SMACH.order = clearOrder();

  tableOrderRender(SMACH.order);
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

  if (!allFieldsFilled) {
    notify("error", "Preencha todos os campos");
    return;
  }

  if (!product) {
    notify("warning", "Produto não encontrado");
    return;
  }

  setFormData(".form-new-order", {
    productCode: "", // fix no clear search
    productName: "",
    productQuantity: 1,
    productPrice: "",
  });

  SMACH.order = addProductToOrder(SMACH.order, {
    ...product,
    quantity: Number(productQuantity),
  });

  tableOrderRender(SMACH.order);
}

function editOrderChecked() {
  const ordersSelecteds = getOrdersCheckedOnTable(SMACH.orders);
  const order = ordersSelecteds[0];

  if (ordersSelecteds.length !== 1) {
    notify("warning", "Voce so pode editar 1 pedido por fez");
    return;
  }
  SMACH.order = updateOrder(SMACH.order, order);
  changePage(PAGE_STATE.EDIT_ORDER);
  tableOrderRender(SMACH.order);
}
function deleteOrdersChecked() {
  const orders = getOrdersCheckedOnTable(SMACH.orders);
  SMACH.orders = deleteOrders(SMACH.orders, orders);
  tableAllOrdersRender(SMACH.orders);
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
  const priceTotal = getTotalPriceToOrder(order.products);
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
    pricelTotalFormated: getPriceFormated(product.priceTotal),
  }));

  tableRender(".table-new-order", productsMap, [
    "code",
    "name",
    "quantity",
    "pricelTotalFormated",
    "action",
  ]);
  tableOrderListeners();
  tableTotal.innerHTML = getPriceFormated(priceTotal);
}
