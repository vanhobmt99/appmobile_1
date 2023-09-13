import React, {useState, useContext, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Dimensions, 
    FlatList, TextInput, KeyboardAvoidingView, ScrollView} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, Searchbar} from 'react-native-paper';
import {getListNhanVien} from '../../api/Api_DungChung';
import {GlobalContext} from '../../store/GlobalProvider';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export function ModalPicker_NhanVien(props)
{
    const global = useContext(GlobalContext);

    let url = global.url;
    let username = global.username;
    let password = global.password;

    const [listtimkiem, setListtimkiem] = useState([]);
    const [searchKey, setSearchKey] = useState('');

    const onPressItemOption = () =>{
        props.changeModalVisible(false);
    }

    setData_NhanVien = (item) => {
      onPressItemOption(); // close modal
      props.setData_NhanVien({
        manv : item.MANV, 
        tennv : item.TENNV,
      });
    }
    const _getListNhanVien = async () => {
      getListNhanVien(url, username, password, searchKey).then(obj => {
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
    return(
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : null}
            style = {styles.container} 
        >           
                <View style = {[styles.modal, {width : WIDTH - 20, height : HEIGHT / 1.5}]}>                    
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
                    <View style = {{flex : 9}}>                                                    
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
                </View>                                        
        </KeyboardAvoidingView>       
    );
}

function FlatList_NhanVien({item}){
    return (
      <TouchableOpacity 
        style={styles.cardView}
        onPress = {() => {
          setData_NhanVien(item);
        }}
      >                
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Mã nhân viên:</Text>  
            <Text style={styles.itemFlatlist}>{item.MANV}</Text>                                                                                                               
        </View>     
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Tên nhân viên:</Text>  
            <Text style={styles.itemFlatlist}>{item.HOTEN}</Text>                                                                                                               
        </View>                
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Đơn vị:</Text>  
            <Text style={styles.itemFlatlist}>{item.TENKV} </Text>
        </View>                  
    </TouchableOpacity>  
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
        marginBottom : 5,
        flex : 1
      }, 
      titleFlatlist : {
        margin : 4,
        marginLeft : 5,
        //fontWeight : 'bold',
        fontStyle : 'italic',
        flex : 3,
      },
      itemFlatlist : {
        margin : 4,
        fontWeight : 'bold',
        //fontStyle : 'italic',
        flex : 8
      },
});