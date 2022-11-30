const keyLocalStorageListSP = "DANHSACHSP";
const keyLocalStorageItemCart = "DANHSACHITEMCART";
const handleReturnProduct = async (id) => {
  const oderData = await app.getDataByIDAPI("customer", id);
  await app.deleteDataAPI("customer", oderData.key);
  const productList = app.getData(keyLocalStorageListSP);
  oderData.cart.forEach((cart) => {
    const product = productList.find((product) => product.id == cart.idSP);
    product.soLuong += cart.soLuong;
  });
  app.saveData(keyLocalStorageListSP, productList);
  renderOder();
  toast({
    message: "Trả hàng thành công",
    type: "success",
    duration: 1000,
  });
};
const renderOderCart = (customerCart) => {
  let tbodyHtml = "";
  customerCart.map((cart) => {
    const productData = app.getProductByID(cart.idSP);
    tbodyHtml += `
    <tr>
    <td> <img 
    src="../assets/img/products/product-img-${productData.id}.jpg"
    alt=""
  /></td>
    <td>${productData.name}</td>
    <td>${productData.price}</td>
    <td>${cart.soLuong}</td>
    <td>${cart.soLuong * productData.price} VND</td>
    </tr>
    `;
  });
  return tbodyHtml;
};
const renderOder = async () => {
  const tbodyOder = document.querySelector(".tbody-customer");
  tbodyOder.innerHTML = `<tr>
  <td colspan="7" ">
  <div class="loader">
  <div class="outer"></div>
  <div class="middle"></div>
  <div class="inner"></div>
</div>

  </td>
</tr>
`;
  const oderData = await app.getDataAPI("customer");

  tbodyOder.innerHTML = "";
  if (oderData.length > 0) {
    oderData.map((data) => {
      tbodyOder.insertAdjacentHTML(
        "beforeend",
        `<tr id=${data.key}>
        <td>
          ${data.id}
          <div class="dropdown">
  <button type="button" class="detail-button dropdown-toggle" data-toggle="dropdown">
   Chi tiết
  </button>
  <div class="dropdown-menu">
  <table class="table table-detail">
  <thead>
    <tr>
      <th></th>
      <th>Tên sản phẩm</th>
      <th>Giá</th>
      <th>Số lượng</th>
      <th>Thành tiền</th>
    </tr>
  </thead>
  <tbody class="tbody-cart">
   ${renderOderCart(data.cart)}
  </tbody>
</table>
  </div>
</div>
        </td>
        <td>${data.LastName}</td>
        <td>${data.date}</td>
        <td>${data.quantity}</td>
        <td >${data.total} $</td>
        <td ><i onclick="handleReturnProduct(${data.key})" class="far fa-window-close"></i></td>
        
        <td ><ion-icon class="return" onclick="handleReturnProduct(${data.key})"
        name="log-out-outline"></ion-icon></td>
        </tr>`
      );
    });
  } else {
    tbodyOder.insertAdjacentHTML(
      "beforeend",
      `<tr>
      <td colspan="7" class="no-data">
      Không có đơn hàng.
      </td>
  </tr>`
    );
  }
};
renderOder();
