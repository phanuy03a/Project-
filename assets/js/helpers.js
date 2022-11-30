const app = (function () {
  const keyLocalStorageListSP = "DANHSACHSP";
  const keyLocalStorageItemCart = "DANHSACHITEMCART";
  let listData = [
    { id: 1, name: "Tobacco", price: 20, soLuong: 10 },
    { id: 2, name: "Apple", price: 30, soLuong: 10 },
    { id: 3, name: "Orange", price: 49, soLuong: 10 },
    { id: 4, name: "Banana", price: 10, soLuong: 10 },
    { id: 5, name: "Kiwi", price: 40, soLuong: 10 },
    { id: 6, name: "Lemon", price: 12, soLuong: 10 },
  ];
  const saveData = (key, value) => {
    const setjson = JSON.stringify(value);
    localStorage.setItem(key, setjson);
  };
  const getData = (key) => {
    return JSON.parse(localStorage.getItem(key));
  };
  const getProductByID = (id) => {
    const productList = getData(keyLocalStorageListSP);
    return productList.find((d) => d.id === id);
  };
  const getCartByID = (id) => {
    const cartList = getData(keyLocalStorageItemCart);
    return cartList.find((d) => d.idSP === id);
  };
  const handletotalQuantity = (data) => {
    const totalQuantity = data.reduce((acc, cur) => {
      return acc + +cur.soLuong;
    }, 0);
    return totalQuantity;
  };
  const handletotalPrice = () => {
    const cartList = getData(keyLocalStorageItemCart);
    const totalPrice = cartList.reduce((acc, cur) => {
      const productData = getProductByID(cur.idSP);
      return acc + +productData.price * +cur.soLuong;
    }, 0);
    return totalPrice;
  };
  const getDataByIDAPI = async (endpoint, id) => {
    const response = await fetch(`https://6360cd0467d3b7a0a6b592ab.mockapi.io/${endpoint}/${id}`, {
      method: "GET",
    });
    return await response.json();
  };
  const deleteDataAPI = async (endpoint, id) => {
    const response = await fetch(`https://6360cd0467d3b7a0a6b592ab.mockapi.io/${endpoint}/${id}`, {
      method: "DELETE",
    });
  };
  const postDataAPI = async (endpoint, data = {}) => {
    const response = await fetch(`https://6360cd0467d3b7a0a6b592ab.mockapi.io/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  };
  const getDataAPI = async (endpoint) => {
    const response = await fetch(`https://6360cd0467d3b7a0a6b592ab.mockapi.io/${endpoint}`, {
      method: "GET",
    });
    return await response.json();
  };
  const getProvinceList = async () => {
    const res = await fetch(`https://provinces.open-api.vn/api/p/`);
    return await res.json();
  };
  const getDistrictList = async () => {
    const res = await fetch(`https://provinces.open-api.vn/api/d/`);
    return await res.json();
  };
  const getWardList = async () => {
    const res = await fetch(`https://provinces.open-api.vn/api/w/`);
    return await res.json();
  };
  const getDistrictsByProvinceID = async (id) => {
    const districtList = await getDistrictList();
    return districtList.filter((district) => district.province_code === +id);
  };
  const getWardsByDistrictsID = async (id) => {
    const wardList = await getWardList();
    return wardList.filter((ward) => ward.district_code === +id);
  };
  const handleChangeQuantity = (id, status) => {
    let cartList = getData(keyLocalStorageItemCart);
    if (!cartList) cartList = [];
    const cartItem = cartList.find((cart) => cart.idSP === id);
    const productItem = getProductByID(id);
    if (cartItem && status === 1 && productItem.soLuong > cartItem.soLuong) {
      cartItem.soLuong++;
    } else if (!cartItem && status === 1 && productItem.soLuong > 0) {
      cartList.push({
        idSP: id,
        soLuong: 1,
      });
    } else if (
      productItem.soLuong === 0 ||
      (productItem.soLuong === cartItem.soLuong && status === 1)
    ) {
      toast({
        message: "Số lượng sản phẩm không đủ",
        type: "error",
        duration: 1000,
      });
    }
    if (status === 0 && cartItem.soLuong > 0) {
      cartItem.soLuong--;
    }
    if (status === 0 && cartItem.soLuong < 1) {
      cartList = cartList.filter((data) => {
        return data.idSP != cartItem.idSP;
      });
    }
    saveData(keyLocalStorageItemCart, cartList);
  };
  return {
    getProvinceList,
    getDistrictList,
    getWardList,
    getDataAPI,
    postDataAPI,
    deleteDataAPI,
    getDataByIDAPI,
    getDistrictsByProvinceID,
    getWardsByDistrictsID,
    handletotalPrice,
    handletotalQuantity,
    handleChangeQuantity,
    getCartByID,
    getProductByID,
    saveData,
    getData,
  };
})();
