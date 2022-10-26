const SMACH = {
  products: [
    {
      code: 1001,
      name: "Super SMACH COMBO Programado – Hambúrguer + Fritas",
      price: 55,
    },
    {
      code: 1002,
      name: "SMACH VariavelBurguer – Hambúrguer com bacon",
      price: 45,
    },
    {
      code: 1003,
      name: "SMACH BUG EM PROD – Hambúrguer meio torto",
      price: 25,
    },
    {
      code: 1004,
      name: "Combo Econômico SMACH Char 1 – Pão com Carne",
      price: 15,
    },
    {
      code: 1005,
      name: "Especial SMACH CSS – Hambúrguer colorido e alinhado",
      price: 65,
    },
    {
      code: 2001,
      name: "Refrigerante 350 ml",
      price: 8,
    },
    {
      code: 2002,
      name: "Água 500 ml",
      price: 5,
    },
    {
      code: 2003,
      name: "Suco 350 ml",
      price: 7,
    },
    {
      code: 3001,
      name: "Sorvete 300 ml",
      price: 15,
    },
    {
      code: 3002,
      name: "Sobremesa doce SMACH ARRAY",
      price: 50,
    },
  ],
  newOrder: {
    products: [],
  },
  orders: [],
  currentProduct: null,
};

const ORDER_STATE = {
  DELIVERED: "delivered",
  DONE: "done",
  RECEIVED: "received",
};

const PAGE_STATE = {
  ALL_ORDERS: "all_orders",
  NEW_ORDER: "new_order",
  SELECTED_ORDERS: "selected_orders",
};

function uuid() {
  return String(new Date().getTime()).slice(0, 8);
}

function findProduct(productCode) {
  return SMACH.products.find((product) => product.code === Number(productCode));
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

function addOrder(newOrder) {
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
}

function getTotalPriceToNewOrder() {
  return SMACH.newOrder.products.reduce(
    (priceTotal, product) => (priceTotal += product.priceTotal),
    0
  );
}

function tableRender(tableSelector, items, columns) {
  const table = document.querySelector(tableSelector);
  const tbody = table.querySelector("tbody");
  let template = "";

  if (items.length == 0) {
    table.parentElement.classList.add("__empty");
    return;
  }

  table.parentElement.classList.remove("__empty");

  items.forEach((item) => {
    template += "<tr>";
    columns.forEach((column) => {
      let propValue = String(item[column]);
      template += `<td class="row-${column}">${propValue}</td>`;
    });
    template += "</tr>";
  });
  tbody.innerHTML = template;
}
function tableNewOrderRender(newOrderList) {
  const tableTotal = document.querySelector(".table-new-order__total strong");
  const priceTotal = getTotalPriceToNewOrder();
  tableRender(".table-new-order", newOrderList.products, [
    "code",
    "name",
    "quantity",
    "priceTotal",
  ]);
  tableTotal.innerHTML = priceTotal;
}
function tableRenderOrders(orders) {
  const btn = {
    received: "btn btn-default __received",
    done: "btn btn-warning __done",
    delivered: "btn btn-success.__delivered",
  };
  const ordersMapped = orders.map((order) => ({
    ...order,
    id: `<input type="checkbox" />${order.id}`,
    status: `<button class="${btn[order.status]}">${order.status}</button>`,
  }));

  tableRender(".table-all-orders", ordersMapped, [
    "id",
    "name",
    "type",
    "priceTotal",
    "status",
  ]);
}

function setFormValues(formSelector, fields) {
  const form = document.querySelector(formSelector);
  Object.keys(fields).forEach((key) => {
    const value = fields[key];

    form.querySelector(`[name="${key}"]`).setAttribute("value", value);
  });
}

function getFormData(formSelector) {
  const formData = new FormData(document.querySelector(formSelector));
  return formData;
}

function formIsValid(formSelector, fieldsRequired) {
  const formData = getFormData(formSelector);

  const isFilledRequiredFields = fieldsRequired.every(
    (field) => formData.get(field) !== "" && formData.get(field) !== null
  );
  return isFilledRequiredFields;
}

function changePage(pageState) {
  document.querySelector("body").setAttribute("state", pageState);
}

window.onload = () => {
  const buttonAddNewOrder = document.querySelector(".form-add-order .btn");
  const buttonAddProductToOrder = document.querySelector(
    ".form-new-order .btn-primary"
  );

  const buttonSearchProduct = document.querySelector(
    ".form-new-order__search .btn"
  );
  const buttonSaveNewOrder = document.querySelector(
    ".table-new-order .btn-cta"
  );

  const buttonCancelNewOrder = document.querySelector(
    ".table-new-order .btn-cta-link"
  );

  buttonSearchProduct.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const productCodeFinded = getFormData(".form-new-order").get("productFind");
    const product = findProduct(productCodeFinded);
    if (product) {
      setFormValues(".form-new-order", {
        productName: product.name,
        productQuantity: 1,
        productPrice: product.price,
      });
    } else {
      alert("Produto nao encontrado insira um codigo valido");
    }
  });

  buttonAddNewOrder.addEventListener("click", () => {
    e.preventDefault();
    e.stopPropagation();
    changePage(PAGE_STATE.NEW_ORDER);
  });

  buttonAddProductToOrder.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const productCode = getFormData(".form-new-order").get("productFind");
    const productFinded = findProduct(productCode);
    const isValidForm = formIsValid(".form-new-order", [
      "productName",
      "orderType",
      "productQuantity",
      "productPrice",
    ]);

    if (!productFinded) {
      alert("produto nao encontrado");
      return;
    }
    if (!isValidForm) {
      alert("preencha todos os campos");
      return;
    }

    const quantity = Number(
      getFormData(".form-new-order").get("productQuantity")
    );
    addProductToNewOrder({ ...productFinded, quantity });
    tableNewOrderRender(SMACH.newOrder);
  });

  buttonSaveNewOrder.addEventListener("click", (e) => {
    if (!SMACH.newOrder.products.length) {
      alert("adiciona algum produto no pedido");
      return;
    }
    addOrder({
      ...SMACH.newOrder,
      type: getFormData(".form-new-order").get("orderType"),
    });
    SMACH.newOrder = [];

    tableRenderOrders(SMACH.orders);
    changePage(PAGE_STATE.ALL_ORDERS);
  });

  buttonCancelNewOrder.addEventListener("click", (e) => {
    location.reload();
    changePage(PAGE_STATE.NEW_ORDER);
  });

  changePage(PAGE_STATE.NEW_ORDER);
};
