const keyLocalStorageListSP = "DANHSACHSP";
const renderShopItem = () => {
  const shopContainer = document.querySelector(".product-list");
  const productList = app.getData(keyLocalStorageListSP);
  productList.map((product) => {
    shopContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="col-lg-4 col-md-6 offset-md-3 offset-lg-0 text-center">
    <div class="single-product-item">
      <div class="product-image">
        <a href="single-product.html">
          <img src="../assets/img/products/product-img-${product.id}.jpg" alt="" />
        </a>
      </div>
      <h3>${product.name}</h3>
      <p class="product-price"><span> SL:${product.soLuong}</span> ${product.price} $</p>
      <button class="cart-btn" onclick="app.handleChangeQuantity(${product.id},1)">
        <i class="fas fa-shopping-cart"></i> Add to Cart
      </button>
    </div>
  </div>`
    );
  });
};
renderShopItem();
