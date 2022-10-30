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

  // buttonsCheckbox.forEach((button) => {
  //   button.addEventListener("change", (e) => {
  //     const productId = button.getAttribute("order-id");

  //     // changeOrderStatus(productId);
  //     // tableOrdersRender();
  //   });
  // });
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
  SMACH.orders.unshift(order);
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
    return false;
  }
  addNewOrderInOrder({
    ...SMACH.newOrder,
    type: getFormData(".form-new-order").get("orderType"),
  });
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

function getOrdersListFiltered(type, status) {
  let ordersFiltered = SMACH.orders.filter(
    (order) => order.type === type || type === "all"
  );
  ordersFiltered = ordersFiltered.filter(
    (order) => order.status === status || status === "all"
  );
  return ordersFiltered;
}

function tableNewOrderRender(products = SMACH.newOrder.products) {
  const tableTotal = document.querySelector(".table-new-order__total strong");
  const priceTotal = getTotalPriceToNewOrder(products);
  tableRender(".table-new-order", products, [
    "code",
    "name",
    "quantity",
    "priceTotal",
  ]);
  tableTotal.innerHTML = priceTotal;
}
