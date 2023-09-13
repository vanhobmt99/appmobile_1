//sửa chữa
const apiTaoThongTinTruongVung = 'api/EOSVT/TaoThongTinMoiTruongVung';
const apiGetListSuaChuaChuaPhanCong = 'api/EOSVT/PostGetListSuaChuaCanDuocPhanCongChoNhanVien';
const apiGetListSuaChuaDaPhanCong = 'api/EOSVT/PostGetListSuaChuaDaPhanCongChoNhanVien';
const apiThemPhanCongSuaChua = 'api/EOSVT/ThemPhanCongSuaChua';
const apiXoaPhanCongSuaChua = 'api/EOSVT/XoaPhanCongSuaChua';
const apiGetListDanhSachPhanCongSuaChua = 'api/EOSVT/GetListNhanVienDuocPhanCongSuaChua';
const apiTheoDoiTienDoSuaChua = 'api/EOSVT/TheoDoiTienDoCongViec';
const apiChiTietTheoDoiTienDoSuaChua = 'api/EOSVT/ChiTietTheoDoiTienDoCongViec';
//lắp mới
const apiGetListThiCongChuaPhanCong = 'api/EOSVT/PostGetListThiCongChuaPhanCong';
const apiGetListThiCongDaPhanCong = 'api/EOSVT/PostGetListThiCongDaPhanCong';
const apiGetListDanhSachPhanCongThiCong = 'api/EOSVT/GetListNhanVienThiCongDuocPhanCong';
const apiThemPhanCongThiCong = 'api/EOSVT/ThemPhanCongLapMoi';
const apiXoaPhanCongThiCong = 'api/EOSVT/XoaPhanCongLapMoi';
const apiTheoDoiTienDoThiCong = 'api/EOSVT/TheoDoiTienDoThiCong';
const apiChiTietTheoDoiTienDoThiCong = 'api/EOSVT/ChiTietTheoDoiTienDoCongViecThiCong';

async function insertThongTinTruongVung(url, user, pwd, thongtinkh, nguoibao, noidung, sdt, tenkh, idkh) {
    try {
      let response = await fetch(url + apiTaoThongTinTruongVung, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          THONGTINKH : thongtinkh,
          NGUOIBAO : nguoibao,
          NOIDUNG : noidung,
          SDT : sdt,
          TENKH : tenkh,
          IDKH : idkh,
        }),
      });
      let responseJson = await response.json();
      //return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }

  async function getListSuaChuaChuaPhanCong(url, user, pwd) {
    try {
      let response = await fetch(url + apiGetListSuaChuaChuaPhanCong, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function getListSuaChuaDaPhanCong(url, user, pwd) {
    try {
      let response = await fetch(url + apiGetListSuaChuaDaPhanCong, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function insertPhanCongSuaChua(url, user, pwd, madon, manvxl) {
    try {
      let response = await fetch(url + apiThemPhanCongSuaChua, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADON : madon,
          MANVXL : manvxl
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function deletePhanCongSuaChua(url, user, pwd, madon, manvxl) {
    try {
      let response = await fetch(url + apiXoaPhanCongSuaChua, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADON : madon,
          MANVXL : manvxl
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function getListDanhSachPhanCongSuaChua(url, user, pwd, madon) {
    try {
      let response = await fetch(url + apiGetListDanhSachPhanCongSuaChua, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADON : madon,
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function getListThiCongChuaPhanCong(url, user, pwd) {
    try {
      let response = await fetch(url + apiGetListThiCongChuaPhanCong, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function getListThiCongDaPhanCong(url, user, pwd) {
    try {
      let response = await fetch(url + apiGetListThiCongDaPhanCong, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function getListDanhSachPhanCongThiCong(url, user, pwd, madon) {
    try {
      let response = await fetch(url + apiGetListDanhSachPhanCongThiCong, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADDK : madon,
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function insertPhanCongThiCong(url, user, pwd, madon, manvxl) {
    try {
      let response = await fetch(url + apiThemPhanCongThiCong, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADDK : madon,
          MANV : manvxl
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function deletePhanCongThiCong(url, user, pwd, madon) {
    try {
      let response = await fetch(url + apiXoaPhanCongThiCong, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADDK : madon,
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function theoDoiTienDoSuaChua(url, user, pwd, tungay, denngay) {
    try {
      let response = await fetch(url + apiTheoDoiTienDoSuaChua, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          TuNgay : tungay,
          DenNgay : denngay
        }),
      });
      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function chiTietTheoDoiTienDoSuaChua(url, user, pwd, tungay, denngay, manv) {
    try {
      let response = await fetch(url + apiChiTietTheoDoiTienDoSuaChua, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          TuNgay : tungay,
          DenNgay : denngay,
          searchKey : manv
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function theoDoiTienDoThiCong(url, user, pwd, tungay, denngay) {
    try {
      let response = await fetch(url + apiTheoDoiTienDoThiCong, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          TuNgay : tungay,
          DenNgay : denngay
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function chiTietTheoDoiTienDoThiCong(url, user, pwd, tungay, denngay, manv) {
    try {
      let response = await fetch(url + apiChiTietTheoDoiTienDoThiCong, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          TuNgay : tungay,
          DenNgay : denngay,
          searchKey : manv
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  export {insertThongTinTruongVung, getListSuaChuaChuaPhanCong, getListSuaChuaDaPhanCong,
    insertPhanCongSuaChua, deletePhanCongSuaChua, getListDanhSachPhanCongSuaChua, 
    getListThiCongChuaPhanCong, getListThiCongDaPhanCong, getListDanhSachPhanCongThiCong,
    insertPhanCongThiCong, deletePhanCongThiCong, theoDoiTienDoSuaChua, chiTietTheoDoiTienDoSuaChua, 
    theoDoiTienDoThiCong, chiTietTheoDoiTienDoThiCong};