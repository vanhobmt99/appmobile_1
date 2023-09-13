import React, { useContext, useState, useEffect } from 'react';
import {Text, View, SafeAreaView, TouchableOpacity, StyleSheet, 
  Dimensions, TextInput, ScrollView, Modal, Alert, Image,
  Platform,
  PermissionsAndroid} from 'react-native';
import {CustomeHeader} from '../../common/CustomeHeader';
import {GlobalContext} from '../../store/GlobalProvider';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { Button, IconButton, Colors, Menu, Divider, Provider as PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CheckBox } from 'react-native-elements'
import { useIsFocused } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import DatePicker from 'react-native-datepicker';
import {callNumber} from '../../common/CommonFunction';
import {DropDown} from '../../common/DropDown';
import {codh, niemchi} from '../../common/Constant';
import {ModalPicker_KhachHang} from '../../components/dungchung/ModalPicker_KhachHang';
import {ModalPicker_NhanVien} from '../../components/dungchung/ModalPicker_NhanVien';
import {Loading} from '../../common/Loading';

import {getListDMNguyenNhan, getListDuongKinhOng, getListVatLieuOng} from '../../api/Api_DungChung';
import {thayDongHoDinhKy, uploadImageToServer, getListVatTuSuaChua} from '../../api/Api_CongNhan';

const { width, height } = Dimensions.get('window');

export function TaoThongTinSuaChua_CongNhan_Screen ({navigation, route}) {

  var isFocused = useIsFocused();

  const global = useContext(GlobalContext);

  let url = global.url;
  let username = global.username;
  let password = global.password;
  let tennv = global.fullname;
  let listloaixl = global.listloaixl;
  let listloaidongho = global.listloaidongho; 

  const type = 'suachua';

  const[madon, setMadon] = useState('');
  const[idkh, setIdkh] = useState('');
  const[danhbo, setDanhbo] = useState('');
  const[tenkh, setTenkh] = useState('');
  const[diachi, setDiachi] = useState('');
  const[sdt, setSdt] = useState('');
  const[thongtinkh, setThongtinkh] = useState('');
  const[noidung, setNoiDung] = useState('');
  const[loaixl, setLoaixl] = useState('');
  const[lydo, setLydo] = useState('');
  const[bienphap, setBienphap] = useState('');
  const[duongkinhdh, setDuongkinhdh] = useState('');  
  const[loaidh, setLoaidh] = useState('');
  const[niem3chi, setNiem3chi] = useState('');
  const[serial, setSerial] = useState('');
  const[csc, setCsc] = useState('');
  const[csm, setCsm] = useState('');
  const[manvxl2, setManvxl2] = useState('');
  const[ghichu, setGhichu] = useState('');   
 
  const[mann, setDMNguyenNhan] = useState('');
  const[madk, setDuongKinhOng] = useState('');
  const[loaiongbe, setLoaiOngBe] = useState('');
  const [tennn, setTennn] = useState('');
  const [tendk, setTendk] = useState('');
  const [tenongbe, setTenOngBe] = useState('');

  const[isloading, setIsloading] = useState();
  const [visible, setVisible] = useState(false);

  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [locationStatus, setLocationStatus] = useState('');

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

  const [listDMNguyenNhan, setNNOngBe] = useState([]);
  const [listDuongKinhOng, setDKOng] = useState([]);
  const [listVatLieuOng, setVLOng] = useState([]);

  const [listVatTuSuaChua, setListVatTuSuaChua] = useState([]); 
  deleteItemById = id => {
    const filteredData = listVatTuSuaChua.filter(item => item.mavattu !== id);
    setListVatTuSuaChua(filteredData);
  } 

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

  thayDongHoDinhKy(url, username, password, madon, idkh, tenkh, 
    sdt, thongtinkh, noidung, loaixl, lydo, bienphap, duongkinhdh, loaidh,
    niem3chi, serial, csc, csm, manvxl2, ghichu, mann, madk, loaiongbe) 
    .then(obj => {
      // console.log(url, username, password, madon, idkh, tenkh, 
      //   sdt, thongtinkh, noidung, loaixl, lydo, bienphap, duongkinhdh, loaidh,
      //   niem3chi, serial, csc, csm, manvxl2, ghichu);
        if(obj.ResultCode === true){   
          setIsloading(true); 
          if(madon == '')
          {
            setMadon(obj.Data);
            alert('Tạo mới thông tin sửa chữa thành công.');
          }
          else
          {
            clearData();  
            alert('Cập nhật dữ liệu thành công.');  
          }          
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
  uploadImageToServer(url, username, password, 'SUACHUA_' + madon, 0, 0, base64) 
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
      })
      .catch(error => {
          alert('lỗi : ' + error);
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
            title = 'Tạo thông tin sửa chữa'
            isHome={false}
            navigation={navigation} 
          />                            
          <View style = {{flex : 1}}> 
                                       
            <View style = {{flex : 8}}>
              <ScrollView>
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
                            <DropDown 
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
                          <View style = {{flex : 2.2, 
                            marginRight : 5}}>                        
                              <DropDown defaultValue = {tendk != null ?  tendk: 'Tất cả'} 
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
                          <View style = {{flex : 2.2, 
                            marginRight : 5}}>                            
                            <DropDown defaultValue = {'Chọn'} 
                              list = {codh} 
                              setValueDropDown = {setValueDropDown_DuongKinhDh}/>        
                          </View>
                          <View style = {{flex : 4.5, 
                            marginLeft: 5, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                            <Text style = {styles.title}>Loại</Text>
                            <View style = {{flex : 8, marginRight : 5}}>
                              <DropDown 
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
                              <View style = {{flex : 3}}/>                      
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
                              if(loaixl == null || loaixl == '')
                              {
                                alert('Chọn loại xử lý.');
                                return;
                              }
                              if(loaixl == 'XL23')
                              {
                                if(mann=='')
                                {
                                  alert('Chọn nguyên nhân.');
                                  return;
                                }
                                else if(madk=='')
                                {
                                  alert('Chọn đường kính ống.');
                                  return;
                                }
                                else if(loaiongbe=='')
                                {
                                  alert('Chọn vật liệu ống.');
                                  return;
                                }
                                
                              }
                              setIsloading(false);
                              _capNhatSuaChua();
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
                                    marginLeft: 5,
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
            deleteItemById(item.MAVT);           
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
btnButtoncam : {
  width : '30%',
  height : 40,
  borderColor : 'blue',
  borderRadius : 5,
  marginVertical : 10,
  borderWidth : 0,
  backgroundColor : '#4169e1',
  color:'#fff',
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
  //flex: 1,   
  justifyContent: 'flex-start',
  marginBottom: 36
},
textInput : {
  fontSize : 20, 
  fontWeight : 'bold',
  backgroundColor : '#fffaf0', 
  color : '#000000'
},

container: {
  flex: 1,
  padding: 10,
  backgroundColor: '#fff',
  alignItems: 'center',
},
titleText: {
  fontSize: 22,
  fontWeight: 'bold',
  textAlign: 'center',
  paddingVertical: 20,
},
textStyle: {
  padding: 10,
  color: 'black',
  textAlign: 'center',
},
buttonStyle: {
  alignItems: 'center',
  backgroundColor: '#DDDDDD',
  padding: 5,
  marginVertical: 10,
  width: 250,
},
imageStyle: {
  width: 200,
  height: 200,
  margin: 5,
},
input: {
  marginTop: 5,
  height: 40,
  width: '100%',
  borderWidth: 2,
  padding: 10,
  borderRadius: 5,
  borderColor: '#1287A5'
},

});