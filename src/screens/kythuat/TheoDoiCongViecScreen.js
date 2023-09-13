import React, {useState, useContext, ReactChild } from 'react';
import {Button, View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Modal} from 'react-native';
import {CustomeHeader} from '../../common/CustomeHeader';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
//import DatePicker from 'react-native-datepicker';
import { CheckBox, Input } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {theoDoiTienDoSuaChua, theoDoiTienDoThiCong} from '../../api/Api_KyThuat';
import {GlobalContext} from '../../store/GlobalProvider';
import {ModalPicker_TienDoCongViec} from '../../components/dungchung/ModalPicker_TienDoCongViec';
import { TextInput } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export function TheoDoiCongViecScreen({navigation}){
  
  const global = useContext(GlobalContext);

  let url = global.url;
  let username = global.username;
  let password = global.password;    

  //from date
  const [tungay, setFromDate] = useState();  
  const [isfDatePickerVisible, setfDatePickerVisibility] = useState(false);
  const showFromDatePicker = () => {
    setfDatePickerVisibility(true);
  };
  const hideFromDatePicker = () => {
    setfDatePickerVisibility(false);
  };
  const handleConfirmFromDate = (fdate) => {
    setFromDate(fdate);
    hideFromDatePicker();
  };
  
  //to date
  const [denngay, setToDate] = useState();
  const [istDatePickerVisible, settDatePickerVisibility] = useState(false);
  const showToDatePicker = () => {
    settDatePickerVisibility(true);
  };
  const hideToDatePicker = () => {
    settDatePickerVisibility(false);
  };
  const handleConfirmToDate = (tdate) => {
    setToDate(tdate);
    hideToDatePicker();
  };

  let fromdate = tungay ? moment(tungay).format("DD/MM/YYYY") : moment(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-01').format("DD/MM/YYYY");
  let todate = denngay ? moment(denngay).format("DD/MM/YYYY") : moment(new Date()).format("DD/MM/YYYY");

  const [checkbox, setCheckbox] = useState(false);

  const [list_nvxl, setList_nvxl] = useState([]);
  const [list_nvxl_thicong, setList_nvxl_thicong] = useState([]);

  toggleCheckBox = value => {
    setCheckbox(value);
  };

  const _theoDoiTienDoSuaChua= async () => { 
    var dateParts_from = fromdate.split("/");
    var dateObject_From = new Date(dateParts_from[2], dateParts_from[1] - 1, dateParts_from[0]); 

    var dateParts_to= todate.split("/");
    var dateObject_to = new Date(dateParts_to[2], dateParts_to[1] - 1, dateParts_to[0]); 

    theoDoiTienDoSuaChua(url, username, password, dateObject_From, dateObject_to) 
      .then(obj => {
          if(obj.ResultCode === true){    
            setList_nvxl(obj.Data);     
          }     
        })
        .catch(error => {
            setIsloading(true); 
            alert('lỗi : ' + error);
        });
  }
  
  const _theoDoiTienDoThiCong= async () => { 
    var dateParts_from = fromdate.split("/");
    var dateObject_From = new Date(dateParts_from[2], dateParts_from[1] - 1, dateParts_from[0]); 

    var dateParts_to= todate.split("/");
    var dateObject_to = new Date(dateParts_to[2], dateParts_to[1] - 1, dateParts_to[0]); 

    theoDoiTienDoThiCong(url, username, password, dateObject_From, dateObject_to) 
      .then(obj => {
          if(obj.ResultCode === true){    
            setList_nvxl_thicong(obj.Data);     
          }     
        })
        .catch(error => {
            setIsloading(true); 
            alert('lỗi : ' + error);
        });
  }
  
    return(
        <SafeAreaView 
          style={{flex: 1}}
          >
          <CustomeHeader
            title = 'Theo dõi tiến độ công việc'
            isHome={false}
            navigation={navigation} 
          />    
          <View style = {{flex : 1}}>
            <View style = {styles.wrapper}/>                                   
            <View style = {styles.rowContainer}>                                                     
                  <View style = {styles.rows}>
                    <Text style = {styles.title}>Từ</Text>
                    <View style = {styles.item}>
                      <View style = {styles.textInput}>                       
                          <Text style={styles.datetextinput}>{fromdate}</Text>
                          <MaterialCommunityIcons 
                                  style={styles.dateicons} 
                                    name = 'calendar-today'
                                    size = {30} 
                                    color = {'red'}
                                    onPress={showFromDatePicker}
                                    />
                          <DateTimePickerModal
                            isVisible={isfDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirmFromDate}
                            onCancel={hideFromDatePicker}
                          />                          
                      </View>
                    </View>
                    <Text style = {styles.title}>Đến</Text>
                    <View style = {styles.item}>
                      <View style ={styles.textInput}>  
                          <Text style={styles.datetextinput}>{todate}</Text>
                          <MaterialCommunityIcons style={styles.dateicons}
                                    name = 'calendar-today'
                                    size = {30} 
                                    color = {'red'}
                                    onPress={showToDatePicker}
                                    />
                          <DateTimePickerModal
                            isVisible={istDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirmToDate}
                            onCancel={hideToDatePicker}
                          /> 
                      </View>
                    </View>
                  </View>     
                  <View style = {
                    {
                      flexDirection : 'row', 
                      height : 60, 
                      alignItems :'center', 
                      justifyContent : 'center',
                      marginLeft : 5,
                      marginRight : 5,
                    }
                  }>
                    <CheckBox
                        style={{flex: 1}}
                        title='Theo dõi thi công'
                        onPress={()=>{
                          toggleCheckBox(!checkbox);
                        }}
                        checked={checkbox}
                    />
                    <View style = {{flex : 1}}>
                      <TouchableOpacity 
                          style = {styles.btnButton}
                          onPress = {() => 
                            {
                                if(checkbox)
                                {
                                  _theoDoiTienDoThiCong();
                                }
                                else
                                {
                                  _theoDoiTienDoSuaChua();
                                }
                            }
                          }>
                            <Text style = {styles.submitText}>Xem</Text>
                        </TouchableOpacity>
                    </View>
                  </View>  
                  <View style = {{flexDirection : 'row', 
                    height : 50, 
                    alignItems :'center', 
                    justifyContent : 'center',
                    marginLeft : 5,
                    marginRight : 5,}}
                  >
                    <View style = {{flex : 3, flexDirection : 'row', marginRight : 5}}>
                      <View style = {[styles.congviec, {backgroundColor : '#a9a9a9'}]}>
                      </View>
                      <View>
                          <Text>Phân công</Text>
                      </View>
                    </View>
                    <View style = {{flex : 2, flexDirection : 'row', marginRight : 5}}>
                      <View style = {[styles.congviec, {backgroundColor : '#ffd700'}]}>
                      </View>
                      <View >
                          <Text>Đã làm</Text>
                      </View>
                    </View>
                    <View style = {{flex : 3, flexDirection : 'row', marginRight : 5}}>
                      <View style = {[styles.congviec, {backgroundColor : '#008000'}]}>
                      </View>
                      <View>
                          <Text>Đã duyệt</Text>
                      </View>
                    </View>                    
                  </View> 
                  <View style = {{flex : 1}}>
                    <ScrollView>
                      <View style = {styles.wrapper}/>
                      <View style = {{
                        flex : 1, 
                        backgroundColor : 'white',
                        alignItems : 'center', 
                        justifyContent : 'center',
                        height : 30
                        }}>
                        <Text style = {styles.titleVT}>THEO DÕI TIẾN ĐỘ CÔNG VIỆC</Text> 
                      </View>  
                      <View style = {styles.wrapper}/> 
                      <View style = {{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                        <View style = {styles.viewContainerFlatlist}>
                              <Text style={styles.tennhanvien}>Tên nhân viên</Text>  
                              <View style={[styles.congviec, {backgroundColor : '#a9a9a9'}]}/>
                              <View style={[styles.congviec, {backgroundColor : '#ffd700'}]}/>
                              <View style={[styles.congviec, {backgroundColor : '#008000'}]}/>
                              <Text style={styles.deleteBtn}></Text>
                          </View>
                      </View>
                      <View style = {styles.wrapper}/>     

                      <View style = {{backgroundColor : 'white'}}>
                        {/* thay dòng này để ko dùng flatlist để ko lỗi 
                        VirtualizedLists should never be nested inside plain ScrollViews */}
                        {
                          checkbox === false
                          ?
                          <>
                            {list_nvxl.map((item, index) => (
                              <FlatListItem item = {item} key = {index} fromdate = {fromdate} todate = {todate} option = 'suachua'/>
                              ))
                            }
                          </>
                          :
                          <>
                            {list_nvxl_thicong.map((item, index) => (
                              <FlatListItem item = {item} key = {index} fromdate = {fromdate} todate = {todate} option = 'thicong'/>
                              ))
                            }
                          </>
                        }                                      
                      </View>   
                    </ScrollView> 
                  </View>                                       
            </View>   
             
          </View>
        </SafeAreaView>        
    )
};

function FlatListItem({item, fromdate, todate, option}){

  const [isModalVisible, setIsModalVisible] = useState(false);

  const changeModalVisible = (bool) => {
        setIsModalVisible(bool);
    }
  return (
      <View style={styles.cardView}>     
            <View style = {styles.wrapper}/> 
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.tennhanvien}>{item.HOTEN}</Text>  
                      <Text style={styles.congviec}>{item.DAPHANCONG}</Text>
                      <Text style={styles.congviec}>{item.DALAM}</Text>
                      <Text style={styles.congviec}>{item.DAHOANTHANH}</Text>
                      <TouchableOpacity 
                        style={styles.deleteBtn}
                        onPress = {() => {
                          changeModalVisible(true);                         
                        }}
                      >
                        <FontAwesome 
                          name = 'arrow-circle-right'
                          color = '#6495ed'
                          size = {20}
                        />
                      </TouchableOpacity>
                  </View>    
            <View style = {styles.wrapper}/>  
            <Modal            
                      transparent = {true}
                      animationType = 'fade'
                      visible = {isModalVisible}
                      onRequestClose = {() => changeModalVisible(false)}
                  >
                      <ModalPicker_TienDoCongViec
                         changeModalVisible = {changeModalVisible}
                         manv = {item.MSNV}
                         fromdate = {fromdate}
                         todate = {todate}
                         option = {option}
                      />
                  </Modal>                       
      </View>  
  )
}


const styles = StyleSheet.create(
{
wrapper: {
    borderBottomColor: '#dcdcdc',
    borderBottomWidth: 1,
},
rowContainer : {
  flex : 1, 
  // alignItems: 'flex-start',
},
title : {
  flex : 1.5, 
  fontSize : 15,
},
item : {
  flex : 7, 
  marginRight : 5
},
textInput : {
  fontSize : 20, 
  fontWeight : 'bold',
  //backgroundColor : '#fffaf0', 
  color : '#000000'
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
  width : '80%',
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
titleVT : {
  fontSize : 15,
  fontWeight : 'bold',
  fontStyle : 'italic',
},
viewContainerFlatlist : {
  flex : 1,
  flexDirection : 'row',
  marginBottom : 8,
  justifyContent : 'center',
  alignItems : 'center'
},
tennhanvien : {
  flex : 5,
  margin : 3,
  marginLeft : 10,
  fontWeight : 'bold', 
},
congviec : {
  flex : 1,
  height : 20,
  width : 10,
  marginRight : 5
},
deleteBtn : {
  flex : 1,
  margin : 3,
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
  width: 120, 
  marginTop: 5, 
  padding: 5, 
  borderColor: 'black', 
  borderWidth: 1
 },

 dateicons: {
  marginLeft: 87, 
  marginTop: -31
 },

});