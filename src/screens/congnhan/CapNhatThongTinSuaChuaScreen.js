import React, { useContext, useState, useEffect } from 'react';
import {Text, View, SafeAreaView, TouchableOpacity, StyleSheet, 
  Dimensions, TextInput, ScrollView, Modal, Alert, PermissionsAndroid} from 'react-native';
import {CustomeHeader} from '../../common/CustomeHeader';
import {GlobalContext} from '../../store/GlobalProvider';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { Button, Menu, Divider, Provider as PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
//import DatePicker from 'react-native-datepicker';
import {callNumber, convertToFullDatetime} from '../../common/CommonFunction';
import {DropDown} from '../../common/DropDown';
import {codh, niemchi} from '../../common/Constant';
import {ModalPicker_KhachHang} from '../../components/dungchung/ModalPicker_KhachHang';
import {ModalPicker_NhanVien} from '../../components/dungchung/ModalPicker_NhanVien';
import {ModalPicker_ImageList} from '../../components/dungchung/ModalPicker_ImageList';
import {Loading} from '../../common/Loading';

import {getListDMNguyenNhan, getListDuongKinhOng, getListVatLieuOng} from '../../api/Api_DungChung';
import {capNhatSuaChua, uploadImageToServer, getListVatTuSuaChua, deleteVatTuSuaChua} from '../../api/Api_CongNhan';

const { width, height } = Dimensions.get('window');

export function CapNhatThongTinSuaChuaScreen ({navigation, route}) {

  var isFocused = useIsFocused();

  const global = useContext(GlobalContext);

  let url = global.url;
  let username = global.username;
  let password = global.password;
  let tennv = global.fullname;
  let listloaixl = global.listloaixl;
  let listloaidongho = global.listloaidongho; 

  const type = 'suachua';

  const[madon, setMadon] = useState(route.params.madon);
  const[idkh, setIdkh] = useState(route.params.idkh);
  const[danhbo, setDanhbo] = useState(route.params.danhbo);
  const[tenkh, setTenkh] = useState(route.params.tenkh);
  const[diachi, setDiachi] = useState(route.params.diachi);
  const[sdt, setSdt] = useState(route.params.sdt);
  const[thongtinkh, setThongtinkh] = useState(route.params.thongtinkh);
  const[noidung, setNoiDung] = useState(route.params.noidung);
  const[loaixl, setLoaixl] = useState(route.params.loaixl);
  const[tenxl, setTenxl] = useState(route.params.tenxl);
  const[lydo, setLydo] = useState(route.params.lydo);
  const[bienphap, setBienphap] = useState(route.params.bienphap);
  const[duongkinhdh, setDuongkinhdh] = useState(route.params.codh);
  const[loaidh, setLoaidh] = useState(route.params.loaidh);
  const[niem3chi, setNiem3chi] = useState(route.params.niemchi);
  const[serial, setSerial] = useState(route.params.serial);
  const[csc, setCsc] = useState(route.params.csc);
  const[csm, setCsm] = useState(route.params.csm);
  const[manvxl2, setManvxl2] = useState(route.params.manvxl_phu);
  const[ghichu, setGhichu] = useState(route.params.ghichu); 
  const[loaiongbe, setLoaiOngBe] = useState(route.params.loaiongbe);
  const[mann, setDMNguyenNhan] = useState(route.params.mann);
  const[madk, setDuongKinhOng] = useState(route.params.madk);
  const [tennn, setTennn] = useState(route.params.tennn);
  const [tendk, setTendk] = useState(route.params.tendk);
  const [tenongbe, setTenOngBe] = useState(route.params.tenongbe);

  const[isloading, setIsloading] = useState();
  const [visible, setVisible] = useState(false);

  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [locationStatus, setLocationStatus] = useState('');

  /*let date_now = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear() 
  + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':00';

  const [ngayht, setNgayht] = useState(date_now);*/
  
  //Ngày hoàn thành
  const [dateht, setNgayht] = useState();  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirmDate = (date) => {
    setNgayht(date);
    hideDatePicker();
  };
  let ngayht = dateht ? moment(dateht).format("DD/MM/YYYY HH:mm:ss") : moment(new Date()).format("DD/MM/YYYY HH:mm:ss");

  const setValueDropDown = (option) => {
    setLoaixl(option);
  } 

  const setValueDropDown_LoaiDh = (option) => {
    setLoaidh(option);
  } 

  const setValueDropDown_Niemchi = (option) => {
    setNiem3chi(option);
  } 

  const setValueDropDown_DuongKinhDh= (option) => {
    setDuongkinhdh(option);
  } 

  const setValueDropDown_VatLieuOng= (option) => {
    setLoaiOngBe(option);
  } 
  const setValueDropDown_DMNguyenNhan= (option) => {
    setDMNguyenNhan(option);
  }   
  const setValueDropDown_DuongKinhOng= (option) => {
    setDuongKinhOng(option);
  }  
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false); 

  const [isModal_KH_Visible, setIsModal_KH_Visible] = useState(false);

  const changeModal_KH_Visible = (bool) => {
    setIsModal_KH_Visible(bool);
    }

  const [isModal_NV_Visible, setIsModal_NV_Visible] = useState(false);

  const changeModal_NV_Visible = (bool) => {
    setIsModal_NV_Visible(bool);
  }
  const [isModal_Image_Visible, setIsModal_Image_Visible] = useState(false);

  const changeModal_Image_Visible = (bool) => {
    setIsModal_Image_Visible(bool);
  }

  const setData = (option) => {
    setIdkh(option.idkh);
    setDanhbo(option.danhbo);
    setTenkh(option.tenkh);
    setDiachi(option.diachi);
    setSdt(option.sdt);
  }  
  
  const setData_NhanVien = (option) => {
    setManvxl2(option.manv);
  }   

  const [listVatTuSuaChua, setListVatTuSuaChua] = useState([]);

  deleteItemById = value => {
    if(_deleteVatTuSuaChua(value.MAVT, value.SOLUONG_MIENPHI, value.SOLUONG_TINHTIEN))
    {
      const filteredData = listVatTuSuaChua.filter(item => item.MAVT !== value.MAVT);
      setListVatTuSuaChua(filteredData);
    }   
  }
  const [listDMNguyenNhan, setNNOngBe] = useState([]);
  const [listDuongKinhOng, setDKOng] = useState([]);
  const [listVatLieuOng, setVLOng] = useState([]);

  const [filePath, setFilePath] = useState({});

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 900,
      maxHeight: 675,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
      includeBase64 : true,
      storageOptions: {
        skipBackup: true,
      },
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
        }else {
          try
          {
            if(response.assets != null)
            {
              setIsloading(false);
  
              let base64 =  response.assets[0].base64;
              _uploadImageToServer(base64);
            }
            else
            {
              console.log('error ios, android ok');
            }
          }
          catch(error)
          {
            console.log(`Error is : ${error}`);
          }        
        }
        setFilePath(response);
      });
    }
  };

  const chooseFile = (type) => {
    let options = {
      mediaType: type,
      title: 'Choose an Image',
      maxWidth: 900,
      maxHeight: 675,
      quality: 1,
      includeBase64 : true,
      storageOptions: {
        skipBackup: true,
      },
    };
    launchImageLibrary(options, (response) => {     
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      }else if (response.assets[0].fileSize > 5242880) {
        alert("Oops! the photos are too big. Max photo size is 4MB per photo. Please reduce the resolution or file size and retry");
      } 
      else 
      {
        setIsloading(false);
        let base64 =  response.assets[0].base64;
        _uploadImageToServer(base64);
      }
      setFilePath(response);
    });
  };

