import React, { useContext, useState, useEffect, useRef } from 'react';
import {Text, View, SafeAreaView, TouchableOpacity, Alert, RefreshControl, ActivityIndicator,
  ScrollView, StyleSheet, Dimensions, Vibration, TextInput} from 'react-native';
import {CustomeHeader} from '../../common/CustomeHeader';
import {GlobalContext} from '../../store/GlobalProvider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getListSuaChuaDuocPhanCong, getListThiCongDuocPhanCong} from '../../api/Api_CongNhan';
import { useIsFocused } from '@react-navigation/native';
import { Menu, Provider as PaperProvider, List } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Badge } from 'react-native-elements';
import {getVietNamDate, isValidDate} from '../../common/CommonFunction';
import NotifService from '../../screens/NotifService';

const { width, height } = Dimensions.get('window');

export function HomeScreen (props) {

  var isFocused = useIsFocused();

  const global = useContext(GlobalContext);
  let url = global.url;
  let username = global.username;
  let password = global.password;

  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [searchKey, setSearchKey] = useState('');

  const [list_suachua, setList_suachua] = useState(global.list_suachua_initial);
  const [list_lapmoi, setList_lapmoi] = useState(global.list_thicong_initial);

  const[count_compare_suachua, setCount_compare_suachua] = useState(0);
  const[count_compare_thicong, setCount_compare_thicong] = useState(0);

  const suachua_ref = useRef(0); // dùng ref có thể set trực tiếp giá trị dùng ref.current, usestate trong interval giá trị lấy mặc định initial, nên phải dùng useref
  const thicong_ref = useRef(0); 

  const vibrate = () => {
    if (Platform.OS === "ios") {
      const interval = setInterval(() => Vibration.vibrate(), 1000);
      setTimeout(() => clearInterval(interval), 5000);
    } else { 
      Vibration.vibrate(5000);
    }
  };
  
  const [refreshing, setRefreshing] = useState(true);    

  const onRefresh = () => {
    //Clear old data of the list
    setList_suachua([]);
    setList_lapmoi([]);
    
    //Call the Service to get the latest data
    _getListSuaChuaDuocPhanCong();
    _getListThiCongDuocPhanCong();
  };

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

  useEffect(() => {
    if(count_compare_suachua > 0) 
    {
       notif.current.localNotif('sample.mp3', "Phân công sửa chữa", "Có ["+ count_compare_suachua +"] đơn chưa tiếp nhận sửa chữa");
    }
    console.log("suachua_ref has changed");
    suachua_ref.current = list_suachua;    
  }, [list_suachua]);

  useEffect(() => {
    console.log("thicong_ref has changed");
    thicong_ref.current = list_lapmoi;
  }, [list_lapmoi]);

  useEffect(() => {
    _compareSuachua();   
  }, []);
  
  const _compareSuachua = () => {
    let timer = setInterval(() => 
    {
       _getListSuaChuaDuocPhanCong();
       _getListThiCongDuocPhanCong();
    }, 180000);
    return () => clearInterval(timer);
  }

  const _getListSuaChuaDuocPhanCong = async () => {
    getListSuaChuaDuocPhanCong(url, username, password).then(obj => {
          if(obj.ResultCode === true)
          {   
            setRefreshing(false);
            let arr_temp = obj.Data;            
            if(arr_temp.length > suachua_ref.current.length)
            {
              let count_number = arr_temp.length - suachua_ref.current.length;             
              setCount_compare_suachua(count_number);
              setList_suachua(arr_temp);
              vibrate();             
            }
          }            
        })
        .catch(error => {
            alert('lỗi : ' + error);
        });
  }

  const _getListThiCongDuocPhanCong = async () => {
    getListThiCongDuocPhanCong(url, username, password).then(obj => {
          if(obj.ResultCode === true)
          {    
            setRefreshing(false);
            let arr_temp = obj.Data;
            if(arr_temp.length > thicong_ref.current.length)
            {
              let count_number = arr_temp.length - thicong_ref.current.length;
              setCount_compare_thicong(count_number);
              setList_lapmoi(arr_temp);
              vibrate();             
            }
          }      
        })
        .catch(error => {
            alert('lỗi : ' + error);
        });
  }

  goToNextScreen = (item) => {
    let madon = item.MADON;
    let idkh = item.IDKH;
    let danhbo = item.MAKH;
    let tenkh = item.TENKH;
    let diachi = item.DIACHI;
    let sdt = item.SDT;
    let thongtinkh = item.THONGTINKH;
    let noidung = item.NOIDUNG;
    let loaixl = item.MAXL;
    let tenxl = item.TENXL;
    let lydo = item.LYDO;
    let bienphap = item.BIENPHAPXL;
    let codh = item.CODH;
    let loaidh = item.MADH;
    let niemchi = item.NIEMCHI;
    let serial = item.SOSERIAL;
    let csc = item.CSTRUOC;
    let csm = item.CSSAU;
    let manvxl_phu = item.MANV_XLPHU;
    let ghichu = item.GHICHU;
    let mann = item.MANN;
    let tennn = item.TENNN;
    let madk = item.MADK;
    let tendk = item.TENDK;
    let loaiongbe = item.LOAIONGBE;
    let tenongbe = item.TENONGBE;

    return props.navigation.navigate('CapNhatThongTinSuaChua', 
    {madon, idkh, danhbo, tenkh, diachi, sdt, thongtinkh, noidung, loaixl, tenxl, lydo,
     bienphap, codh, loaidh, niemchi, serial, csc,csm, manvxl_phu, ghichu, mann,
     tennn,
     madk,
     tendk,
     loaiongbe,
     tenongbe}
    );
  }

  goToNextScreen_LapMoi = (item) => {

    let madon = item.MADDK;
    let tenkh = item.TENKH;
    let diachi = item.DIACHI;
    let sdt = item.SDT;
    let ongnhanh = item.ONGNHANH;
    let loaidh = item.MALDH;
    let serial = item.SOSERIAL;
    let csd = item.CSDAU;
    let duongkinh = item.DUONGKINH;
    let somet = item.MTHUCTE;
    let manvxl_phu = item.MANVPHU;
    let ghichu = item.GHICHU;
    return props.navigation.navigate('CapNhatThongTinLapMoi', 
    {madon, tenkh, diachi, sdt, ongnhanh, loaidh, serial, csd, duongkinh,
    somet, manvxl_phu, ghichu});
  }
const searchItemInList = (value) => {
  if(value != '')
  {
    //search theo key
    const filteredData_Lapmoi = list_lapmoi.filter(
      item => 
      item.MADDK.toUpperCase().includes(value.toUpperCase())
      || item.TENKH.toUpperCase().includes(value.toUpperCase()) 
      || item.DIACHI.toUpperCase().includes(value.toUpperCase())
      || item.SDT.toUpperCase().includes(value.toUpperCase())
      );
    
    setList_lapmoi(filteredData_Lapmoi);  
  }
};

  
    return (
        <SafeAreaView style={{flex: 1}}>
          <CustomeHeader
            title= 'Trang chủ'
            isHome={true}
            navigation={props.navigation} 
          />          
          <List.Accordion
                    title="Ẩn/hiện bộ lọc dữ liệu"
                    style = {{backgroundColor : '#f0f8ff'}}
                    titleStyle = {{fontWeight : 'bold'}}
                    theme={{ colors: { primary: '#000000' }}}
                    expanded = {expanded}
                    onPress = {() => {
                        setExpanded(!expanded);                    
                    }}
          >             
            <View style = {styles.cardView}>
              <View style = {{width : '95%', marginLeft : 'auto', marginRight : 'auto'}}>
                <View 
                    style = {{
                      flexDirection : 'row', 
                      marginTop : 0, 
                      marginBottom : 5,
                      position : 'relative',
                      
                      }}>
                        <View style = {{flex : 2, flexDirection : 'row', margin : 2, marginTop : 10}}>                         
                          <View style = {{flex : 1.2}}>
                              <Text
                              style = {{fontSize : 16, fontStyle : 'italic'}}
                              >
                                Từ khoá
                              </Text>
                            </View>
                            <View style = {{flex : 2}}>
                              <TextInput
                                value ={searchKey}
                                style = {styles.textInput_datetime}
                                onChangeText = {(text) => {
                                  setSearchKey(text);
                                }}
                              />
                            </View>   
                            <View style = {{flex : 1.2}}>
                            </View>
                            <View style = {{flex : 2}}>
                            </View>  
                        </View>                  
                    
                </View>     
                <View style={{flexDirection : 'row'}}>
                          <TouchableOpacity 
                                  style = {styles.btnButton}
                                  onPress = {() => 
                                    {
                                      if(searchKey === '')
                                      {
                                        // alert('Nội dung tìm kiếm không được trống.');
                                        // return;
                                        if(active === 0)
                                        {
                                          alert('Chức năng tìm kiếm chỉ dùng cho Lắp mới');
                                        }
                                        else
                                        {
                                          _getListThiCongDuocPhanCong();
                                        }

                                        return;
                                      }
                                      //xem đang ở tab nào lọc theo tab đó
                                      if(active === 0)
                                      {
                                        alert('Chức năng tìm kiếm chỉ dùng cho Lắp mới');
                                        return;
                                      }
                                      else
                                      {
                                        searchItemInList(searchKey);
                                      }
                                      
                                    }
                                  }>
                                    <Text style = {styles.submitText}>Tìm kiếm</Text>
                            </TouchableOpacity>
                              
                      </View>   
              </View>
            </View>
            
          </List.Accordion>
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
                        <Text style = {{color : active === 0 ? '#fff' : '#4169e1', marginRight : 10}}>Sửa chữa</Text>
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
                    setCount_compare_thicong(0); //click vào tab set badge = 0
                  }} 
                  >
                    <View style = {{flexDirection : 'row'}}>
                      <Text style = {{color : active === 1 ? '#fff' : '#4169e1', marginRight : 10}}>Lắp mới</Text>
                      <Badge 
                        value={count_compare_thicong != 0 ? count_compare_thicong : ''} 
                        status="error" />
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
              <ScrollView>
                    <View style = {styles.wrapper}/> 
                    {
                      active === 0 
                      ?
                      /* thay dòng này để ko dùng flatlist để ko lỗi 
                      VirtualizedLists should never be nested inside plain ScrollViews */
                      <PaperProvider>
                        {
                          list_suachua.map((item, index) => (
                          <FlatListItemSuaChua refreshControl={
                            <RefreshControl
                              refreshing={refreshing}
                              onRefresh={onRefresh}
                            />
                          } item = {item} key = {index} props = {props}/>
                          )) 
                        }
                      </PaperProvider>
                     
                      :
                      /* thay dòng này để ko dùng flatlist để ko lỗi 
                      VirtualizedLists should never be nested inside plain ScrollViews */
                      <PaperProvider>
                        {
                          list_lapmoi.map((item, index) => (
                            <FlatListItemThiCong refreshControl={
                              <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                              />
                            } item = {item} key = {index} props = {props}/>
                          ))
                        }
                      </PaperProvider>                     
                    }               
                </ScrollView>
            </View>          
          </View>
         
        </SafeAreaView>
      );
}

