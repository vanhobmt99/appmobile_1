import React, { useContext, useState, useEffect } from 'react';
import {Text, View, SafeAreaView, TouchableOpacity, StyleSheet, 
  Dimensions, TextInput, ScrollView, Modal, Alert, PermissionsAndroid,
  Platform} from 'react-native';
import {CustomeHeader} from '../../common/CustomeHeader';
import {GlobalContext} from '../../store/GlobalProvider';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Menu, Divider, Provider as PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CheckBox } from 'react-native-elements'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { useIsFocused } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

import {callNumber} from '../../common/CommonFunction';
import {DropDown} from '../../common/DropDown';
import {list_ongnhanh} from '../../common/Constant';
import {ModalPicker_NhanVien} from '../../components/dungchung/ModalPicker_NhanVien';
import {ModalPicker_ImageList} from '../../components/dungchung/ModalPicker_ImageList';
import {Loading} from '../../common/Loading';
import {capNhatThiCong, getListVatTuThiCong, deleteVatTuThiCong, uploadImageToServer} from '../../api/Api_CongNhan';

const { width, height } = Dimensions.get('window');
export function CapNhatThongTinLapMoiScreen ({navigation, route}) { 
  var isFocused = useIsFocused();

  const global = useContext(GlobalContext);
  let url = global.url;
  let username = global.username;
  let password = global.password;
  let tennv = global.fullname;
  let listloaidongho = global.listloaidongho;

  const type = 'lapmoi';

  const[madon, setMadon] = useState(route.params.madon);
  const[tenkh, setTenkh] = useState(route.params.tenkh);
  const[diachi, setDiachi] = useState(route.params.diachi);
  const[sdt, setSdt] = useState(route.params.sdt);
  const [loaidh, setLoaidh] = useState(route.params.loaidh);
  const [ongnhanh, setOngnhanh] = useState(route.params.ongnhanh);
  const[serial, setSerial] = useState(route.params.serial);
  const[somet, setSomet] = useState(route.params.somet);
  const[duongkinh, setDuongKinh] = useState(route.params.duongkinh);
  const[csd, setCsd] = useState(route.params.csd);
  const[manvxl2, setManvxl2] = useState(route.params.manvxl_phu);
  const[ghichu, setGhichu] = useState(route.params.ghichu);

  const [visible, setVisible] = useState(false);
  const[isloading, setIsloading] = useState();

  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [locationStatus, setLocationStatus] = useState('');

  const setValueDropDown = (option) => {
    setLoaidh(option);
  }   
  const setValueDropDown_OngNhanh = (option) => {
    setOngnhanh(option);
  } 
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const [isModal_NV_Visible, setIsModal_NV_Visible] = useState(false);

  const changeModal_NV_Visible = (bool) => {
    setIsModal_NV_Visible(bool);
  } 
  
  const setData_NhanVien = (option) => {
    setManvxl2(option.manv);
  }   

  const [isModal_Image_Visible, setIsModal_Image_Visible] = useState(false);

  const changeModal_Image_Visible = (bool) => {
    setIsModal_Image_Visible(bool);
  }

  const [listVatTuThiCong, setListVatTuThiCong] = useState([]);

  deleteItemById = (value) => {

    if(_deleteVatTuThiCong(value.MAVT, value.SOLUONG_MIENPHI, value.SOLUONG_TINHTIEN))
    {
      const filteredData = listVatTuThiCong.filter(item => item.MAVT !== value.MAVT);
      setListVatTuThiCong(filteredData);
    }   
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
    setIsloading(false);

    _getListVatTuThiCong();
  }

  return () => {
    isFocused = false // add this
   }

}, [isFocused]);

