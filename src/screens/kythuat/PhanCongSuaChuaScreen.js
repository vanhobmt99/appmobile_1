import React, { useContext, useState, useEffect, useRef } from 'react';
import {Text, View, SafeAreaView, TouchableOpacity, RefreshControl, ActivityIndicator,
StyleSheet, Dimensions, FlatList, Modal, Vibration} from 'react-native';
import {CustomeHeader} from '../../common/CustomeHeader';
import {GlobalContext} from '../../store/GlobalProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, Provider as PaperProvider } from 'react-native-paper';
import {ModalPicker_PhanCong} from '../../components/dungchung/ModalPicker_PhanCong';

import { useIsFocused } from '@react-navigation/native';
import {getVietNamDate} from '../../common/CommonFunction';

import {getListSuaChuaChuaPhanCong, getListSuaChuaDaPhanCong} from '../../api/Api_KyThuat';
import { Badge } from 'react-native-elements';
import NotifService from '../../screens/NotifService';

const { width, height } = Dimensions.get('window');

export function PhanCongSuaChuaScreen (props) {

  var isFocused = useIsFocused();
  const global = useContext(GlobalContext);
  let username = global.username;
  let password = global.password;
  let makv = global.makv;

  const [active, setActive] = useState(0);

  const [listChuaPhanCong, setListChuaPhanCong] = useState(global.list_suachua_chuaphancong_initial);

  const [listDaPhanCong, setListDaPhanCong] = useState([]);

  const[count_compare_suachua, setCount_compare_suachua] = useState(0);
  const suachua_ref = useRef(0); 

  const vibrate = () => {
    if (Platform.OS === "ios") {
      const interval = setInterval(() => Vibration.vibrate(), 1000);
      setTimeout(() => clearInterval(interval), 5000);
    } else { 
      Vibration.vibrate(5000);
    }
  };
  
  useEffect(() => {    
    if(isFocused){
      _getListSuaChuaDaPhanCong();
      console.log('isFocused phancongsuchua equals true reload component to get newest list');
    }
    return () => {
      isFocused = false // add this
     }
  }, [isFocused]);
  
  const [registerToken, setRegisterToken] = useState();
  const [fcmRegistered, setFcmRegistered] = useState();
  const notif = useRef(new NotifService(
    onRegister,
    onNotif,
  ));

  const onRegister = (token) => {
    setRegisterToken(token.token)
    setFcmRegistered(true)
  }

  const onNotif = (notif) => {
    Alert.alert(notif.title, notif.message);
  }

  const handlePerm = (perms) => {
    Alert.alert('Permissions', JSON.stringify(perms));
  }  

  const [refreshing, setRefreshing] = useState(true);    

  const onRefresh = () => {

    //Clear old data of the list
    setListChuaPhanCong([]);
    setListDaPhanCong([]);

    //Call the Service to get the latest data
    _getListSuaChuaChuaPhanCong();
    _getListSuaChuaDaPhanCong();
   
  };

  useEffect(() => {        
    if(count_compare_suachua > 0) 
    {
      notif.current.localNotif('sample.mp3', "Phân công sửa chữa", "Có ["+ count_compare_suachua +"] đơn sửa chữa chưa phân công");      
    }
    console.log("suachua_ref has changed");
    suachua_ref.current = listChuaPhanCong;    
  }, [listChuaPhanCong]);

  useEffect(() => {
    _compareSuachua();   

    return () => {
      suachua_ref.current = 0;
    };
  }, []);

  const _compareSuachua = () => {
    let timer = setInterval(() => 
    {
      _getListSuaChuaChuaPhanCong();
    }, 180000);
    return () => clearInterval(timer);
  }

  removeItemOfListById = (value) => {
    const filteredData = listChuaPhanCong.filter(item => item.MADON !== value.MADON);
    setListChuaPhanCong(filteredData);

    setListDaPhanCong([...listDaPhanCong, {
      MADON : value.MADON,
      MAKH : value.MAKH,
      TENKH : value.TENKH,
      SDT : value.SDT,
      DIACHI : value.DIACHI,
      NOIDUNG : value.NOIDUNG,
      THONGTINKH : value.THONGTINKH,
      NGAYBAO : value.NGAYBAO,
      DANHSACHNGUOIDUOCPHANCONGTHEODON : value.DANHSACHNGUOIDUOCPHANCONGTHEODON,
    }]);
  }

  const _getListSuaChuaChuaPhanCong = async () => {
    getListSuaChuaChuaPhanCong(global.url, username, password).then(obj => {
          if(obj.ResultCode === true)
          {    
            setRefreshing(false);
            let arr_temp = obj.Data;                       
            if(arr_temp.length > suachua_ref.current.length)
            {
               let count_number = arr_temp.length - suachua_ref.current.length;                           
               setCount_compare_suachua(count_number);
               setListChuaPhanCong(arr_temp);
               vibrate();             
            }   
          }      
        })
        .catch(error => {
            alert('lỗi : ' + error);
        });
  }

  const _getListSuaChuaDaPhanCong = async () => {
    getListSuaChuaDaPhanCong(global.url, username, password).then(obj => {
      //console.log(obj);
          if(obj.ResultCode === true)
          { 
            setRefreshing(false);   
            setListDaPhanCong(obj.Data);     
          }      
        })
        .catch(error => {
            alert('lỗi : ' + error);
        });
  }
  
 
    return (
        <SafeAreaView style={{flex: 1}}>
          <CustomeHeader
            title= 'Phân công sửa chữa'
            isHome={true}
            navigation={props.navigation} 
          />    
          <View style = {{width : '96%', marginLeft : 'auto', marginRight : 'auto'}}>
            <View 
              style = {{
                flexDirection : 'row', 
                marginTop : 0, 
                marginBottom : 5,
                height : 36,
                position : 'relative'
                }}>
                <TouchableOpacity 
                  style={{
                    flex : 1, 
                    justifyContent : 'center', 
                    alignItems : 'center',
                    borderWidth : 1,
                    borderColor : '#4169e1',
                    borderRadius : 4,
                    borderRightWidth : 0,
                    borderTopRightRadius : 0,
                    borderBottomRightRadius : 0,
                    backgroundColor : active === 0 ? '#4169e1' : '#fff'
                    }}
                  onPress = {() => {
                    setActive(0);
                    setCount_compare_suachua(0); //click vào tab set badge = 0
                  }} 
                    >
                      <View style = {{flexDirection : 'row'}}>
                        <Text style = {{color : active === 0 ? '#fff' : '#4169e1', marginRight : 5}}>Chưa phân công</Text>
                        <Badge 
                          value={count_compare_suachua != 0 ? count_compare_suachua : ''} 
                          status="error" 
                        />
                      </View>
                  
                </TouchableOpacity>
                <TouchableOpacity 
                style={{
                    flex : 1, 
                    justifyContent : 'center', 
                    alignItems : 'center',
                    borderWidth : 1,
                    borderColor : '#4169e1',
                    borderRadius : 4,
                    borderLeftWidth : 0,
                    borderTopLeftRadius : 0,
                    borderBottomLeftRadius : 0,
                    backgroundColor : active === 1 ? '#4169e1' : '#fff'
                  }} 
                  onPress = {() => {
                    setActive(1);
                  }} 
                  >
                  <Text style = {{color : active === 1 ? '#fff' : '#4169e1'}}>Đã phân công</Text>
                </TouchableOpacity>
                <TouchableOpacity  
                  style={{
                      flex : 1,    
                      justifyContent : 'center', 
                      alignItems : 'center',                                  
                      borderWidth : 1,
                      borderColor : '#4169e1',
                      borderRadius : 4,
                      borderLeftWidth : 0,
                      borderTopLeftRadius : 0,
                      borderBottomLeftRadius : 0,
                      backgroundColor : 'green',
                    }} 
                    onPress = {() => {
                      onRefresh();
                    }} 
                  >
                  <MaterialCommunityIcons style = {{position: 'absolute', right: 75}} name ='reload' color = {'#fff'} size={20} />                  
                  <Text style = {{color : '#fff', position: 'absolute', right: 20}}>Refresh</Text>
                </TouchableOpacity>               
            </View>
            
          </View>
          
          <View style = {{flex : 1}}>                   
            <View style = {{flex : 6}}>
              <View style = {{flex : 1}}>
                    <View style = {styles.wrapper}/> 
                    {
                      active === 0 
                      ?
                        <PaperProvider>
                          <FlatList     
                              refreshControl={
                                <RefreshControl
                                  refreshing={refreshing}
                                  onRefresh={onRefresh}
                                />
                              }                           
                              data = {listChuaPhanCong}
                              renderItem = {({item}) => (
                                  <FlatListItemSuaChua item = {item} active = {active}/>                       
                                                      
                              )}
                              keyExtractor = {item => item.MADON.toString()}>
                          </FlatList> 
                        </PaperProvider>                
                      :
                      <PaperProvider>
                        <FlatList
                            refreshControl={
                              <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                              />
                            }
                            data = {listDaPhanCong}
                            renderItem = {({item}) => (
                                <FlatListItemSuaChua item = {item}/>                       
                                                    
                            )}
                            keyExtractor = {item => item.MADON.toString()}>
                        </FlatList> 
                      </PaperProvider>
                    }               
                </View>
            </View>          
          </View>
          
        </SafeAreaView>
      );
}

