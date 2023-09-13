import React, {useState, useContext, useEffect, useRef} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Dimensions, 
    FlatList, TextInput, KeyboardAvoidingView, ScrollView, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {GlobalContext} from '../../store/GlobalProvider';
import {chiTietTheoDoiTienDoSuaChua, chiTietTheoDoiTienDoThiCong} from '../../api/Api_KyThuat';
import {getVietNamDate} from '../../common/CommonFunction';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export function ModalPicker_TienDoCongViec(props)
{
    const global = useContext(GlobalContext);

    let url = global.url;
    let username = global.username;
    let password = global.password;

    var manv = props.manv;
    var fromdate = props.fromdate;
    var todate = props.todate;
    var option = props.option;

    const [chitiet_list, setChitiet_List] = useState([]);

    const onPressItemOption = () =>{
        props.changeModalVisible(false);
    }

    useEffect(() => {
      runGetList(manv, fromdate, todate, option).then(() => {
      });  
    }, []);

    async function runGetList(manv, fromdate, todate, option){
      const list =  _chiTietTheoDoiTienDo(manv, fromdate, todate, option); 
      const results = await Promise.all([list]);
      return results;
  }

    const _chiTietTheoDoiTienDo= async (manv, fromdate, todate, option) => { 
      var dateParts_from = fromdate.split("/");
      var dateObject_From = new Date(dateParts_from[2], dateParts_from[1] - 1, dateParts_from[0]); 

      var dateParts_to= todate.split("/");
      var dateObject_to = new Date(dateParts_to[2], dateParts_to[1] - 1, dateParts_to[0]); 
  
      if(option === 'suachua')
      {
         return chiTietTheoDoiTienDoSuaChua(url, username, password, dateObject_From, dateObject_to, manv) 
        .then(obj => {
          //  console.log(obj);
            if(obj.ResultCode === true){    
              setChitiet_List(obj.Data);                
            }     
          })
          .catch(error => {
              setIsloading(true); 
              alert('lỗi : ' + error);
          });
      }
      else
      {
        return chiTietTheoDoiTienDoThiCong(url, username, password, dateObject_From, dateObject_to, manv) 
        .then(obj => {
            if(obj.ResultCode === true){    
              setChitiet_List(obj.Data);     
            }     
          })
          .catch(error => {
              setIsloading(true); 
              alert('lỗi : ' + error);
          });
      }
    }

    return(
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : null}
            style = {styles.container} 
        >           
                <View style = {[styles.modal, {width : WIDTH - 20, height : HEIGHT/1.5}]}>                    
                    <View style = {{flex : 1}}>                                                    
                          <View style = {styles.rows}>
                            <View style = {{flex : 1}}>
                                <TouchableOpacity 
                                        style={styles.iconClose}
                                        onPress = {() => {
                                            onPressItemOption();
                                        }}
                                    >
                                        <FontAwesome 
                                            name = 'times-circle'
                                            color = '#ff0000'
                                            size = {35}
                                        />
                                </TouchableOpacity>   
                            </View>
                        </View>                                                      
                    </View>   
                    <View style = {{flex : 5}}>                                                        
                          <View style = {styles.rowsTitle}>
                            <Text style = {{
                                fontSize : 15, fontWeight : 'bold',  alignItems :'center', 
                                justifyContent : 'center',}}>TIẾN ĐỘ CÔNG VIỆC</Text>                       
                          </View>   
                          <ScrollView>
                            {/* thay dòng này để ko dùng flatlist để ko lỗi 
                            VirtualizedLists should never be nested inside plain ScrollViews */}
                            {chitiet_list.map((item, index) => (
                                <FlatList_Details item = {item} key = {index} type = {option}/>
                            ))}
                          </ScrollView>                          
                    </View>                                               
                </View>                                        
        </KeyboardAvoidingView>       
    );
}

function FlatList_Details({item, type}){
    return (
      <View style={[styles.cardView, 
        {
          backgroundColor : 
            type === 'suachua'
            ?
            item.TTDON === 'SC_N' ? '#dcdcdc' : (item.TTDON === 'SC_T' ? '#ffd700' : '#9acd32')
            :
            item.TTDON === 'TC_P' ? '#dcdcdc' : (item.TTDON === 'TC_T' ? '#ffd700' : '#9acd32')
          
          }         
      ]}>                
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Mã đơn:</Text>  
            <Text style={styles.itemFlatlist}>{item.MADON}</Text>                                                                                                            
        </View>                   
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Tên KH:</Text>  
            <Text style={styles.itemFlatlist}>{item.TENKH} </Text>
        </View>       
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Nội dung:</Text>  
            <Text style={styles.itemFlatlist}>{item.TENXL} </Text>
        </View>                
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Địa chỉ:</Text>  
            <Text style={styles.itemFlatlist}>{item.THONGTINKH} </Text>
        </View>   
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Ngày giao:</Text>  
            <Text style={styles.itemFlatlist}>{getVietNamDate(item.NGAYGQ)} </Text>
        </View>                       
    </View>  
    )
  }

const styles = StyleSheet.create({
    container : {
        flex : 1, 
        alignItems : 'center',
        justifyContent : 'center',    
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal : {
        backgroundColor : 'white',
        borderRadius : 10,
        borderColor: '#000000',
        borderWidth: 1,
    },
    option : {
        flexDirection : 'row',
    },
    text : {
        margin : 15,
        fontSize : 20,
        fontWeight : 'bold',
    },
    wrapper: {
        borderBottomColor: '#dcdcdc',
        borderBottomWidth: 1,
    },
    iconClose : {
        alignItems : 'flex-end',
        flex : 1,
    },
    rowContainer : {
        flex : 1, 
        alignItems: 'flex-start',
      },
    title : {
        flex : 2, 
        fontSize : 15
      },
      item : {
        flex : 7, 
        backgroundColor : '#fffaf0', 
        marginRight : 5
      },
      rows : {
        flexDirection : 'row', 
        height : 50, 
        alignItems :'center', 
        justifyContent : 'center',
        marginLeft : 5,
        marginRight : 5,
      },
      rowsTitle : {
        height : 40, 
        alignItems :'center', 
        justifyContent : 'center',
        // margin : 10,
        backgroundColor : '#f5f5dc'
      },
      cardView : {
        backgroundColor: 'white',
        margin: WIDTH * 0.01,
        borderRadius: WIDTH * 0.02,
        shadowColor: '#000',
        shadowOffset: { WIDTH:0.5, HEIGHT: 0.5 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        borderWidth : 0.5,
      },
      viewContainerFlatlist : {
        flexDirection : 'row',
        // marginBottom : 5,
        flex : 1
      }, 
      titleFlatlist : {
        margin : 3,
        marginLeft : 5,
        //fontWeight : 'bold',
        fontStyle : 'italic',
        flex : 2,
      },
      itemFlatlist : {
        margin : 3,
        fontWeight : 'bold',
        //fontStyle : 'italic',
        flex : 6
      },
      iconFlatlist : {
        alignItems : 'flex-end',
        justifyContent : 'flex-start',
        marginRight : 10,
        flex : 1,
      },
});