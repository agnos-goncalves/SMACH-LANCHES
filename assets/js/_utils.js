function uuid() {
  return String(new Date().getTime()).slice(4, 13);
}

function getPageState() {
  const state = document.querySelector("body").getAttribute("state");
  return state;
}

function getDateNowFormated() {
  const date = new Date();
  const dateNow = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();
  const [fullDate, fullTime] = dateNow.split("T");
  const dateFormated = fullDate.split("-").reverse().join("/");
  const dateTimeFormated = fullTime.split(".")[0].slice(0, -3);

  return `${dateFormated}-${dateTimeFormated}`;
}

function updateSidebarDate() {
  const sidebarInfoElement = document.querySelector(".sider-information-date");
  sidebarInfoElement.innerText = getDateNowFormated();
}

function setFormData(formSelector, fields) {
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

function isValidForm(formSelector, fieldsRequired) {
  const formData = getFormData(formSelector);

  const isFilledRequiredFields = fieldsRequired.every(
    (field) => formData.get(field) !== "" && formData.get(field) !== null
  );
  return isFilledRequiredFields;
}

function checkedAllItemsRender(selector, checked) {
  const items = document.querySelectorAll(selector);
  items.forEach((item) => (item.checked = checked));
}

function tableRender(tableSelector, items, columns) {
  const table = document.querySelector(tableSelector);
  const tbody = table.querySelector("tbody");
  let template = "";

  table.parentElement.classList.remove("__empty");

  if (items.length == 0) {
    table.parentElement.classList.add("__empty");
  }

  items.forEach((item) => {
    template += "<tr>";
    columns.forEach((column) => {
      let propValue = String(item[column]);
      template += `<td class="row-${column}">${propValue}</td>`;
    });
    template += "</tr>";
  });
  console.log("template", template);
  tbody.innerHTML = template;
  updateSidebarDate();
}

function changePage(pageState) {
  document.querySelector("body").setAttribute("state", pageState);
}