function FlatListItemSuaChua({item, active}){

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const changeModalVisible = (bool) => {
        setIsModalVisible(bool);
    }

  const removeItemFromList = () => {
    //active = 0 là đang ở list chưa phân công, khi phân công rồi đóng 
    //nút close thì sẽ remove item đó chuyển sang
    //list đã phân công
    if(active === 0){
      removeItemOfListById(item);
    }   
  }
  return (
      <View style={styles.cardView}>                  
                 <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Mã đơn:</Text>  
                      <Text style={styles.itemFlatlist}>{item.MADON}</Text> 
                      <View style={styles.iconFlatlist}>
                          <Menu
                              visible={visible}
                              onDismiss={() => {closeMenu()}}
                              anchor={
                                <TouchableOpacity 
                                  onPress = {() => {
                                    openMenu();
                                  }} 
                                >
                                  <MaterialCommunityIcons 
                                    name = 'dots-horizontal'
                                    color = {'#000000'}
                                    size = {30}
                                    />
                              </TouchableOpacity>                                    
                              }
                              >
                                <Menu.Item title="Phân công" 
                                  onPress={() => 
                                  {
                                    closeMenu();
                                    changeModalVisible(true);
                                  }} 
                                /> 
                          </Menu> 
                      </View>                                                                                  
                  </View>  
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Danh bộ:</Text>  
                      <Text style={styles.itemFlatlist}>{item.MAKH} </Text>
                      <View  style = {styles.iconFlatlist}>                                         
                      </View>  
                  </View>                   
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Tên KH:</Text>  
                      <Text style={styles.itemFlatlist}>{item.TENKH} </Text>
                      <View  style = {styles.iconFlatlist}>                                         
                      </View>  
                  </View>           
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>SĐT:</Text>  
                      <Text style={styles.itemFlatlist}>{item.SDT} </Text>
                      <View  style = {styles.iconFlatlist}>                                         
                      </View>  
                  </View>                
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Địa chỉ:</Text>  
                      <Text style={styles.itemFlatlist}>{item.DIACHI} </Text>
                      <View  style = {styles.iconFlatlist}>  
                      </View>  
                  </View>
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Nội dung:</Text>  
                        <Text style={styles.itemFlatlist}>{item.NOIDUNG}</Text>
                      <View  style = {styles.iconFlatlist}>  
                      </View>
                  </View>   
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Thông tin:</Text>  
                        <Text style={styles.itemFlatlist}>{item.THONGTINKH}</Text>
                      <View  style = {styles.iconFlatlist}>  
                      </View>
                  </View>    
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Ngày báo:</Text>  
                        <Text style={styles.itemFlatlist}>{getVietNamDate(item.NGAYBAO)}</Text>
                      <View  style = {styles.iconFlatlist}>  
                      </View>
                  </View>    
                  {/* <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>NVXL:</Text>  
                        <Text style={styles.itemFlatlist}>{item.DANHSACHNGUOIDUOCPHANCONGTHEODON}</Text>
                      <View  style = {styles.iconFlatlist}>  
                      </View>
                  </View>  */}
                  <Modal            
                      transparent = {true}
                      animationType = 'fade'
                      visible = {isModalVisible}
                      onRequestClose = {() => changeModalVisible(false)}
                  >
                      <ModalPicker_PhanCong 
                        changeModalVisible = {changeModalVisible}
                        madon = {item.MADON}
                        removeItemFromList = {removeItemFromList}
                      />
                  </Modal>                     
      </View>        
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomColor: '#dcdcdc',
    borderBottomWidth: 1,
},
cardView : {
  backgroundColor: 'white',
  margin: width * 0.01,
  borderRadius: width * 0.02,
  shadowColor: '#000',
  shadowOffset: { width:0.5, height: 0.5 },
  shadowOpacity: 0.5,
  shadowRadius: 3,
  borderWidth : 0.5,
},
viewContainerFlatlist : {
  flexDirection : 'row',
  marginBottom : 5,
  flex : 1
}, 
titleFlatlist : {
  margin : 3,
  marginLeft : 5,
  fontStyle : 'italic',
  flex : 2,
},
itemFlatlist : {
  margin : 3,
  fontWeight : 'bold',
  flex : 6
},
iconFlatlist : {
  alignItems : 'flex-end',
  justifyContent : 'flex-start',
  marginRight : 10,
  flex : 1,
},
});