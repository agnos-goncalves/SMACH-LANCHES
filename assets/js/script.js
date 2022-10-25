const SMACH = {
  products: [
    {
      code: 1001,
      product: "Super SMACH COMBO Programado – Hambúrguer + Fritas",
      price: 55,
    },
    {
      code: 1002,
      product: "SMACH VariavelBurguer – Hambúrguer com bacon",
      price: 45,
    },
    {
      code: 1003,
      product: "SMACH BUG EM PROD – Hambúrguer meio torto",
      price: 25,
    },
    {
      code: 1004,
      product: "Combo Econômico SMACH Char 1 – Pão com Carne",
      price: 15,
    },
    {
      code: 1005,
      product: "Especial SMACH CSS – Hambúrguer colorido e alinhado",
      price: 65,
    },
    {
      code: 2001,
      product: "Refrigerante 350 ml",
      price: 8,
    },
    {
      code: 2002,
      product: "Água 500 ml",
      price: 5,
    },
    {
      code: 2003,
      product: "Suco 350 ml",
      price: 7,
    },
    {
      code: 3001,
      product: "Sorvete 300 ml",
      price: 15,
    },
    {
      code: 3002,
      product: "Sobremesa doce SMACH ARRAY",
      price: 50,
    },
  ],
  new_ordes: [],
  orders: [],
};

const PAGE_STATE = {
  ALL_ORDERS: "all_orders",
  NEW_ORDER: "new_order",
  SELECTED_ORDERS: "selected_orders",
};

function tableRender(tableSelector, items, columns) {
  const table = document.querySelector(tableSelector);
  const tbody = table.querySelector("tbody");
  let template = "";

  if (items.length == 0) {
    table.parentElement.classList.add("__empty");
  }
  items.forEach((item) => {
    columns.forEach((column) => {
      let propValue = item[column];
      const className = `row-${column} __${propValue.replaceAll(" ", "-")}`;
      template += `<td class="${className}">${propValue}</td>`;
    });
  });

  tbody.innerHTML = template;
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
    alert(getFormData(".form-new-order").get("productFind"));
  });

  buttonAddNewOrder.addEventListener("click", () => {
    e.preventDefault();
    e.stopPropagation();
    changePage(PAGE_STATE.NEW_ORDER);
  });

  buttonAddProductToOrder.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isValidForm = formIsValid(".form-new-order", [
      "productName",
      "productQuantity",
      "productPrice",
    ]);

    if (isValidForm) {
      alert("form valido");
    } else {
      alert("preencha todos os campos");
    }
  });

  buttonSaveOrders.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    changePage(PAGE_STATE.ALL_ORDERS);
  });

  changePage(PAGE_STATE.NEW_ORDER);
  tableRender(
    ".table-new-order",
    [
      {
        name: "1",
        price: "1",
        quantity: "1",
        state: "1",
      },
    ],
    ["name", "price", "quantity", "state"]
  );
  // tableRender(".table-new-order", [], ["name", "price", "quantity", "state"]);
};