useEffect(()=> {
  if(isFocused){
    setIsloading(false); // để lấy danh sách vật tư xong thì mới ẩn loading
    _getListVatTuSuaChua();
    _getListDMNguyenNhan(); 
    _getListDuongKinhOng();  
    _getListVatLieuOng(); 
  }
  return () => {
    isFocused = false // add this
   }
}, [isFocused]);

useEffect(() => {
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') 
    {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          getOneTimeLocation();
          subscribeLocationLocation();
        } else {
          setLocationStatus('Permission Denied');
        }
      } 
      catch (err) {
        console.warn(err);
      }      
    } 
    else 
    {
        getOneTimeLocation();
        subscribeLocationLocation();
    }
  };

  requestLocationPermission();
  return () => {
    Geolocation.clearWatch(watchID);
  };
}, []);

const getOneTimeLocation = () => {
  setLocationStatus('Getting Location ...');
  Geolocation.getCurrentPosition(
    //Will give you the current location
    (position) => {
      setLocationStatus('You are Here');
      //getting the Longitude from the location json
      const currentLongitude = 
        JSON.stringify(position.coords.longitude);

      //getting the Latitude from the location json
      const currentLatitude = 
        JSON.stringify(position.coords.latitude);

      //Setting Longitude state
      setCurrentLongitude(currentLongitude);
      
      //Setting Longitude state
      setCurrentLatitude(currentLatitude);
    },
    (error) => {
      setLocationStatus(error.message);
    },
    {
      enableHighAccuracy: false, //máy ảo để true, real device để false
      timeout: 30000,
      maximumAge: 1000
    },
  );
};

