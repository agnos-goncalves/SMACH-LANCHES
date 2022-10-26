function uuid() {
  return String(new Date().getTime()).slice(4, 13);
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
}

function changePage(pageState) {
  document.querySelector("body").setAttribute("state", pageState);
}