function FlatListItemSuaChua ({item, props}){

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
      <View style={styles.cardView}>     
            <TouchableOpacity 
              onLongPress = {() => {
                goToNextScreen(item);
              }} >
              <View>
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Mã đơn:</Text>  
                      <View style = {{flex : 4, flexDirection : 'row'}}>
                        <Text 
                          style={{margin : 3,
                          fontWeight : 'bold',
                          fontStyle : 'italic',
                          flex : 1.5
                          }}>
                          {item.MADON}
                        </Text>
                        <View style={
                          {
                            flex : 2
                          }
                        }>
                          {
                            item.istt24h === 1
                            ?
                            <FontAwesome 
                              name = 'star'
                              color = {'#ff0000'}
                              size = {20}
                            />
                            : null
                          }                          
                        </View>
                      </View>
                      <View style = {{
                            alignItems : 'flex-end',
                            justifyContent : 'flex-start',
                            marginRight : 10,
                            flex : 1,}}
                      >
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
                                <Menu.Item title="Chỉ đường" 
                                  onPress={() => 
                                  {
                                    closeMenu();

                                    let X = parseFloat(item.X);
                                    let Y = parseFloat(item.Y);                                   
                                    let tenkh = item.TENKH;
                                    let diachi = item.DIACHI;

                                    if(X != '0' && Y != '0')
                                    {
                                        props.navigation.navigate('GoogleMapDirection', {X, Y, tenkh, diachi});                                      
                                    }
                                    else
                                    {
                                      alert('Không xác định được vị trí khách hàng.');
                                    }
                                    
                                  }} 
                                /> 
                          </Menu> 
                      </View>                      
                  </View>                                    
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Tên KH:</Text>  
                      <Text style={styles.itemFlatlist}>{item.TENKH} </Text>
                  </View>      
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>SĐT:</Text>  
                      <Text style={styles.itemFlatlist}>{item.SDT} </Text>
                  </View>                    
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Địa chỉ:</Text>  
                      <Text style={styles.itemFlatlist}>{item.DIACHI}</Text>
                  </View>
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Nội dung:</Text>  
                      <Text style={styles.itemFlatlist}>{item.NOIDUNG} </Text>
                  </View>   
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Thông tin:</Text>  
                      <Text style={styles.itemFlatlist}>{item.THONGTINKH} </Text>
                  </View>    
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Ngày báo:</Text>  
                      <Text style={styles.itemFlatlist}>{getVietNamDate(item.NGAYBAO)} </Text>
                  </View>                
              </View> 
            </TouchableOpacity>                               
      </View>  
  )
}

