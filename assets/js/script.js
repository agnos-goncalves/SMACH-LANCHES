window.onload = () => {
  const buttonAddNewOrder = document.querySelector(".form-add-order .btn");
  const buttonAddProductToNewOrder = document.querySelector(
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

  buttonAddNewOrder.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    changePage(PAGE_STATE.NEW_ORDER);
  });

  buttonSearchProduct.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    searchProductAndFillFormNewOrder();
  });

  buttonAddProductToNewOrder.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    addProductToNewOrderList();
  });

  buttonSaveNewOrder.addEventListener("click", (e) => {
    addNewOrderToOrderList();
    changePage(PAGE_STATE.ALL_ORDERS);
  });

  buttonCancelNewOrder.addEventListener("click", (e) => {
    location.reload();
    changePage(PAGE_STATE.NEW_ORDER);
  });
  changePage(PAGE_STATE.ALL_ORDERS);
  tableOrdersRender();
};
