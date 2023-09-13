import React, { useContext, useState, useEffect, useRef} from 'react';
import {Text, View, SafeAreaView, TouchableOpacity, RefreshControl, ActivityIndicator
  , StyleSheet, Dimensions, FlatList, Modal, Vibration, TextInput} from 'react-native';
import {CustomeHeader} from '../../common/CustomeHeader';
import {GlobalContext} from '../../store/GlobalProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, Provider as PaperProvider, List } from 'react-native-paper';
import {ModalPicker_PhanCong_LapMoi} from '../../components/dungchung/ModalPicker_PhanCong_LapMoi';
import {ModalPicker_PhanCong_LapMoi_NhieuDon} from '../../components/dungchung/ModalPicker_PhanCong_LapMoi_NhieuDon';
import {getListThiCongChuaPhanCong, getListThiCongDaPhanCong} from '../../api/Api_KyThuat';
import { useIsFocused } from '@react-navigation/native';
import {getVietNamDate, isValidDate} from '../../common/CommonFunction';
import { Badge } from 'react-native-elements';
import {CheckBox} from 'react-native-elements';

const { width, height } = Dimensions.get('window');

export function PhanCongLapMoiScreen (props) {

  var isFocused = useIsFocused();
  const global = useContext(GlobalContext);
  
  let username = global.username;
  let password = global.password;
  let makv = global.makv;

  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [listChuaPhanCong, setListChuaPhanCong] = useState(global.list_thicong_chuaphancong_initial);
  const [listDaPhanCong, setListDaPhanCong] = useState([]);

  const[count_compare_lapmoi, setCount_compare_lapmoi] = useState(0);
  const lapmoi_ref = useRef(0); 

  const [isModalVisible_Main, setIsModalVisible_Main] = useState(false);

  const changeModalVisible_Main = (bool) => {
    setIsModalVisible_Main(bool);
  }

  const [checkList, setCheckList] = useState([]);
  
  const [refreshing, setRefreshing] = useState(true);    

  const onRefresh = () => {
    //Clear old data of the list
    setListChuaPhanCong([]);
    setListDaPhanCong([]);
   
    //Call the Service to get the latest data
    _getListThiCongChuaPhanCong();
    _getListThiCongDaPhanCong();
   
  };

  useEffect(() => {
    if(isFocused){
      _getListThiCongDaPhanCong();
      setCheckList([]); // set checkbox list = null
      console.log('isFocused phanconglapmoi equals true reload component to get newest list');
    }
    return () => {
      isFocused = false // add this
     }
  }, [isFocused]);

  const vibrate = () => {
    if (Platform.OS === "ios") {
      const interval = setInterval(() => Vibration.vibrate(), 1000);
      setTimeout(() => clearInterval(interval), 5000);
    } else { 
      Vibration.vibrate(5000);
    }
  };
  useEffect(() => {
    console.log("lapmoi_ref has changed");
    lapmoi_ref.current = listChuaPhanCong;
  }, [listChuaPhanCong]);

  useEffect(() => {
    _compareLapmoi();   

    return () => {
      lapmoi_ref.current = 0;
    };
  }, []);

  const _compareLapmoi = () => {
    let timer = setInterval(() => 
    {
      _getListThiCongChuaPhanCong();
    }, 180000);
    return () => clearInterval(timer);
  }
  removeItemOfListById = (value) => {
    const filteredData = listChuaPhanCong.filter(item => item.MADDK !== value.MADDK);
    setListChuaPhanCong(filteredData);

    setListDaPhanCong([...listDaPhanCong, {
      MADDK : value.MADDK,
      TENKH : value.TENKH,
      SDT : value.SDT,
      DIACHI : value.DIACHI,
      GHICHU : value.GHICHU,
      NGAYGTC : value.NGAYGTC,
    }]);
  }

  const removeListItem = () => {
    //remove item from danh sách chưa phân công
    console.log('checkList :' + checkList);
    var filteredData = listChuaPhanCong;

    for (const maddk of checkList)
    {
      filteredData = filteredData.filter(item => item.MADDK !== maddk);     
    }
    setListChuaPhanCong(filteredData);

    setCheckList([]); // set checkbox list = null
    //load lại danh sách đã phân công   
    _getListThiCongDaPhanCong();
  }

  getCheckboxList = (itemId, option) => {
    if(option == true)
    {
      setCheckList([...checkList, itemId]);
    }
    else
    {
      const filteredData = checkList.filter(item => item !== itemId);
      setCheckList(filteredData);
    }
  }

  const _getListThiCongChuaPhanCong = async () => {
    getListThiCongChuaPhanCong(global.url, username, password).then(obj => {
          if(obj.ResultCode === true)
          {    
            setRefreshing(false);
            let arr_temp = obj.Data;
            if(arr_temp.length > lapmoi_ref.current.length)
            {
              let count_number = arr_temp.length - lapmoi_ref.current.length;
              setCount_compare_lapmoi(count_number);
              setListChuaPhanCong(arr_temp);
              vibrate();             
            }   
          }      
        })
        .catch(error => {
            alert('lỗi : ' + error);
        });
  }

  const _getListThiCongDaPhanCong = async () => {
    getListThiCongDaPhanCong(global.url, username, password).then(obj => {
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
  const searchItemInList = (value, fromDate, toDate, option) => {
    if(option === 0 )
    {
      if(value != '')
      {
        //search theo key
        const filteredData_ChuaPhanCong = listChuaPhanCong.filter(
          item => 
          item.MADDK.toUpperCase().includes(value.toUpperCase())
          || item.TENKH.toUpperCase().includes(value.toUpperCase()) 
          || item.DIACHI.toUpperCase().includes(value.toUpperCase())
          || item.SDT.toUpperCase().includes(value.toUpperCase())
          );
        
        setListChuaPhanCong(filteredData_ChuaPhanCong); 
      }
      else
      {
        //search từ ngày đến ngày theo ngày thi công, do đang ở tab chưa phân công thì ngày giao thi công chưa có
        alert('Chức năng tìm kiếm từ ngày đến ngày chỉ dùng cho tab Đã phân công.');
        return;
      }
    }
    else
    {
      if(value != '')
      {
        //search theo key
        const filteredData_DaPhanCong = listDaPhanCong.filter(
          item => 
          item.MADDK.toUpperCase().includes(value.toUpperCase())
          || item.TENKH.toUpperCase().includes(value.toUpperCase()) 
          || item.DIACHI.toUpperCase().includes(value.toUpperCase())
          || item.SDT.toUpperCase().includes(value.toUpperCase())
          );
        
        setListDaPhanCong(filteredData_DaPhanCong);  
      }
      else
      {
        //search từ ngày đến ngày
        var from = new Date(convert_VNDate_To_NationalDate(fromDate));
        var to = new Date(convert_VNDate_To_NationalDate(toDate));

        const filteredData_DaPhanCong = listDaPhanCong.filter(
          item =>  {
            if(item.NGAYGTC != '' && item.NGAYGTC != null)
            {
              let ngaygtc = new Date(item.NGAYGTC);
              return ngaygtc >= from && ngaygtc <= to
            }      
          });
        
        setListDaPhanCong(filteredData_DaPhanCong);  
      }
    }
};
    return (
        <SafeAreaView style={{flex: 1}}>
          <CustomeHeader
            title= 'Phân công lắp mới'
            isHome={false}
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
                <View  
                      style = {{
                      flexDirection : 'row', 
                      marginBottom : 5
                      }}>
                        <View style = {{flex : 1, flexDirection : 'row', margin : 2}}>
                          <View style = {{flex : 1.2}}>
                            <Text
                            style = {{fontSize : 16 , fontStyle : 'italic'}}
                            >
                              Từ ngày
                            </Text>
                          </View>
                          <View style = {{flex : 2}}>
                            <TextInput
                              value ={fromDate}
                              style = {styles.textInput_datetime}
                              onChangeText = {(text) => {
                                setFromDate(text);
                              }}
                            />
                          </View>
                        </View>
                        <View style = {{flex : 1, flexDirection : 'row', margin : 2}}>
                          <View style = {{flex : 1.2}}>
                            <Text
                              style = {{fontSize : 16 , fontStyle : 'italic'}}
                            >Đến ngày</Text>
                          </View>
                          <View style = {{flex : 2}}>
                            <TextInput
                              style = {styles.textInput_datetime}
                              value ={toDate}
                              onChangeText = {(text) => {
                                setToDate(text);
                              }}
                            />
                          </View>
                        </View>
                        
                </View>   
                <View style={{flexDirection : 'row'}}>
                          <TouchableOpacity 
                                  style = {styles.btnButton}
                                  onPress = {() => 
                                    {
                                      if(searchKey === '' && (fromDate === '' || toDate === ''))
                                      {
                                        // alert('Nội dung tìm kiếm không được trống.');
                                        // return;
                                        if(active === 0)
                                        {
                                          _getListThiCongChuaPhanCong(); // lấy lại danh sách chưa phân công
                                        }
                                        else
                                        {
                                          _getListThiCongDaPhanCong();
                                        }

                                        return;
                                      }

                                      if(fromDate != '' || toDate != '')
                                      {
                                        if(!isValidDate(fromDate) || !isValidDate(toDate))
                                        {
                                          alert('Định dạng ngày không đúng (ngày/tháng/năm).');
                                          return;
                                        }
                                      }                                     

                                      //xem đang ở tab nào lọc theo tab đó
                                      if(active === 0)
                                      {
                                        //lọc theo từ khoá
                                        if(searchKey != '')
                                        {
                                          searchItemInList(searchKey, '', '', 0);
                                        }
                                        else
                                        {
                                          //lọc từ ngày đến ngày
                                          searchItemInList('', fromDate, toDate, 0);                      
                                        }
                                      }
                                      else
                                      {
                                        if(searchKey != '')
                                        {
                                          searchItemInList(searchKey, '', '', 1);
                                        }
                                        else
                                        {
                                          searchItemInList('', fromDate, toDate, 1);
                                        }
                                      }
                                      
                                    }
                                  }>
                                    <Text style = {styles.submitText}>LỌC</Text>
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
                    setCount_compare_lapmoi(0); //click vào tab set badge = 0
                  }} 
                    >
                       <View style = {{flexDirection : 'row'}}>
                          <Text style = {{color : active === 0 ? '#fff' : '#4169e1', marginRight : 5}}>Chưa phân công</Text>
                          <Badge 
                          value={count_compare_lapmoi != 0 ? count_compare_lapmoi : ''} 
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
            {
              active === 0 && checkList.length > 0
              ?
              <View style = {{flex : 1}}>
                <TouchableOpacity 
                          style = {[styles.btnButton, {marginLeft : 5}]}
                          onPress = {() => {
                              //console.log('array : ' + checkList);
                              changeModalVisible_Main(true);
                          }}>
                            <Text style = {styles.submitText}>Phân công</Text>
                </TouchableOpacity>
              </View> 
              :
              null   
            }
                 
            <View style = {{flex : 10}}>
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
                              keyExtractor = {item => item.MADDK.toString()}>
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
                            keyExtractor = {item => item.MADDK.toString()}>
                        </FlatList> 
                      </PaperProvider>
                    }               
                </View>
            </View>                      
          </View>
          <Modal            
                      transparent = {true}
                      animationType = 'fade'
                      visible = {isModalVisible_Main}
                      onRequestClose = {() => changeModalVisible_Main(false)}
                  >
                      <ModalPicker_PhanCong_LapMoi_NhieuDon
                        changeModalVisible = {changeModalVisible_Main}
                        madon = {checkList}
                        removeListItem = {removeListItem}
                      />
                  </Modal>                          
        </SafeAreaView>
        
      );
}

