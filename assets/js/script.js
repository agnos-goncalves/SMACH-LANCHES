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
  newOrder: [],
  orders: [],
  currentProduct: null,
};

const PAGE_STATE = {
  ALL_ORDERS: "all_orders",
  NEW_ORDER: "new_order",
  SELECTED_ORDERS: "selected_orders",
};

function findProduct(productCode) {
  return SMACH.products.find((product) => product.code === Number(productCode));
}

function addProductToNewOrder(product) {
  const productFindedIndex = SMACH.newOrder.findIndex(
    (orderItem) => orderItem.code === product.code
  );
  const productHasBeenAdded = productFindedIndex >= 0;

  if (productHasBeenAdded) {
    const productFinded = SMACH.newOrder[productFindedIndex];
    productFinded.quantity += product.quantity;
    productFinded.price = productFinded.quantity * product.price;
  } else {
    const price = product.quantity * product.price;
    SMACH.newOrder.push({ ...product, price });
  }
}

function tableRender(tableSelector, items, columns) {
  const table = document.querySelector(tableSelector);
  const tbody = table.querySelector("tbody");
  let template = "";

  if (items.length == 0) {
    table.parentElement.classList.add("__empty");
    return;
  }
  items.forEach((item) => {
    template += "<tr>";
    columns.forEach((column) => {
      let propValue = String(item[column]);
      const className = `row-${column} __${propValue.replaceAll(" ", "-")}`;
      template += `<td class="${className}">${propValue}</td>`;
    });
    template += "</tr>";
  });
  tbody.innerHTML = template;
}

function setFormValues(formSelector, fields) {
  const form = document.querySelector(formSelector);
  Object.keys(fields).forEach((key) => {
    const value = fields[key];
    console.log(key, value);
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
    (field) => formData.get(field) !== ""
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
  const buttonSaveOrders = document.querySelector(".table-new-order .btn-cta");
  const buttonChooseTypeProduct = document.querySelectorAll(
    ".form-new-order__product-type input"
  );
  const buttonSearchProduct = document.querySelector(
    ".form-new-order__search .btn"
  );

  buttonChooseTypeProduct.forEach((elementInputChoose) => {
    elementInputChoose.addEventListener("click", () => {
      alert(elementInputChoose.getAttribute("value"));
    });
  });

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
    tableRender(".table-new-order", SMACH.newOrder, [
      "code",
      "name",
      "quantity",
      "price",
    ]);
  });

  buttonSaveOrders.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    changePage(PAGE_STATE.ALL_ORDERS);
  });

  changePage(PAGE_STATE.NEW_ORDER);
};