const subscribeLocationLocation = () => {
  watchID = Geolocation.watchPosition(
    (position) => {
      //Will give you the location on location change
      
      setLocationStatus('You are Here');
      //getting the Longitude from the location json        
      const currentLongitude =
        JSON.stringify(position.coords.longitude);

      //getting the Latitude from the location json
      const currentLatitude = 
        JSON.stringify(position.coords.latitude);

      //Setting Longitude state
      setCurrentLongitude(currentLongitude);

      //Setting Latitude state
      setCurrentLatitude(currentLatitude);
    },
    (error) => {
      setLocationStatus(error.message);
    },
    {
      enableHighAccuracy: false,//máy ảo để true, real device để false
      maximumAge: 1000
    },
  );
};

const clearData = () => {
  setMadon('');
  setIdkh('');
  setDanhbo('');
  setTenkh('');
  setDiachi('');
  setSdt('');
  setThongtinkh('');
  setNoiDung('');
  setLoaixl('');
  setTenxl('');
  setLydo('');
  setBienphap('');
  setDuongkinhdh();
  setLoaiOngBe();
  setDMNguyenNhan();
  setDuongKinhOng();
  setLoaidh();
  setNiem3chi('');
  setSerial('');
  setCsc('');
  setCsm('');
  setManvxl2('');
  setGhichu('');
  setListVatTuSuaChua([]);
} 

const _capNhatSuaChua = async () => { 

  const date = convertToFullDatetime(ngayht);

  capNhatSuaChua(url, username, password, madon, idkh, tenkh, 
    sdt, thongtinkh, noidung, loaixl, lydo, bienphap, duongkinhdh, loaidh,
    niem3chi, serial, csc, csm, manvxl2, ghichu, date, mann, madk, loaiongbe) 
    .then(obj => {
        if(obj.ResultCode === true){   
          clearData();  
          setIsloading(true);  
          alert('Cập nhật dữ liệu thành công');      
        }   
        else{
          setIsloading(true);  
          alert('Cập nhật dữ liệu KHÔNG thành công.');       
        }     
      })
      .catch(error => {
          setIsloading(true); 
          alert('lỗi : ' + error);
      });
}

const _uploadImageToServer = async (base64) => { 
  uploadImageToServer(url, username, password, 'SUACHUA_' + madon, currentLatitude, currentLongitude, base64) 
    .then(obj => {
        if(obj.ResultCode === true){   
          alert('Upload ảnh thành công');      
        }   
        else{
          alert('Upload ảnh KHÔNG thành công.');       
        }   
        
        setIsloading(true);
      })
      .catch(error => {
          setIsloading(true);
          alert('lỗi : ' + error);
      });
}

const _getListVatTuSuaChua = async () => { 
  getListVatTuSuaChua(url, username, password, madon) 
    .then(obj => {
        if(obj.ResultCode === true){   
          setListVatTuSuaChua(obj.Data); 
        }  
        
        setIsloading(true);
      })
      .catch(error => {
          alert('lỗi : ' + error);
      });
}

const _deleteVatTuSuaChua= async (mavt, slmp, sltt) => {
  deleteVatTuSuaChua(url, username, password, madon, mavt, slmp, sltt).then(obj => {     
      if(obj.ResultCode === true){    
        return true;      
      }  
      else{
        return false;
      }    
    })
    .catch(error => {      
        console.log('lỗi : ' + error);
        return false;
    });
}
const _getListDMNguyenNhan = async () => { 
  getListDMNguyenNhan(url, "XL23") 
    .then(obj => {
        if(obj.ResultCode === true){   
          setNNOngBe(obj.Data); 
        }       
      })
      .catch(error => {
          alert('lỗi : ' + error);
      });
}

const _getListDuongKinhOng = async () => { 
  getListDuongKinhOng(url) 
    .then(obj => {
        if(obj.ResultCode === true){   
          setDKOng(obj.Data); 
        }       
      })
      .catch(error => {
          alert('lỗi : ' + error);
      });
}

