const PAGE_STATE = {
  ALL_ORDERS: "all_orders",
  NEW_ORDER: "new_order",
  SELECTED_ORDERS: "selected_orders",
};

const buttonAddNewOrder = document.querySelector(".form-add-order .btn");

function changePage(pageState) {
  document.querySelector("body").setAttribute("state", pageState);
}

window.onload = () => {
  changePage(PAGE_STATE.SELECTED_ORDERS);
};
