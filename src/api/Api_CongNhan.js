const apiGetListSuaChuaDuocPhanCong = 'api/EOSVT/GetListSuaChuaDuocPhanCong';
const apiGetListSuaChuaDaLam = 'api/EOSVT/GetListSuaChuaNhanVienDaThucHien';
const apiCapNhatSuaChua = 'api/EOSVT/CapNhatSuaChua';
const apiUploadImage = 'api/EOSVT/UpAnhBaseString';
const apiGetListVatTuSuaChua = 'api/EOSVT/GetListVattuSuaChuaChietTinh';
const apiInsertVatTuSuaChua = 'api/EOSVT/InsertVatTuSuaChuaChietTinh';
const apiDeleteVatTuSuaChua = 'api/EOSVT/PostXoaVatTuSuaChuaChietTinh';
const apiThayDongHoDinhKy = 'api/EOSVT/ThayDongHoDinhKy';
const apiGetListThiCongDuocPhanCong = 'api/EOSVT/GetListThiCongDuocPhanCong';
const apiGetListThiCongDaLam = 'api/EOSVT/PostGetListThiCongDuocPhanCongDaCapNhat';
const apiCapNhatThiCong = 'api/EOSVT/CapNhatThiCong';
const apiGetListVatTuThiCong = 'api/EOSVT/GetListVattuThiCongChietTinh';
const apiInsertVatTuThiCong = 'api/EOSVT/InsertVatTuThiCongChietTinh';
const apiDeleteVatTuThiCong = 'api/EOSVT/PostXoaVatTuThiCongChietTinh';
const apiGetListImage = 'api/EOSVT/PostXemAnhDaChupSuaChua';
const apiPostDeleteImage = 'api/EOSVT/PostXoaAnhDaChupSuaChua';


  async function getListSuaChuaDuocPhanCong(url, user, pwd) {
    try {
      let response = await fetch(url + apiGetListSuaChuaDuocPhanCong, {
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
  async function getListSuaChuaDaThucHien(url, user, pwd) {
    try {
      let response = await fetch(url + apiGetListSuaChuaDaLam, {
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
  async function capNhatSuaChua(url, user, pwd, madon, idkh, tenkh, sdt, thongtinkh, noidungbao,
    maxl, lydo, bienphap, codh, madh, niemchi, serial, csc, csm, manvxl_phu, ghichu, ngayht, mann, madk, loaiongbe) {
    try {
      let response = await fetch(url + apiCapNhatSuaChua, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADON : madon,
          IDKH : idkh,
          TENKH : tenkh,
          SDT : sdt,
          THONGTINKH : thongtinkh,
          NOIDUNG : noidungbao,
          MAXL : maxl,
          LYDO : lydo,
          BIENPHAPXL : bienphap,
          CODH : codh,
          MADH : madh,
          NIEMCHI : niemchi,
          SOSERIAL : serial,
          CSTRUOC : csc,
          CSSAU : csm,
          MANVXL : user,
          MANV_XLPHU : manvxl_phu,
          GHICHU : ghichu,
          NGAYHT : ngayht,          
          MANN : mann,
          MADK: madk,
          LOAIONGBE: loaiongbe,
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function uploadImageToServer(url, user, pwd, filename, x, y, base64) {
    try {
      let response = await fetch(url + apiUploadImage, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SDT: user,
          PASSWORD: pwd,
          IMAGE_FILENAME : filename,
          X : x,
          Y : y,
          Base64ImgageString : base64,
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function getListVatTuSuaChua(url, user, pwd, madon) {
    try {
      let response = await fetch(url + apiGetListVatTuSuaChua, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADON : madon
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function insertVatTuSuaChua(url, user, pwd, madon, mavt, slmp, sltt) {
    try {
      let response = await fetch(url + apiInsertVatTuSuaChua, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADON : madon,
          MAVT : mavt,
          SOLUONG_MIENPHI : slmp,
          SOLUONG_TINHTIEN : sltt,
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function deleteVatTuSuaChua(url, user, pwd, madon, mavt, slmp, sltt) {
    try {
      let response = await fetch(url + apiDeleteVatTuSuaChua, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADON : madon,
          MAVT : mavt,
          SOLUONG_MIENPHI : slmp,
          SOLUONG_TINHTIEN : sltt,
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function thayDongHoDinhKy(url, user, pwd, madon, idkh, tenkh, sdt, thongtinkh, noidungbao,
    maxl, lydo, bienphap, codh, madh, niemchi, serial, csc, csm, manvxl_phu, ghichu, mann, madk, loaiongbe) {
    try {
      let response = await fetch(url + apiThayDongHoDinhKy, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADON : madon,
          IDKH : idkh,
          TENKH : tenkh,
          SDT : sdt,
          THONGTINKH : thongtinkh,
          NOIDUNG : noidungbao,
          MAXL : maxl,
          LYDO : lydo,
          BIENPHAPXL : bienphap,
          CODH : codh,
          MADH : madh,
          NIEMCHI : niemchi,
          SOSERIAL : serial,
          CSTRUOC : csc,
          CSSAU : csm,
          MANVXL : user,
          MANV_XLPHU : manvxl_phu,
          GHICHU : ghichu,      
          MANN : mann,
          MADK: madk,
          LOAIONGBE: loaiongbe,    
        }),
      });
      let responseJson = await response.json();
       //console.log(responseJson) ;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function getListThiCongDuocPhanCong(url, user, pwd) {
    try {
      let response = await fetch(url + apiGetListThiCongDuocPhanCong, {
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
  async function getListThiCongDaThucHien(url, user, pwd) {
    try {
      let response = await fetch(url + apiGetListThiCongDaLam, {
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

  async function capNhatThiCong(url, user, pwd, madon, madh, duongkinh, ghichu,
    csd, sometthucte, ongnhanh, soserial, manvxl_phu) {
    try {
      let response = await fetch(url + apiCapNhatThiCong, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADDK : madon,      
          MADH : madh,
          DUONGKINH : duongkinh,
          SOSERIAL : soserial,
          CSDAU : csd,
          MTHUCTE : sometthucte,
          ONGNHANH : ongnhanh,
          MANVPHU : manvxl_phu,
          GHICHU : ghichu,
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function getListVatTuThiCong(url, user, pwd, madon) {
    try {
      let response = await fetch(url + apiGetListVatTuThiCong, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADON : madon
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function insertVatTuThiCong(url, user, pwd, madon, mavt, slmp, sltt) {
    try {
      let response = await fetch(url + apiInsertVatTuThiCong, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADON : madon,
          MAVT : mavt,
          SOLUONG_MIENPHI : slmp,
          SOLUONG_TINHTIEN : sltt,
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function deleteVatTuThiCong(url, user, pwd, madon, mavt, slmp, sltt) {
    try {
      let response = await fetch(url + apiDeleteVatTuThiCong, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADON : madon,
          MAVT : mavt,
          SOLUONG_MIENPHI : slmp,
          SOLUONG_TINHTIEN : sltt,
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  async function getListImageCaptured(url, user, pwd, madon, option) {
    try {
      let response = await fetch(url + apiGetListImage, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          USERNAME: user,
          PASSWORD: pwd,
          MADON : madon,
          OPTION : option
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }

  async function postDeleteImage(url, user, pwd, id) {
    try {
      let response = await fetch(url + apiPostDeleteImage, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SDT: user,
          PASSWORD: pwd,
          LISTID : id
        }),
      });
      let responseJson = await response.json();
      // return responseJson.ResultCode;
      return responseJson;
    } catch (error) {
      console.log(`Error is : ${error}`);
    }
  }
  

  export {getListSuaChuaDuocPhanCong, getListSuaChuaDaThucHien, 
    capNhatSuaChua, uploadImageToServer, getListVatTuSuaChua, 
    insertVatTuSuaChua, deleteVatTuSuaChua, thayDongHoDinhKy, 
    getListThiCongDuocPhanCong, getListThiCongDaThucHien, capNhatThiCong,
    getListVatTuThiCong, insertVatTuThiCong, deleteVatTuThiCong, getListImageCaptured, postDeleteImage};