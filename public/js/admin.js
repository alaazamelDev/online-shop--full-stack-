const deleteProduct = (btn) => {
  // get the data from the ui
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;

  //get the product card selector
  const productCard = btn.closest("article");

  fetch("/admin/product/" + productId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfToken,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      productCard.parentNode.removeChild(productCard);
    })
    .catch((err) => {
      console.log(err);
    });
};
