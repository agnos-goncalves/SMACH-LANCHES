const SMACH = {
  products: [],
  new_ordes: [],
  orders: [],
};

const PAGE_STATE = {
  ALL_ORDERS: "all_orders",
  NEW_ORDER: "new_order",
  SELECTED_ORDERS: "selected_orders",
};

function tableRender(tableSelector, items, columns) {
  const tableContent = document.querySelector(`${tableSelector} tbody`);
  let template = "";
  items.forEach((item) => {
    columns.forEach((column) => {
      let propValue = item[column];
      const className = `row-${column} __${propValue.replaceAll(" ", "-")}`;
      template += `<td class="${className}">${propValue}</td>`;
    });
  });
  tableContent.innerHTML = template;
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
        name: "item name",
        price: "item price",
        quantity: "item quantity",
        state: "item state",
      },
    ],
    ["name", "price", "quantity", "state"]
  );
};