function FlatListItemThiCong({item, props}){

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
      <View style={styles.cardView}>     
            <TouchableOpacity 
              onLongPress = {() => {
                goToNextScreen_LapMoi(item);
              }} >
              
              <View>
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Mã đơn:</Text>  
                      <View style = {{flex : 4, flexDirection : 'row'}}>
                        <Text 
                          style={{margin : 3,
                          fontWeight : 'bold',
                          fontStyle : 'italic',
                          flex : 1.5
                          }}>
                          {item.MADDK}
                        </Text>
                        <View style={
                          {
                            flex : 2
                          }
                        }>
                          {
                            item.isuutien === 1
                            ?
                            <FontAwesome 
                              name = 'star'
                              color = {'#ff0000'}
                              size = {20}
                            />
                            : null
                          }                          
                        </View>
                      </View>
                      <View style = {{
                            alignItems : 'flex-end',
                            justifyContent : 'flex-start',
                            marginRight : 10,
                            flex : 1,}}
                      >
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
                                <Menu.Item title="Chỉ đường" 
                                  onPress={() => 
                                  {
                                    closeMenu();
                                    
                                    let X = item.X;
                                    let Y = item.Y;
                                    let tenkh = item.TENKH;
                                    let diachi = item.DIACHI;

                                    if(X != '0' && Y != '0')
                                    {
                                      props.navigation.navigate('GoogleMapDirection', {X, Y, tenkh, diachi});
                                    }
                                    else
                                    {
                                      alert('Không xác định được vị trí khách hàng.');
                                    }
                                  }} 
                                /> 
                          </Menu> 
                      </View> 
                  </View>                   
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Tên KH:</Text>  
                      <Text style={styles.itemFlatlist}>{item.TENKH} </Text>
                  </View> 
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>SĐT:</Text>  
                      <Text style={styles.itemFlatlist}>{item.SDT} </Text>
                  </View>                        
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Địa chỉ:</Text>  
                      <Text style={styles.itemFlatlist}>
                        {item.DIACHI}
                        </Text>                       
                  </View>
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Ghi chú:</Text>  
                      <Text style={styles.itemFlatlist}>
                        {item.GHICHU}
                      </Text>
                  </View>                   
              </View>  
            </TouchableOpacity> 
                              
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
  marginBottom : 8,
  flex : 1
}, 
titleFlatlist : {
  margin : 3,
  marginLeft : 10,
  fontStyle : 'italic',
  flex : 1,  
},
itemFlatlist : {
  margin : 3,
  fontWeight : 'bold',
  fontStyle : 'italic',
  flex : 4,
},
textInput_datetime : {
  fontSize : 18, 
  fontWeight : 'bold',
  backgroundColor : '#dcdcdc', 
  color : '#000000'
},
btnButton : {
  width : '40%',
  height : 45,
  borderColor : 'blue',
  borderRadius : 10,
  marginVertical : 5,
  borderWidth : 0,
  backgroundColor : '#4169e1',
},
submitText : {
  fontSize : 20,
  fontWeight : 'bold',
  color : 'white',
  alignSelf : 'center',
  marginVertical : 7
}
});