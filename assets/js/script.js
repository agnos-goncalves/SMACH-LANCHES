const PAGE_STATE = {
  ALL_ORDERS: "all_orders",
  NEW_ORDER: "new_order",
  SELECTED_ORDERS: "selected_orders",
};

function getFormData(selector) {
  const formData = new FormData(document.querySelector(selector));
  return formData;
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
    alert(getFormData(".form-new-order").get("productName"));
  });

  buttonAddNewOrder.addEventListener("click", () => {
    e.preventDefault();
    e.stopPropagation();
    changePage(PAGE_STATE.NEW_ORDER);
  });

  buttonAddProductToOrder.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    alert();
  });

  buttonSaveOrders.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    changePage(PAGE_STATE.ALL_ORDERS);
  });

  changePage(PAGE_STATE.NEW_ORDER);
};