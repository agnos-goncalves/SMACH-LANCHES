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

function getCheckedOrders(orders = SMACH.orders) {
  const ordersChecked = document.querySelectorAll(
    ".table-all-orders .row-field-checkbox:checked"
  );
  const ordersID = Array.from(ordersChecked).map((selected) =>
    selected.getAttribute("order-id")
  );
  const ordersSelected = orders.filter((order) =>
    ordersID.some((id) => id === order.id)
  );

  return ordersSelected;
}

function deleteOrders(ordersRemoved) {
  const ordersUpdated = SMACH.orders.filter((order) =>
    ordersRemoved.every((removed) => removed.id !== order.id)
  );
  SMACH.orders = ordersUpdated;
}

function tableNewOrderListeners() {
  const buttonDeleteProduct = document.querySelectorAll(
    ".table-new-order .icon-trash"
  );
  buttonDeleteProduct.forEach((button) => {
    button.addEventListener("click", () => {
      const product = findProduct(button.getAttribute("product-id"));
      deleteProductToNewOrder(product);
      tableNewOrderRender();
    });
  });
}

function tableOrdersListeners() {
  const buttonsStatus = document.querySelectorAll(
    ".table-all-orders .btn.__event"
  );
  const buttonsCheckbox = document.querySelectorAll(
    ".table-all-orders .row-field-checkbox"
  );
  buttonsStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("order-id");
      changeOrderStatus(productId);
      tableOrdersRender();
    });
  });

  buttonsCheckbox.forEach((button) => {
    button.addEventListener("change", (e) => {
      formActionsUpdateStateRender();
    });
  });
}

function tableOrdersCheckedAllItemsRender() {}

function tableOrdersRender(orders = SMACH.orders) {
  const btn = {
    received: "btn btn-default __event __received",
    done: "btn btn-warning __event __done",
    delivered: "btn btn-success __delivered",
  };
  const legend = {
    received: "recebido",
    done: "pronto",
    delivered: "entregue",
  };
  const ordersMapped = orders.map((order) => ({
    ...order,
    id: `<fieldset class="field"><input order-id="${order.id}" class="row-field-checkbox" type="checkbox" /></fieldset>${order.id}`,
    status: `<button order-id="${order.id}" class="${btn[order.status]}">${
      legend[order.status]
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

function getTotalPriceToNewOrder(products = SMACH.newOrder.products) {
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

function editNewOrderInOrder(newOrder) {
  const { name, priceTotal } = getNewOrderComputedDate(newOrder);
  SMACH.orders = SMACH.orders.map((order) => {
    if (order.id === newOrder.id) {
      return { ...order, name, priceTotal };
    }
    return order;
  });
}

function addNewOrderInOrder(newOrder) {
  const { name, priceTotal } = getNewOrderComputedDate(newOrder);
  const order = {
    id: uuid(),
    name,
    priceTotal,
    status: ORDER_STATE.RECEIVED,
    ...newOrder,
  };

  SMACH.orders.unshift(order);
  SMACH.newOrder.products = [];
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
    return false;
  }
  if (!SMACH.newOrder.id) {
    addNewOrderInOrder({
      ...SMACH.newOrder,
      type: getFormData(".form-new-order").get("orderType"),
    });
  } else {
    editNewOrderInOrder(SMACH.newOrder);
  }
  tableNewOrderRender();
  tableOrdersRender();
  return true;
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

function editOrderChecked() {
  const ordersEdit = getCheckedOrders();
  const order = ordersEdit[0];

  if (ordersEdit.length !== 1) {
    alert("Voce so pode editar 1 pedido por fez");
    return;
  }
  SMACH.newOrder = {
    id: order.id,
    type: order.type,
    products: order.products,
  };
  changePage(PAGE_STATE.EDIT_ORDER);
  tableNewOrderRender();
}
function deleteOrdersChecked() {
  const ordersDelete = getCheckedOrders();
  deleteOrders(ordersDelete);
  tableOrdersRender();
  changePage(PAGE_STATE.ALL_ORDERS);
}

function getOrdersListFiltered(type, status) {
  let ordersFiltered = SMACH.orders.filter(
    (order) => order.type === type || type === "all"
  );
  ordersFiltered = ordersFiltered.filter(
    (order) => order.status === status || status === "all"
  );
  return ordersFiltered;
}

function tableNewOrderRender(order = SMACH.newOrder) {
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
  tableNewOrderListeners();
  tableTotal.innerHTML = priceTotal;
}
