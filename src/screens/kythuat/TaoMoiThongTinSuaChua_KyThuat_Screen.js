import React, { useContext, useState, useEffect } from 'react';
import {Text, View, SafeAreaView, TouchableOpacity, StyleSheet, 
  Dimensions, TextInput, ScrollView, Modal, ActivityIndicator} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {CustomeHeader} from '../../common/CustomeHeader';
import {GlobalContext} from '../../store/GlobalProvider';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {ModalPicker_KhachHang} from '../../components/dungchung/ModalPicker_KhachHang';
import {Loading} from '../../common/Loading';

//api 
import {insertThongTinTruongVung} from '../../api/Api_KyThuat';

const { width, height } = Dimensions.get('window');

export function TaoMoiThongTinSuaChua_KyThuat_Screen ({navigation, route}) {

  const global = useContext(GlobalContext);

  let username = global.username;
  let password = global.password;

  var isFocused = useIsFocused();

  const[idkh, setIdkh] = useState('');
  const[danhbo, setDanhbo] = useState('');
  const[tenkh, setTenkh] = useState('');
  const[diachi, setDiachi] = useState('');
  const[sdt, setSdt] = useState('');
  const[thongtin, setThongTin] = useState('');
  const[noidung, setNoiDung] = useState('');
  const[nguoibao, setNguoiBao] = useState('Khách hàng');

  const[isloading, setIsloading] = useState();

  const [isModal_KH_Visible, setIsModal_KH_Visible] = useState(false);

  const changeModal_KH_Visible = (bool) => {
    setIsModal_KH_Visible(bool);
    }

  const setData = (option) => {
    setIdkh(option.idkh);
    setDanhbo(option.danhbo);
    setTenkh(option.tenkh);
    setDiachi(option.diachi);
    setSdt(option.sdt);
  }  
   
  const clearData = () => {
    setIdkh();
    setDanhbo('');
    setTenkh('');
    setDiachi('');
    setSdt('');
    setThongTin('');
    setNoiDung('');
    setNguoiBao('Khách hàng');
  }   

  useEffect(() => {
    if(isFocused === false){
      clearData();
    }
    return () => {
      isFocused = false // add this
     }
  },[isFocused]);

  const _insertThongTinTruongVung = async () => {
    insertThongTinTruongVung(global.url, username, password, thongtin, nguoibao, noidung, sdt, tenkh, idkh).then(obj => {
        if(obj.ResultCode === true)
        { 
            setIsloading(true);      
            alert(obj.Data);   
            clearData();                
        }      
        else{    
            setIsloading(true); 
            alert('Thêm mới thông tin sửa chữa khÔNG thành công.');                
          }
        })
        .catch(error => {
            setIsloading(true);  // set = true để đóng lại
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
                            <Text style = {{flex : 2.3, 
                              fontSize : 15}}>
                                IDKH
                            </Text>
                            <View style = {{ flex : 4, 
                              backgroundColor : '#fffaf0', 
                              }}>
                              <TextInput 
                                style = {styles.textInput} 
                                editable = {false} 
                                value = {idkh}/> 
                            </View>
                            <View style = {[styles.iconPhone, {marginLeft : 10, flexDirection : 'row'}]}>
                              <View style = {{flex : 1}}>
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
                            <Text style = {{flex : 2.3, 
                              fontSize : 15}}>
                                Danh bộ
                            </Text>
                            <View style = {{ flex : 4, 
                              backgroundColor : '#fffaf0', 
                              }}>
                              <TextInput 
                                style = {styles.textInput} 
                                editable = {false}
                                value = {danhbo}/> 
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
                                multiline = {true}
                                value = {tenkh}
                                placeholder = 'Thêm tên khách hàng'
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
                                placeholder = 'Thêm địa chỉ'
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
                            <Text style = {{flex : 2.3, 
                              fontSize : 15}}>
                                Sđt
                            </Text>
                            <View style = {{ flex : 4, 
                              backgroundColor : '#fffaf0', 
                              }}>
                              <TextInput 
                                style = {styles.textInput}
                                maxLength = {10}
                                keyboardType = 'phone-pad'
                                value = {sdt}
                                placeholder = 'Thêm SĐT'
                                onChangeText = {(text) => {
                                  setSdt(text);
                                }}
                              /> 
                            </View>
                            <View style = {[styles.iconPhone, {flexDirection : 'row', marginLeft : 10}]}>
                              <View style = {{flex : 1}}>                                
                              </View> 
                              <View style = {{flex : 3}}></View>                                                      
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
                              placeholder = 'Thêm thông tin vị trí'
                              value = {thongtin}
                              onChangeText = {(text) => {
                                setThongTin(text);
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
                               placeholder = 'Thêm nội dung báo'
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
                          <Text style = {styles.title}>Người báo</Text>
                          <View style = {styles.item}>                            
                            <TextInput 
                              style = {styles.textInput} 
                              // placeholder = 'Thêm ghi chú'
                              value = {nguoibao}
                              onChangeText = {(text) => {
                                }}
                            />                        
                          </View>
                        </View>                              
                    </View>     

                    <View style = {styles.wrapper}/>
                  
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
                              _insertThongTinTruongVung();
                            }
                          }>
                            <Text style = {styles.submitText}>Tạo thông tin</Text>
                        </TouchableOpacity>                     
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
  width : width - 20,
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
  fontSize : 19, 
  fontWeight : 'bold',
  backgroundColor : '#fffaf0', 
  color : '#000000'
},
});