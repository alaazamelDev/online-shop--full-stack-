const deleteProduct = (btn) => {
  // get the data from the ui
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;

  console.log("ID: ", productId);
  console.log("TOKEN: ", csrfToken);
};
