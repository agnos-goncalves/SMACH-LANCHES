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

  const filtersOrder = document.querySelectorAll(".form-actions select");

  const buttonSelectAllItemsTableOrders = document.querySelector(
    '.table-all-orders thead input[type="checkbox"]'
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
    const operationFinished = addNewOrderToOrderList();
    if (operationFinished) {
      changePage(PAGE_STATE.ALL_ORDERS);
    }
  });

  buttonCancelNewOrder.addEventListener("click", (e) => {
    changePage(PAGE_STATE.ALL_ORDERS);
  });

  filtersOrder.forEach((select) => {
    select.addEventListener("change", (e) => {
      const orderType = filtersOrder[0].value;
      const orderStatus = filtersOrder[1].value;
      const orders = getOrdersListFiltered(orderType, orderStatus);
      tableOrdersRender(orders);
    });
  });

  buttonSelectAllItemsTableOrders.addEventListener("change", (checkbox) => {
    checkedAllItemsRender(
      ".table-all-orders .row-field-checkbox",
      buttonSelectAllItemsTableOrders.checked
    );
    formActionsUpdateStateRender();
  });

  // MOCK ALL ORDERS
  changePage(PAGE_STATE.ALL_ORDERS);
  tableOrdersRender(ordersMocked);

  // // MOCK NEW ORDER
  // changePage(PAGE_STATE.NEW_ORDER);
  // tableNewOrderRender(newOrderMocked.products);

  // changePage(PAGE_STATE.SELECTED_ORDERS);
};