const _getListVatLieuOng = async () => { 
  getListVatLieuOng(url) 
    .then(obj => {
        if(obj.ResultCode === true){   
          setVLOng(obj.Data); 
        }       
      })
      .catch(error => {
          alert('lỗi : ' + error);
      });
}

    return (
        <SafeAreaView 
          style={{flex: 1}}
          >
          <CustomeHeader
            title = 'Cập nhật sửa chữa'
            isHome={false}
            navigation={navigation}             
          /> 
                   
          <View style = {{flex : 1}}>
            
            <View style = {{flex : 8}}>
              <ScrollView >
                    <View style = {styles.wrapper}/>                       
            
                    <View style = {styles.rowContainer}>                                                     
                          <View style = {styles.rows}>
                            <Text style = {styles.title}>Mã đơn</Text>
                            <View style = {styles.item}>
                              <TextInput 
                                style = {styles.textInput} 
                                editable={false}
                                value = {madon}
                              />  
                            </View>
                          </View>                              
                    </View>   

                    <View style = {styles.wrapper}/>  

                    <View style = {styles.rowContainer}>                                                    
                          <View style = {styles.rows}>
                            <Text style = {{flex : 3.2, 
                              fontSize : 15}}>
                                IDKH
                            </Text>
                            <View style = {{ flex : 7, 
                              backgroundColor : '#fffaf0', 
                              }}>
                              <TextInput 
                              style = {styles.textInput} 
                              editable={false}
                              value = {idkh}
                              />                                 
                            </View>
                            <View style = {[styles.iconPhone, {marginLeft : 10, flexDirection : 'row'}]}>
                              <View style = {{flex : 2}}>
                                <TouchableOpacity 
                                  onPress = {() => {
                                    changeModal_KH_Visible(true);
                                  }}
                                >
                                  <MaterialCommunityIcons 
                                    name = 'account-search-outline'
                                    size = {40}
                                    />
                                </TouchableOpacity>  
                              </View>
                              <View style = {{flex : 3}}/>                          
                            </View>
                          </View>   
                          <Modal            
                              transparent = {true}
                              animationType = 'fade'
                              visible = {isModal_KH_Visible}
                              onRequestClose = {() => changeModal_KH_Visible(false)}
                          >
                              <ModalPicker_KhachHang 
                                changeModalVisible = {changeModal_KH_Visible}
                                setData = {setData}
                              />
                          </Modal>                              
                     </View>    

                    <View style = {styles.wrapper}/>  

                    <View style = {styles.rowContainer}>                                                    
                          <View style = {styles.rows}>
                            <Text style = {{flex : 3.2, 
                              fontSize : 15}}>
                                Danh bộ
                            </Text>
                            <View style = {{ flex : 7, 
                              backgroundColor : '#fffaf0', 
                              }}>
                              <TextInput 
                                style = {styles.textInput} 
                                editable={false}
                                value = {danhbo}
                              /> 
                            </View>
                            <View style = {[styles.iconPhone, {marginLeft : 10}]}>                         
                            </View>
                          </View>                              
                    </View>    
                    <View style = {styles.wrapper}/>                      
            
                    <View style = {styles.rowContainer}>                                                    
                          <View style = {styles.rows}>
                            <Text style = {styles.title}>Tên KH</Text>
                            <View style = {styles.item}>
                              <TextInput 
                                style = {styles.textInput}
                                value = {tenkh}
                                onChangeText = {(text) => {
                                  setTenkh(text);
                                  }}
                              /> 
                            </View>
                          </View>                              
                    </View>   

                    <View style = {styles.wrapper}/>                       
            
                    <View style = {styles.rowContainer}>                                                     
                          <View style = {styles.rows}>
                            <Text style = {styles.title}>Địa chỉ</Text>
                            <View style = {styles.item}>
                              <TextInput 
                                multiline = {true}
                                style = {styles.textInput} 
                                value = {diachi}
                                onChangeText = {(text) => {
                                  setDiachi(text);
                                  }}
                                
                              />
                            </View>
                          </View>                              
                    </View>  

                    <View style = {styles.wrapper}/>                       
            
                    <View style = {styles.rowContainer}>                                                    
                          <View style = {styles.rows}>
                            <Text style = {{flex : 3.2, 
                              fontSize : 15}}>
                                Sđt
                            </Text>
                            <View style = {{ flex : 7, 
                              backgroundColor : '#fffaf0', 
                              }}>
                              <TextInput 
                                style = {styles.textInput}
                                value = {sdt} 
                                keyboardType="number-pad"
                                onChangeText = {(text) => {
                                  setSdt(text);
                                  }}
                              /> 
                            </View>
                            <View style = {[styles.iconPhone, {flexDirection : 'row', marginLeft : 10}]}>
                              <View style = {{flex : 2}}>
                                <TouchableOpacity 
                                  onPress = {() => {
                                    callNumber(sdt);
                                  }}
                                >
                                  <FontAwesome 
                                    name = 'phone-square'
                                    color = {'#000000'}
                                    size = {40}
                                    />
                                </TouchableOpacity>    
                              </View> 
                              <View style = {{flex : 3}}></View>                                                      
                            </View>
                          </View>                              
                    </View>    

                    <View style = {styles.wrapper}/> 

                    <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>
                          <Text style = {styles.title}>Loại xử lý</Text>
                          <View style = {{flex : 7, 
                            marginRight : 5}}>                            
                            <DropDown defaultValue = {tenxl != null ? tenxl : 'Chọn nội dung'} 
                              list = {listloaixl} 
                              setValueDropDown = {setValueDropDown}
                            />        
                          </View>
                        </View>                              
                    </View> 
                    
                    <View style = {styles.wrapper}/>                       

                    <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>
                          <Text style = {styles.title}>Nguyên nhân</Text>
                          <View style = {{flex : 7, 
                            marginRight : 5}}>                            
                            <DropDown defaultValue = {tennn != null ? tennn : 'Tất cả'} 
                              list = {listDMNguyenNhan} 
                              setValueDropDown = {setValueDropDown_DMNguyenNhan}
                            />        
                          </View>
                        </View>                              
                    </View>    

                    <View style = {styles.wrapper}/> 

                    <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>

                          <Text style = {styles.title}>ĐK ống bể</Text>
                          <View style = {{flex : 2.5, 
                            marginRight : 5}}>                        
                           <DropDown defaultValue = {tendk != null ? tendk : 'Tất cả'} 
                              list = {listDuongKinhOng} 
                              setValueDropDown = {setValueDropDown_DuongKinhOng} />
                          </View>

                          <View style = {{flex : 4.5, 
                            marginLeft: 5, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                            <Text style = {styles.title}>Vật liệu</Text>
                            <View style = {{flex : 8, marginRight : 5}}>
                            <DropDown defaultValue = {tenongbe != null ? tenongbe : 'Tất cả'} 
                              list = {listVatLieuOng} 
                              setValueDropDown = {setValueDropDown_VatLieuOng} />        
                            </View>                         
                          </View>

                        </View>                              
                    </View>                      

                    <View style = {styles.wrapper}/>

                    <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>
                          <Text style = {styles.title}>Cỡ ĐH</Text>
                          <View style = {{flex : 2.5, 
                            marginRight : 5}}> 

                            <DropDown defaultValue = {duongkinhdh != null ? duongkinhdh : 'Chọn'} 
                              list = {codh} 
                              setValueDropDown = {setValueDropDown_DuongKinhDh}/>    
                                  
                          </View>
                          <View style = {{flex : 4.5, 
                            marginLeft: 5, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                            <Text style = {styles.title}>Loại</Text>
                            <View style = {{flex : 8, marginRight : 5}}>
                              <DropDown defaultValue = {loaidh} 
                                list = {listloaidongho} 
                                setValueDropDown = {setValueDropDown_LoaiDh}/>
                            </View>                         
                          </View>
                        </View>                              
                    </View>     

                    <View style = {styles.wrapper}/> 

                    <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>
                          <Text style = {styles.title}>Niêm chì</Text>
                          <View style = {{flex : 3, 
                            marginRight : 5}}>                            
                            <DropDown 
                            defaultValue = '' 
                            list = {niemchi} 
                            setValueDropDown = {setValueDropDown_Niemchi}/>        
                          </View>
                          <View style = {{flex : 4, 
                            marginLeft: 5, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                            <Text style = {styles.title}>Số serial</Text>
                            <View style = {{flex : 5, marginRight : 5, marginLeft : 5}}>
                              <TextInput 
                                style = {styles.textInput} 
                                value = {serial}
                                onChangeText = {(text) => {
                                  setSerial(text);
                                  }}
                              />   
                            </View>
                           
                          </View>
                        </View>                              
                    </View>     
                  
                    <View style = {styles.wrapper}/> 

                    <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>
                          <Text style = {styles.title}>Thông tin</Text>
                          <View style = {styles.item}>                            
                            <TextInput 
                              style = {styles.textInput} 
                              multiline = {true}
                              maxLength = {150}
                              placeholder = 'Thêm thông tin'
                              value = {thongtinkh}
                              onChangeText = {(text) => {
                                setThongtinkh(text);
                                }}
                            />                        
                          </View>
                        </View>                              
                    </View>                      
                    
                    <View style = {styles.wrapper}/>
                     
                    <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>
                          <Text style = {styles.title}>Nội dung</Text>
                          <View style = {styles.item}>                            
                            <TextInput 
                              style = {styles.textInput} 
                              multiline = {true}
                              maxLength = {150}
                              placeholder = 'Thêm nội dung'
                              value = {noidung}
                              onChangeText = {(text) => {
                                setNoiDung(text);
                                }}
                            />                        
                          </View>
                        </View>                              
                    </View>                      
                    
                    <View style = {styles.wrapper}/>                     

                    <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>
                          <Text style = {styles.title}>Lý do xử lý</Text>
                          <View style = {styles.item}>                            
                            <TextInput 
                              style = {styles.textInput} 
                              multiline = {true}
                              maxLength = {150}
                              placeholder = 'Thêm lý do xử lý'
                              value = {lydo}
                              onChangeText = {(text) => {
                                setLydo(text);
                                }}
                            />                        
                          </View>
                        </View>                              
                    </View>  

                    <View style = {styles.wrapper}/>  

                    <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>
                          <Text style = {styles.title}>Biện pháp xl</Text>
                          <View style = {styles.item}>                            
                            <TextInput 
                              style = {styles.textInput} 
                              multiline = {true}
                              maxLength = {150}
                              placeholder = 'Thêm biên pháp xử lý'
                              value = {bienphap}
                              onChangeText = {(text) => {
                                setBienphap(text);
                                }}
                            />                        
                          </View>
                        </View>                              
                    </View>                     
                    
                    <View style = {styles.wrapper}/>                                    

                    <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>
                          <Text style = {styles.title}>CS cũ</Text>
                          <View style = {{flex : 3, 
                            marginRight : 5}}>                            
                            <TextInput 
                                style = {styles.textInput} 
                                value = {csc}
                                keyboardType="number-pad"
                                onChangeText = {(text) => {
                                  setCsc(text);
                                  }}
                              />  
                          </View>
                          <View style = {{flex : 4, 
                            marginLeft: 5, flexDirection : 'row', 
                            alignItems : 'center', justifyContent : 'center'}}>
                            <Text style = {styles.title}>CS mới</Text>
                            <View style = {{flex : 4, marginRight : 5, marginLeft : 5}}>
                              <TextInput 
                                style = {styles.textInput} 
                                value = {csm}
                                keyboardType="number-pad"
                                onChangeText = {(text) => {
                                  setCsm(text);
                                  }}
                              />   
                            </View>
                           
                          </View>
                        </View>                              
                    </View>     

                    <View style = {styles.wrapper}/>

                    <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>
                          <Text style = {styles.title}>NVXL</Text>
                          <View style = {{flex : 3, 
                            marginRight : 5}}>                            
                            <TextInput 
                                style = {styles.textInput} 
                                value = {username}
                                editable ={false}
                                onChangeText = {(text) => {
                                  }}
                              />  
                          </View>
                          <View style = {{flex : 4, 
                            marginLeft: 5, flexDirection : 'row', 
                            alignItems : 'center', justifyContent : 'center'}}>
                            <Text style = {styles.title}></Text>
                            <View style = {{flex : 4, marginRight : 5, marginLeft : 5}}>
                            </View>
                           
                          </View>
                        </View>                              
                    </View>     

                    <View style = {styles.wrapper}/>

                    <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>
                          <Text style = {styles.title}>Tên NV</Text>
                          <View style = {{flex : 7, 
                            marginRight : 5}}>                            
                            <TextInput 
                                style = {styles.textInput} 
                                editable = {false}
                                value = {tennv}
                                onChangeText = {(text) => {
                                  }}
                              />  
                          </View>
                        </View>                              
                    </View>     

                    <View style = {styles.wrapper}/>

                    <View style = {styles.rowContainer}>                                                    
                          <View style = {styles.rows}>
                            <Text style = {{flex : 2.3, 
                              fontSize : 15}}>
                                NVXL 2
                            </Text>
                            <View style = {{ flex : 4, 
                              backgroundColor : '#fffaf0', 
                              }}>
                              <TextInput 
                                style = {styles.textInput} 
                                value = {manvxl2}
                                onChangeText = {(text) => {
                                  setManvxl2(text);
                                }}
                              /> 
                            </View>
                            <View style = {[styles.iconPhone, {marginLeft : 10, flexDirection : 'row'}]}>
                              <View style = {{flex : 1}}>
                                <TouchableOpacity 
                                  onPress = {() => {
                                    changeModal_NV_Visible(true);
                                  }}
                                >
                                  <MaterialCommunityIcons 
                                    name = 'account-search-outline'
                                    size = {40}
                                    />
                                </TouchableOpacity>      
                              </View>
                              <View style = {{flex : 1, marginLeft : 10}}>
                                <TouchableOpacity 
                                  onPress = {() => {
                                    changeModal_Image_Visible(true);
                                  }}
                                >
                                  <MaterialCommunityIcons 
                                    name = 'file-image-outline'
                                    size = {40}
                                    />
                                </TouchableOpacity>      
                              </View>
                              <View style = {{flex : 2}}/>                      
                            </View>
                          </View>   
                          <Modal            
                              transparent = {true}
                              animationType = 'fade'
                              visible = {isModal_NV_Visible}
                              onRequestClose = {() => changeModal_NV_Visible(false)}
                          >
                              <ModalPicker_NhanVien 
                                changeModalVisible = {changeModal_NV_Visible}
                                setData_NhanVien = {setData_NhanVien}
                              />
                          </Modal>        
                          <Modal            
                              transparent = {true}
                              animationType = 'fade'
                              visible = {isModal_Image_Visible}
                              onRequestClose = {() => changeModal_Image_Visible(false)}
                          >
                              <ModalPicker_ImageList 
                                changeModalVisible = {changeModal_Image_Visible}
                                madon = {madon}
                                option = {0}
                              />
                          </Modal>                         
                     </View>    
                     <View style = {styles.wrapper}/>
                      <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>
                          <Text style = {styles.title}>Ngày HT</Text>
                          <View style = {styles.item}>
                            <Text style={styles.datetextinput}>{ngayht}</Text>
                            <MaterialCommunityIcons style={styles.dateicons}
                                      name = 'calendar-today'
                                      size = {30} 
                                      color = {'red'}
                                      onPress={showDatePicker}
                                      />
                            <DateTimePickerModal
                              isVisible={isDatePickerVisible}
                              mode="date"
                              onConfirm={handleConfirmDate}
                              onCancel={hideDatePicker}
                            />                       
                          </View>
                        </View>                              
                      </View>   

                    <View style = {styles.wrapper}/>

                    <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>
                          <Text style = {styles.title}>Ghi chú</Text>
                          <View style = {styles.item}>                            
                            <TextInput 
                              style = {styles.textInput} 
                              multiline = {true}
                              maxLength = {150}
                              placeholder = 'Thêm ghi chú'
                              value = {ghichu}
                              onChangeText = {(text) => {
                                setGhichu(text);
                                }}
                            />                        
                          </View>
                        </View>                              
                    </View>                      
                    
                    <View style = {styles.wrapper}/>

                    <View style = {{
                      flex : 1, 
                      backgroundColor : 'white',
                      alignItems : 'center', 
                      justifyContent : 'center',
                      height : 30
                      }}>
                      <Text style = {styles.titleVT}>DANH SÁCH VẬT TƯ</Text> 
                    </View>  
                    <View style = {styles.wrapper}/> 
                    <View style = {{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                      <View style = {styles.viewContainerFlatlist}>
                            <Text style={styles.tenvattu}>Tên vật tư</Text>  
                            <Text style={styles.slcongty}>SL Cty</Text>
                            <Text style={styles.slkhachhang}>SL Kh</Text>
                            <Text style={styles.deleteBtn}></Text>
                        </View>
                    </View>
                    <View style = {styles.wrapper}/>     

                    <View style = {{backgroundColor : 'white'}}>
                      {/* thay dòng này để ko dùng flatlist để ko lỗi 
                      VirtualizedLists should never be nested inside plain ScrollViews */}
                      {listVatTuSuaChua.map((item, index) => (
                           <FlatListItemVatTuThuongDung item = {item} key = {index}/>
                      ))}
                    </View>                     
                </ScrollView> 
                             
            </View>
            <View style = {styles.wrapper}/>           
            <View style = {{flex : 1}}>                   
                      <View style = {{
                          flex: 1,
                          flexDirection : 'row', 
                          justifyContent: 'space-around'
                        }}>
                        <TouchableOpacity 
                          style = {styles.btnButton}
                          onPress = {() => 
                            {
                              if(madon == null || madon == '')
                              {
                                alert('Mã đơn không được để trống.');
                                return;
                              }
                              if(loaixl == null || loaixl == '')
                              {
                                alert('Chọn loại xử lý.');
                                return;
                              }
                              if(loaixl == 'XL23')
                              {
                                if(tennn=='')
                                {
                                  alert('Chọn nguyên nhân.');
                                  return;
                                }
                                else if(tendk=='')
                                {
                                  alert('Chọn đường kính ống.');
                                  return;
                                }
                                else if(tenongbe=='')
                                {
                                  alert('Chọn vật liệu ống.');
                                  return;
                                }
                              }
                              setIsloading(false);
                              _capNhatSuaChua();
                              // console.log(ngayht);
                              // console.log(convertToFullDatetime(ngayht).toLocaleString("en-US"));
                            }
                          }>
                            <Text style = {styles.submitText}>Cập nhật</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style = {styles.btnButton}
                          onPress = {() => 
                            {
                              if(madon == '')
                              {
                                alert('Không tìm thấy đơn sửa chữa, không thể nhập vật tư.');
                                return;
                              }

                              navigation.navigate('TimKiemVatTu', {type, madon});
                            }
                          }>
                            <Text style = {styles.submitText}>Kê vật tư</Text>
                        </TouchableOpacity>
                        <PaperProvider>
                            <View style = {styles.anchor}>
                              <Menu style={{top: -115, left: 10}}
                                  visible={visible}
                                  onDismiss={closeMenu}
                                  anchor={<TouchableOpacity 
                                    style={{width : '92%',
                                    marginLeft:5,
                                    height : 45,
                                    borderColor : 'blue',
                                    borderRadius : 10,
                                    marginVertical : 10,
                                    borderWidth : 0,
                                    backgroundColor : '#4169e1'}}
                                    onPress = {() => 
                                        {          
                                          if (madon == '') {
                                            alert('Không tìm thấy đơn sửa chữa, không thể chụp hình.');
                                            return;
                                          }
                                          getOneTimeLocation();                                      
                                          openMenu();
                                        }
                                      }>
                                    <Text style={{fontSize : 20,
                                        fontWeight : 'bold',
                                        color : 'white',
                                        alignSelf : 'center',
                                        marginVertical : 7}}>Chụp hình</Text>
                                    </TouchableOpacity>}>
                                  <Menu.Item 
                                      title="Camera" 
                                      onPress={() => 
                                      { 
                                        closeMenu();
                                        captureImage('photo');
                                      }
                                      }  
                                    />
                                    <Divider />
                                    <Menu.Item 
                                      title="Image Library"
                                      onPress={() => 
                                      { 
                                        closeMenu();
                                        chooseFile('photo');
                                      }}  
                                    />
                            </Menu>
                          </View>
                        </PaperProvider>
                 
                      </View>                            
                  </View> 
                     
          </View>
          <>
            { 
                //để thể hiện đang loading 
                isloading === false
                ?
                  <Loading />
                :
                null
             }   
          </>
          
        </SafeAreaView>
        
      );
}
function FlatListItemVatTuThuongDung ({item}){

  const buttonDelereAlert = () =>
    Alert.alert(
      "Thông báo",
      "Bạn có muốn xoá vật tư " + `${item.TENVT}`  + " không?",
      [
        {
          text: "Không",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Có", 
          onPress: () => {
            deleteItemById(item);           
          }
        }
      ],
      { cancelable: false }
    );

  return (
      <View style={styles.cardView}>     
            <View style = {styles.wrapper}/> 
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.tenvattu}>{item.TENVT}</Text>  
                      <Text style={styles.slcongty}>{item.SOLUONG_MIENPHI}</Text>
                      <Text style={styles.slkhachhang}>{item.SOLUONG_TINHTIEN}</Text>
                      <TouchableOpacity 
                        style={styles.deleteBtn}
                        onPress = {() => {
                          buttonDelereAlert();
                        }}
                      >
                        <FontAwesome 
                          name = 'minus-circle'
                          color = '#ff0000'
                          size = {20}
                        />
                      </TouchableOpacity>
                  </View>    
                  <View style = {styles.wrapper}/>                       
      </View>  
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomColor: '#dcdcdc',
    borderBottomWidth: 1,
},
rowContainer : {
  flex : 1, 
  alignItems: 'flex-start',
},
title : {
  flex : 2, 
  fontSize : 15,
},
item : {
  flex : 7, 
  marginRight : 5
},
iconPhone : {
  flex : 4, 
},
rows : {
  flexDirection : 'row', 
  height : 50, 
  alignItems :'center', 
  justifyContent : 'center',
  marginLeft : 5,
  marginRight : 5,
},
btnButton : {
  width : '30%',
  marginLeft: 5,
  height : 45,
  borderColor : 'blue',
  borderRadius : 10,
  marginVertical : 10,
  borderWidth : 0,
  backgroundColor : '#4169e1',
},
submitText : {
  fontSize : 20,
  fontWeight : 'bold',
  color : 'white',
  alignSelf : 'center',
  marginVertical : 7
},
viewContainerFlatlist : {
  flex : 1,
  flexDirection : 'row',
  marginBottom : 8,
  justifyContent : 'center',
  alignItems : 'center'
}, 
tenvattu : {
  flex : 5,
  margin : 3,
  marginLeft : 10,
  fontWeight : 'bold', 
},
slcongty : {
  flex : 1,
  margin : 3,
  fontWeight : 'bold',
  fontStyle : 'italic', 
},
slkhachhang : {
  flex : 1,
  margin : 3,
  fontWeight : 'bold',
  fontStyle : 'italic', 
},
deleteBtn : {
  flex : 1,
  margin : 3,
},
titleVT : {
  fontSize : 15,
  fontWeight : 'bold',
  fontStyle : 'italic',
},
anchor : {
  // flex: 1, 
  justifyContent: 'flex-start',
  marginBottom: 36
},
textInput : {
  fontSize : 20, 
  fontWeight : 'bold',
  backgroundColor : '#fffaf0', 
  color : '#000000'
},
menusub: {
  position: 'relative'  
},

dateTimePicker: {
  backgroundColor: 'white',
  borderRadius: 5,
  borderColor: '#C5C5C5',
  borderWidth: 1,
  marginVertical: 10,
  height: 43,
 },

 datetextinput: {
  width: 200, 
  marginTop: 1, 
  padding: 6, 
  borderColor: 'black', 
  borderWidth: 1
 },

 dateicons: {
  marginLeft: 165, 
  marginTop: -31
 },

});