useEffect(() => {
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
      subscribeLocationLocation();
    } else {
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
      } catch (err) {
        console.warn(err);
      }
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
      //console.log(position);

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
  setTenkh('');
  setDiachi('');
  setSdt('');
  setLoaidh();
  setOngnhanh();
  setSerial('');
  setSomet('');
  setDuongKinh('');
  setCsd('');
  setManvxl2('');
  setGhichu('');
  setListVatTuThiCong([]);
} 
const _capNhatThiCong = async () => { 
  capNhatThiCong(url, username, password, madon, loaidh, duongkinh, ghichu,
    csd, somet, ongnhanh, serial, manvxl2) 
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
const _getListVatTuThiCong = async () => { 
  getListVatTuThiCong(url, username, password, madon) 
    .then(obj => {
        if(obj.ResultCode === true){   
          setListVatTuThiCong(obj.Data); 
        }     
        
        setIsloading(true);
      })
      .catch(error => {
          alert('lỗi : ' + error);
      });
}
const _uploadImageToServer = async (base64) => { 
  uploadImageToServer(url, username, password, 'THICONG_' + madon, currentLatitude, currentLongitude, base64) 
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
const _deleteVatTuThiCong= async (mavt, slmp, sltt) => {
  deleteVatTuThiCong(url, username, password, madon, mavt, slmp, sltt).then(obj => {     
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
    return (
        <SafeAreaView 
          style={{flex: 1}}
          >
          <CustomeHeader
            title = 'Cập nhật thông tin lắp mới'
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
                              <Text style = {styles.textInput} >  
                                {madon}
                              </Text>
                            </View>
                          </View>                              
                    </View>   

                    <View style = {styles.wrapper}/>  

                    <View style = {styles.rowContainer}>                                                    
                          <View style = {styles.rows}>
                            <Text style = {styles.title}>Tên KH</Text>
                            <View style = {styles.item}>
                              <Text style = {styles.textInput}> {tenkh}</Text> 
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
                              > {diachi}</TextInput>  
                            </View>
                          </View>                              
                    </View>  

                    <View style = {styles.wrapper}/>                       
            
                    <View style = {styles.rowContainer}>                                                    
                          <View style = {styles.rows}>
                            <Text style = {{flex : 2.6, 
                              fontSize : 15}}>
                                Sđt
                            </Text>
                            <View style = {{ flex : 5, 
                              backgroundColor : '#fffaf0', 
                              }}>
                              <Text style = {styles.textInput}> {sdt} </Text>
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
                          <Text style = {styles.title}>Ống nhánh</Text>
                          <View style = {{flex : 1.9, 
                            marginRight : 5}}>                            
                            <DropDown 
                              defaultValue = {ongnhanh != null ? ongnhanh : 'Chọn'} 
                              list = {list_ongnhanh} 
                              setValueDropDown = {setValueDropDown_OngNhanh}/>        
                          </View>
                          <View style = {{flex : 5, 
                            marginLeft: 5, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                            <Text style = {styles.title}>Loại</Text>
                            <View style = {{flex : 8, marginRight : 5}}>
                              <DropDown 
                                defaultValue = {loaidh != null ? loaidh : 'Chọn nội dung'} 
                                list = {listloaidongho} 
                                setValueDropDown = {setValueDropDown}
                              />
                            </View>                         
                          </View>
                        </View>                              
                    </View>     

                    <View style = {styles.wrapper}/> 

                    <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>
                          <Text style = {styles.title}>Số serial</Text>
                          <View style = {{flex : 3, 
                            marginRight : 5}}>                            
                            <TextInput 
                                style = {styles.textInput} 
                                value = {serial}
                                onChangeText = {(text) => {
                                  setSerial(text);
                                  }}
                              />         
                          </View>
                          <View style = {{flex : 4, 
                            marginLeft: 5, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                            <Text style = {styles.title}>Chỉ số</Text>
                            <View style = {{flex : 4, marginRight : 5, marginLeft : 5}}>
                              <TextInput 
                                style = {styles.textInput} 
                                value = {csd != null ? csd.toString(): ''}
                                keyboardType="number-pad"
                                onChangeText = {(text) => {
                                  setCsd(text);
                                  }}
                              />   
                            </View>
                           
                          </View>
                        </View>                              
                    </View>     
                
                    <View style = {styles.wrapper}/> 

                    <View style = {styles.rowContainer}>                                                       
                        <View style = {styles.rows}>
                          <Text style = {styles.title}>ĐK ống</Text>
                          <View style = {{flex : 3, 
                            marginRight : 5}}>                            
                            <TextInput 
                                style = {styles.textInput} 
                                value = {duongkinh != null ? duongkinh.toString() : ''}
                                keyboardType="number-pad"
                                onChangeText = {(text) => {
                                  setDuongKinh(text);
                                  }}
                              />  
                          </View>
                          <View style = {{flex : 4, 
                            marginLeft: 5, flexDirection : 'row', 
                            alignItems : 'center', justifyContent : 'center'}}>
                            <Text style = {{ flex : 2, 
                              fontSize : 15,}}>Số mét</Text>
                            <View style = {{flex : 4, marginRight : 5, marginLeft : 5}}>
                              <TextInput 
                                style = {styles.textInput} 
                                value = {somet != null ? somet.toString() : '4'}
                                keyboardType="numeric"
                                onChangeText = {(text) => {
                                  setSomet(text);
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
                                value ={username}
                                editable = {false}
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
                          <View style = {{flex : 5, 
                            marginRight : 5}}>                            
                            <TextInput 
                                style = {styles.textInput} 
                                value = {tennv}
                                editable = {false}
                              />  
                          </View>
                          <View style = {{flex : 2, 
                            marginLeft: 5, flexDirection : 'row', 
                            alignItems : 'center', justifyContent : 'center'}}>
                            <Text style = {styles.title}></Text>
                            <View style = {{flex : 3}}>
                            </View>
                           
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
                              <TextInput style = {styles.textInput} 
                                value = {manvxl2}
                                editable = {false}
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
                                    // color = {'#000000'}
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
                                option = {1}
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
                      {listVatTuThiCong.map((item, index) => (
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
                              setIsloading(false);
                              _capNhatThiCong();
                            }
                          }>
                            <Text style = {styles.submitText}>Cập nhật</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style = {styles.btnButton}
                          onPress = {() => 
                            {
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
  marginVertical :7
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
}
});