function FlatListItemSuaChua({item, active}){

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const [remember, setRemember] = useState(false);

  const toggleRememberMe = value => {
      setRemember(value);
      //console.log('ma don: ' + item.MADDK  + 'value : ' + value);
      getCheckboxList(item.MADDK, value);
  }; 
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
                <>
                  {
                    active == 0 ?
                    <View style = {styles.viewContainerFlatlist}>
                      <CheckBox
                                style={{flex: 1}}
                                onPress={()=>{
                                    toggleRememberMe(!remember);
                                }}
                                checked={remember}
                            /> 
                    </View>
                    :
                    null
                  }
                </>             
                 <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Mã đơn:</Text>  
                      <Text style={styles.itemFlatlist}>{item.MADDK}</Text> 
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
                      <Text style={styles.titleFlatlist}>Ghi chú:</Text>  
                        <Text style={styles.itemFlatlist}>{item.GHICHU}</Text>
                      <View  style = {styles.iconFlatlist}>  
                      </View>
                  </View>    
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.titleFlatlist}>Ngày giao:</Text>  
                        <Text style={styles.itemFlatlist}>{getVietNamDate(item.NGAYGTC)}</Text>
                      <View  style = {styles.iconFlatlist}>  
                      </View>
                  </View>    
                  <Modal            
                      transparent = {true}
                      animationType = 'fade'
                      visible = {isModalVisible}
                      onRequestClose = {() => changeModalVisible(false)}
                  >
                      <ModalPicker_PhanCong_LapMoi
                        changeModalVisible = {changeModalVisible}
                        madon = {item.MADDK}
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
  backgroundColor : 'rgba(78, 116, 289, 1)',
},
submitText : {
  fontSize : 20,
  fontWeight : 'bold',
  color : 'white',
  alignSelf : 'center',
  marginVertical : 7
}
});