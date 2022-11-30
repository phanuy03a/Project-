const keyLocalStorageListSP = "DANHSACHSP";
const keyLocalStorageItemCart = "DANHSACHITEMCART";
const selectProvince = document.getElementById("province");
const selectDistrict = document.getElementById("district");
const selectWard = document.getElementById("ward");
let listID = [];
const updateQuantity = function () {
  const productList = app.getData(keyLocalStorageListSP);
  const cartList = app.getData(keyLocalStorageItemCart);
  cartList.forEach((data) => {
    const product = productList.find((product) => product.id == data.idSP);
    product.soLuong -= data.soLuong;
    deleteCartItem(data.idSP);
  });
  app.saveData(keyLocalStorageListSP, productList);
};
const showFormDialog = (status) => {
  const cartList = app.getData(keyLocalStorageItemCart);
  if (cartList.length <= 0 && status == 0) {
    toast({
      message: "Không có sản phẩm trong giỏ hàng",
      type: "error",
      duration: 1000,
    });
    return;
  }
  document.querySelectorAll("#alert-error").forEach((text) => (text.innerText = ""));
  document.querySelector(".form-container").classList.toggle("hide");
  document.querySelector(".form-dialog").reset();
};
const deleteCartItem = (id) => {
  const cartList = app.getData(keyLocalStorageItemCart);
  const filter = cartList.filter((data) => {
    return data.idSP != id;
  });
  app.saveData(keyLocalStorageItemCart, filter);
  renderCartItem();
};
const changeQuantity = (id, status) => {
  app.handleChangeQuantity(id, status);
  renderCartItem();
};
const handleSelectProvince = async (e) => {
  e.target.parentElement.querySelector("#alert-error").innerText = "";
  const districtList = await app.getDistrictsByProvinceID(selectProvince.value);
  document.querySelectorAll("#option").forEach((o) => o.remove());
  districtList.forEach((p) => {
    selectDistrict.insertAdjacentHTML(
      "beforeend",
      `<option id="option" value="${p.code}">${p.name}</option>`
    );
  });
};
const handleSelectDistrict = async (e) => {
  e.target.parentElement.querySelector("#alert-error").innerText = "";
  const wardList = await app.getWardsByDistrictsID(selectDistrict.value);
  document.querySelectorAll(".option-w").forEach((o) => o.remove());
  wardList.forEach((p) => {
    selectWard.insertAdjacentHTML(
      "beforeend",
      `<option id="option" class="option-w" value="${p.code}">${p.name}</option>`
    );
  });
};
const renderProvince = async () => {
  const provinceList = await app.getProvinceList();
  provinceList.forEach((p) => {
    selectProvince.insertAdjacentHTML("beforeend", `<option value="${p.code}">${p.name}</option>`);
  });
};
const renderCartItem = () => {
  const cartContainer = document.querySelector(".cart-container");
  cartContainer.innerHTML = "";
  const cartList = app.getData(keyLocalStorageItemCart);
  if (cartList.length > 0) {
    cartList.map((item) => {
      const productData = app.getProductByID(item.idSP);
      cartContainer.insertAdjacentHTML(
        "beforeend",
        `  <tr class="table-body-row">
        <td class="product-remove">
          <div ><i onclick="deleteCartItem(${item.idSP})" class="far fa-window-close"></i></div>
        </td>
        <td class="product-image">
          <img
            src="../assets/img/products/product-img-${item.idSP}.jpg"
            alt=""
          />
        </td>
        <td class="product-name">${productData.name}</td>
        <td class="product-price">${productData.price} $</td>
        <td class="product-quantity">
        <div class="value-button" id="decrease" onclick="changeQuantity(${item.idSP},0)">-</div>
        <input type="number"  id="number" value="${item.soLuong}" />
        <div class="value-button" id="increase" onclick="changeQuantity(${item.idSP},1)">+</div>
        </td>
     
        <td class="product-total">${item.soLuong * productData.price} $</td>
      </tr>`
      );
    });
  } else {
    cartContainer.insertAdjacentHTML(
      "beforeend",
      `<tr>
      <td colspan="6" class="no-data">
      Không có sản phẩm trong giỏ hàng.
      </td>
  </tr>`
    );
  }
  document.querySelector(".total-quantity").innerText = ` ${app.handletotalQuantity(cartList)}`;
  document.querySelector(".total-price").innerText = `${app.handletotalPrice()} $`;
};
function getID() {
  let randomID = Math.random().toString(36).slice(2);
  if (listID.includes(randomID)) {
    getID();
  } else {
    listID.push(randomID);
    return randomID;
  }
}
function isEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}
function isPhone(number) {
  return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(number);
}
const getFormData = () => {
  const cartList = app.getData(keyLocalStorageItemCart);
  const oderData = {
    date: new Date().toLocaleDateString(),
    id: getID(),
    cart: cartList,
    total: app.handletotalPrice(),
    quantity: cartList.length,
  };
  const formData = new FormData(document.querySelector(".form-dialog"));
  for (const [key, value] of formData) {
    oderData[key] = value;
  }
  return oderData;
};
const onChangeFormValue = (e) => {
  e.target.parentElement.querySelector("#alert-error").innerText = "";
};
const handleValidateForm = (e) => {
  e.preventDefault();
  const formData = getFormData();
  const textError = document.querySelectorAll("#alert-error");
  textError.forEach((text) => (text.innerText = ""));
  let isCheck = true;
  console.log(formData);
  if (formData.FirstName === "") {
    textError[0].innerText = "FirstName is required";
    isCheck = false;
  }
  if (formData.LastName === "") {
    textError[1].innerText = "LastName is required";
    isCheck = false;
  }
  if (formData.Email === "") {
    textError[2].innerText = "Email is required";
    isCheck = false;
  } else if (!isEmail(formData.Email)) {
    textError[2].innerText = "Email is not valid";
    isCheck = false;
  }
  if (formData.Phone === "") {
    textError[3].innerText = "Phone is required";
    isCheck = false;
  } else if (!isPhone(formData.Phone)) {
    isCheck = false;
    textError[3].innerText = "Phone is not valid";
  }
  if (formData.Ward === "0") {
    isCheck = false;
    textError[4].innerText = "Ward is required";
  }
  if (formData.District === "0") {
    isCheck = false;
    textError[5].innerText = "District is required";
  }

  if (formData.Province === "0") {
    isCheck = false;
    textError[6].innerText = "Province is required";
  }

  if (isCheck === true) {
    updateQuantity();
    showFormDialog();
    app.postDataAPI("customer", formData);
    toast({
      message: "Mua sản phẩm thành công",
      type: "success",
      duration: 1000,
    });
  }
};
renderProvince();
renderCartItem();
