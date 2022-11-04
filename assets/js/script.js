// INITIALIZE SYSTEM
window.onload = () => {
  const buttonAddOrder = document.querySelector(".form-add-order .btn");
  const buttonAddProductToOrder = document.querySelector(
    ".form-new-order .btn-primary"
  );
  const buttonSearchProduct = document.querySelector(
    ".form-new-order__search .btn"
  );
  const buttonSaveOrder = document.querySelector(".table-new-order .btn-cta");
  const buttonCancelOrder = document.querySelector(
    ".table-new-order .btn-cta-link"
  );
  const buttonOrdersPrint = document.querySelector(".form-actions .btn-print");
  const buttonOrdersEdit = document.querySelector(".form-actions .btn-edit");
  const buttonOrdersDelete = document.querySelector(
    ".form-actions .btn-delete"
  );

  const filtersOrder = document.querySelectorAll(".form-actions select");

  const buttonSelectAllItemsTableOrders = document.querySelector(
    '.table-all-orders thead input[type="checkbox"]'
  );

  const closeButtonNotify = document.querySelector(".notify .icon-close");

  buttonAddOrder.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    changePage(PAGE_STATE.NEW_ORDER);
  });

  buttonSearchProduct.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    searchProductAndFillFormOrder();
  });

  buttonAddProductToOrder.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    addProductToOrderAndTableRender();
  });

  buttonSaveOrder.addEventListener("click", (e) => {
    addOrderAndTableRender();
  });

  buttonCancelOrder.addEventListener("click", (e) => {
    changePage(PAGE_STATE.ALL_ORDERS);
    SMACH.order = clearOrder();
    tableOrderRender(SMACH.order);
  });

  filtersOrder.forEach((select) => {
    select.addEventListener("change", (e) => {
      const orderType = filtersOrder[0].value;
      const orderStatus = filtersOrder[1].value;

      filterAllOrdersAndTableRender(orderType, orderStatus);
    });
  });

  buttonSelectAllItemsTableOrders.addEventListener("change", () => {
    checkAllItemsOnTable(
      ".table-all-orders tbody",
      buttonSelectAllItemsTableOrders.checked
    );
  });

  buttonOrdersPrint.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    printOrders();
  });

  buttonOrdersEdit.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    editOrderChecked();
  });

  buttonOrdersDelete.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteOrdersChecked();
  });

  closeButtonNotify.addEventListener("click", () => {
    notify("none");
  });

  changePage(PAGE_STATE.ALL_ORDERS);
  updateSidebarDate();
};
