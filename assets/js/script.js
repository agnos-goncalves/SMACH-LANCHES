const PAGE_STATE = {
  ALL_ORDERS: "all_orders",
  NEW_ORDER: "new_order",
  SELECTED_ORDERS: "selected_orders",
};

function changePage(pageState) {
  document.querySelector("body").setAttribute("state", pageState);
}

window.onload = () => {
  const buttonAddNewOrder = document.querySelector(".form-add-order .btn");

  buttonAddNewOrder.addEventListener("click", () => {
    changePage(PAGE_STATE.NEW_ORDER);
  });
};
