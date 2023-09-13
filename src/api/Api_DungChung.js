const apiLogin = 'api/EOSVT/Login';
const apiGetListThongTinXuLy = 'api/EOSVT/GetListThongTinXuLy';
const apiGetListLoaiDongHo = 'api/EOSVT/GetListLoaiDongHo';
const apiGetListKhachHang = 'api/EOSVT/GetListKhachHang';
const apiGetListNhanVien = 'api/EOSVT/GetListNhanVien';
const apiGetListVatTu = 'api/EOSVT/GetListVattu';
const apiGetListDMNguyenNhan = 'api/EOSVT/GetListDMNguyenNhan';
const apiGetListDuongKinhOng = 'api/EOSVT/GetListDuongKinhOng';
const apiGetListVatLieuOng = 'api/EOSVT/GetListVatLieuOng';

async function loginPermision(url, user, pwd) {
    try {
      let response = await fetch(url + apiLogin, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SDT: user,
          PASSWORD: pwd
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
}
async function getListThongTinXuLy(url, user, pwd) {
  try {
    let response = await fetch(url + apiGetListThongTinXuLy, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        USERNAME: user,
        PASSWORD: pwd
      }),
    });
    let responseJson = await response.json();
    // return responseJson.ResultCode;
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}
async function getListLoaiDongHo(url, user, pwd) {
  try {
    let response = await fetch(url + apiGetListLoaiDongHo, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        USERNAME: user,
        PASSWORD: pwd
      }),
    });
    let responseJson = await response.json();
    // return responseJson.ResultCode;
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}
async function getListKhachHang(url, user, pwd, madbcu, tenkh, madh, sohd, sonha, madp, makv) {
  try {
    let response = await fetch(url + apiGetListKhachHang, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        USERNAME: user,
        PASSWORD: pwd,
        MADBCU : madbcu,
        TENKH : tenkh,
        MADH : madh,
        SOHD : sohd,
        SONHA : sonha,
        MADP : madp,
        MAKV : makv,
      }),
    });
    let responseJson = await response.json();
    // return responseJson.ResultCode;
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}
async function getListNhanVien(url, user, pwd, searchKey, type) {
  try {
    let response = await fetch(url + apiGetListNhanVien, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        USERNAME: user,
        PASSWORD: pwd,
        searchKey : searchKey,
        TYPE : type
      }),
    });
    let responseJson = await response.json();
    // return responseJson.ResultCode;
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}
async function getListVatTu(url, user, pwd, searchKey) {
  try {
    let response = await fetch(url + apiGetListVatTu, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        USERNAME: user,
        PASSWORD: pwd,
        searchKey : searchKey,
      }),
    });
    let responseJson = await response.json();
    // return responseJson.ResultCode;
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getListDMNguyenNhan(url, maxl) {
  try {
    let response = await fetch(url + apiGetListDMNguyenNhan, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({        
        maxl : maxl,
      }),
    });
    let responseJson = await response.json();
    // return responseJson.ResultCode;
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getListDuongKinhOng(url) {
  try {
    let response = await fetch(url + apiGetListDuongKinhOng, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },      
    });
    let responseJson = await response.json();
    // return responseJson.ResultCode;
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

async function getListVatLieuOng(url) {
  try {
    let response = await fetch(url + apiGetListVatLieuOng, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },      
    });
    let responseJson = await response.json();
    // return responseJson.ResultCode;
    return responseJson;
  } catch (error) {
    console.log(`Error is : ${error}`);
  }
}

export {loginPermision, getListThongTinXuLy,  getListLoaiDongHo, getListKhachHang, getListNhanVien, 
  getListVatTu, getListDMNguyenNhan, getListDuongKinhOng, getListVatLieuOng};
