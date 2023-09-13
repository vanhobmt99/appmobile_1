import React, {useState, useContext, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Dimensions, 
    FlatList, TextInput, KeyboardAvoidingView, ScrollView, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, Searchbar} from 'react-native-paper';
import {getListNhanVien} from '../../api/Api_DungChung';
import {GlobalContext} from '../../store/GlobalProvider';
import {insertPhanCongThiCong, deletePhanCongThiCong, 
  getListDanhSachPhanCongThiCong} from '../../api/Api_KyThuat';
import { useIsFocused } from '@react-navigation/native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export function ModalPicker_PhanCong_LapMoi(props)
{
    var isFocused = useIsFocused();
    const global = useContext(GlobalContext);

    let username = global.username;
    let password = global.password;
    let url = global.url;
    let type = 'lapmoi';

    var madon = props.madon;

    const [manv, setManv] = useState('');
    const [tennv, setTennv] = useState('');
    const [searchKey, setSearchKey] = useState('');

    const [listtimkiem, setListtimkiem] = useState([]);

    const [listnvxl, setListnvxl] = useState([]);

    const onPressItemOption = () =>{
        props.changeModalVisible(false);
    }

    const onPressCloseButton = () => {
      props.removeItemFromList();
    }

    useEffect(() => {
      _getListNhanVien();
    }, []);

    useEffect(() => {
      if(isFocused){
        _getListDanhSachPhanCongThiCong();
      }  
      return () => {
        isFocused = false // add this
       }
    }, [isFocused]);

    onPressSelectItem = (manv, tennv) => {
        setManv(manv);
        setTennv(tennv);
    };

    const _getListNhanVien = async () => {
      getListNhanVien(url, username, password, searchKey, type).then(obj => {
            if(obj.ResultCode === true){    
              setListtimkiem(obj.Data);        
            }      
            else{    
              alert('Không tìm thấy dữ liệu');    
            }
          })
          .catch(error => {
              alert('lỗi : ' + error);
          });
    }
    const _getListDanhSachPhanCongThiCong = async () => {
      getListDanhSachPhanCongThiCong(url, username, password, madon).then(obj => {
            if(obj.ResultCode === true){    
              setListnvxl(obj.Data);     
            }      
          })
          .catch(error => {
              alert('lỗi : ' + error);
          });
    }
    _deleteItemById = async (manvxl) => {
      deletePhanCongThiCong(url, username, password, madon).then(obj => {
        console.log(obj);
            if(obj.ResultCode === true){    
              const filteredData = listnvxl.filter(item => item.MANV !== manvxl);
              setListnvxl(filteredData);   
            }      
            else{    
              alert(obj.Data);    
            }
          })
          .catch(error => {
              alert('lỗi : ' + error);
          });
    }

    const _insertPhanCongLapMoi= async () => {
      insertPhanCongThiCong(url, username, password, madon, manv).then(obj => {
            if(obj.ResultCode === true){    
              setListnvxl([...listnvxl, {
                MANV : manv,
                HOTEN : tennv
              }]);

              setManv(''); // set manv thành empty
            }      
            else{    
              alert(obj.Data);    
            }
          })
          .catch(error => {
              alert('lỗi : ' + error);
          });
    }

    return(
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : null}
            style = {styles.container} 
        >           
                <View style = {[styles.modal, {width : WIDTH - 20, height : HEIGHT/1.5}]}>                    
                    <View style = {{flex : 1}}>                                                    
                          <View style = {styles.rows}>
                            <Text style = {styles.title}></Text>
                            <View style = {styles.item}>
                              
                            </View>
                            <View style = {{flex : 1}}>
                                <TouchableOpacity 
                                        style={styles.iconClose}
                                        onPress = {() => {
                                            onPressItemOption();

                                            if(listnvxl.length > 0)
                                            {
                                              onPressCloseButton();
                                            }
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
                          <View style = {styles.rows}>
                            <View style = {{backgroundColor : '#fffaf0', flex : 5,
                                    marginRight : 5, 
                                    fontSize : 15}}>
                                <Searchbar
                                    placeholder="Search"                            
                                    onChangeText = {(text) => {
                                        setSearchKey(text);
                                    }}
                                    onIconPress = {() => {

                                      if(searchKey === '')
                                      {
                                        alert('Nội dung tìm kiếm không được trống.');
                                        return;
                                      }

                                      _getListNhanVien();
                                    }}
                                />     
                                </View>
                          </View>      
                          <View style = {styles.rowsTitle}>
                            <Text style = {{
                                fontSize : 15, fontWeight : 'bold',  alignItems :'center', 
                                justifyContent : 'center',}}>DANH SÁCH NHÂN VIÊN</Text>                       
                          </View>   
                          <ScrollView>
                            {/* thay dòng này để ko dùng flatlist để ko lỗi 
                            VirtualizedLists should never be nested inside plain ScrollViews */}
                            {listtimkiem.map((item, index) => (
                                <FlatList_NhanVien item = {item} key = {index}/>
                            ))}
                          </ScrollView>                          
                    </View>          
                    <View style = {{flex : 5}}>                                                    
                          <View style = {styles.rows}>
                            <Text style = {{flex : 2, 
                                fontSize : 15, fontWeight : 'bold'}}>Nhân viên:</Text>
                            <View style = {{backgroundColor : '#fffaf0', flex : 3,
                                // marginRight : 5, 
                                fontSize : 15, height : 40
                                , alignContent : 'center', justifyContent : 'center'}}>
                              <TextInput
                                // placeholder="Search"  
                                style = {{color : '#000000'}}
                                value = {manv}                          
                                onChangeText = {(text) => {
                                    setManv(text);
                                }}
                            />     
                            </View>
                            
                            <View style = {{flex : 2}}>
                                <Button 
                                    color = '#4169e1' 
                                    mode="contained" 
                                    onPress={() => 
                                        {                                        
                                          _insertPhanCongLapMoi();
                                        }
                                    }
                                >
                                    Thêm
                                </Button>
                            </View>
                          </View>      
                          <View style = {styles.rowsTitle}>
                            <Text style = {{
                                fontSize : 15, fontWeight : 'bold',  alignItems :'center', 
                                justifyContent : 'center',}}>DANH SÁCH NHÂN VIÊN ĐƯỢC PHÂN CÔNG</Text>                       
                          </View>   
                          <ScrollView>                            
                            {listnvxl.map((item, index) => (
                                <FlatList_NVXL item = {item} key = {index}/>
                            ))}
                          </ScrollView>                          
                    </View>                     
                </View>                                        
        </KeyboardAvoidingView>       
    );
}

function FlatList_NhanVien({item}){
    return (
      <View style={styles.cardView}>                
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Mã NV:</Text>  
            <Text style={styles.itemFlatlist}>{item.MANV}</Text> 
            <View  style={styles.iconFlatlist}>
                <TouchableOpacity 
                      onPress = {() => {
                        onPressSelectItem(item.MANV, item.HOTEN);
                      }} 
                    >
                      <FontAwesome 
                        name = 'plus-circle'
                        color = {'#008000'}
                        size = {30}
                        />
                    </TouchableOpacity> 
            </View> 
                                                                                                              
        </View>                   
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Tên NV:</Text>  
            <Text style={styles.itemFlatlist}>{item.HOTEN} </Text>
            <View  style = {styles.iconFlatlist}>                                         
            </View>  
        </View>                      
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Khu vực:</Text>  
            <Text style={styles.itemFlatlist}>{item.TENKV} </Text>
            <View  style = {styles.iconFlatlist}>                                         
            </View>  
        </View>                         
    </View>  
    )
  }

function FlatList_NVXL({item}){

  const buttonDeleteAlert = () =>
    Alert.alert(
      "Thông báo",
      "Bạn có muốn xoá phân công " + `${item.HOTEN}`  + " không?",
      [
        {
          text: "Không",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Có", 
          onPress: () => {
            _deleteItemById(item.MANV);       
          }
        }
      ],
      { cancelable: false }
    );

    return (
      <View style={styles.cardView}>                
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Mã NV:</Text>  
            <Text style={styles.itemFlatlist}>{item.MANV}</Text> 
            <View  style={styles.iconFlatlist}>
                <TouchableOpacity 
                      onPress = {() => {
                        buttonDeleteAlert();
                      }} 
                    >
                      <FontAwesome 
                        name = 'minus-circle'
                        color = {'#ff0000'}
                        size = {30}
                        />
                    </TouchableOpacity> 
            </View> 
                                                                                                              
        </View>                   
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Tên NV:</Text>  
            <Text style={styles.itemFlatlist}>{item.HOTEN} </Text>
            <View  style = {styles.iconFlatlist}>                                         
            </View>  
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