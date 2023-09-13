import React, {useState, useContext, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Dimensions, 
    FlatList, TextInput, KeyboardAvoidingView, ScrollView, ActivityIndicator} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button, Searchbar} from 'react-native-paper';
import {DropDown} from '../../common/DropDown';
import {timkiemkhachhang} from '../../common/Constant';
import {getListKhachHang} from '../../api/Api_DungChung';
import {GlobalContext} from '../../store/GlobalProvider';
import {Loading} from '../../common/Loading';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export function ModalPicker_KhachHang(props)
{
    const global = useContext(GlobalContext);

    let username = global.username;
    let password = global.password;

    const [type, setType] = useState('');
    const [searchKey, setSearchKey] = useState('');

    const[isloading, setIsloading] = useState();

    const [listtimkiem, setListtimkiem] = useState([]);

    const onPressItemOption = () =>{
        props.changeModalVisible(false);
    }

    setData = (item) => {
      onPressItemOption(); // close modal
      props.setData({
        idkh : item.IDKH, 
        danhbo : item.MADBCU,
        tenkh : item.TENKH,
        diachi : item.SONHA + ', ' + item.TENDP + ', ' + item.TENPHUONG,
        sdt : item.SDT
      });
    }

    const setValueDropDown = (option) => {
      setType(option);
    }  

    const _getListKhachHang = async (madbcu, tenkh, madh, sohd, sonha, madp, makv) => {
      getListKhachHang(global.url, username, password, madbcu, tenkh, madh, sohd, sonha, madp, makv).then(obj => {
            if(obj.ResultCode === true){   
              setIsloading(true); 
              setListtimkiem(obj.Data);       
            }      
            else{    
              setIsloading(true); 
              alert('Không tìm thấy dữ liệu');    
            }
          })
          .catch(error => {
              setIsloading(true); 
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
                                      

                                      var madbcu = '';
                                      var tenkh = '';
                                      var madh = '';
                                      var sohd = '';
                                      var sonha = ''; 
                                      var madp = '';
                                      var makv = '%';

                                      if(searchKey === '')
                                      {
                                        alert('Nội dung tìm kiếm không được trống.');
                                        return;
                                      }

                                      if(type === '')
                                      {
                                        alert('Chọn nội dung tìm kiếm.');
                                        return;
                                      }

                                      setIsloading(false);

                                      if(type === 'danhbo'){
                                        madbcu = searchKey;
                                      }
                                      else if(type === 'tenkhachhang'){
                                        tenkh = searchKey;
                                      }
                                      else if(type === 'madongho'){
                                        madh = searchKey;
                                      }
                                      else if(type === 'sohopdong'){
                                        sohd = searchKey;
                                      }
                                      else if(type === 'sonha'){
                                        sonha = searchKey;
                                      }
                                      else if(type === 'duongpho'){
                                        madp = searchKey;
                                      }
                                      else if(type === 'khuvuc'){
                                        makv = searchKey;
                                      }

                                      _getListKhachHang(madbcu, tenkh, madh, sohd, sonha, madp, makv);
                                    }}
                                />     
                            </View>
                            <View style = {{flex : 5, 
                              marginRight : 5}}>                            
                              <DropDown list = {timkiemkhachhang} setValueDropDown = {setValueDropDown}/>        
                            </View>
                          </View>      
                          <View style = {styles.rowsTitle}>
                            <Text style = {{
                                fontSize : 15, fontWeight : 'bold',  alignItems :'center', 
                                justifyContent : 'center',}}>DANH SÁCH KHÁCH HÀNG</Text>                       
                          </View>   
                          <ScrollView>
                            {
                              listtimkiem.map((item, index) => (
                                <FlatList_KhachHang item = {item} key = {index}/>
                              ))
                            }
                          </ScrollView>                          
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
                </View> 
                                                      
        </KeyboardAvoidingView>       
    );
}

function FlatList_KhachHang({item}){
    return (
      <TouchableOpacity 
        style={styles.cardView}
        onPress = {() => {
          setData(item);
        }}
      >                
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Idkh:</Text>  
            <Text style={styles.itemFlatlist}>{item.IDKH}</Text>                                                                                                               
        </View>     
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Danh bộ:</Text>  
            <Text style={styles.itemFlatlist}>{item.MADBCU}</Text>                                                                                                               
        </View>                
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Tên KH:</Text>  
            <Text style={styles.itemFlatlist}>{item.TENKH} </Text>
        </View>    
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Địa chỉ:</Text>  
            <Text style={styles.itemFlatlist}>{item.SONHA + ', ' + item.TENDP + ', ' + item.TENPHUONG} </Text>
        </View>                   
        <View style = {styles.viewContainerFlatlist}>
            <Text style={styles.titleFlatlist}>Sđt:</Text>  
            <Text style={styles.itemFlatlist}>{item.SDT} </Text>
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
        flex : 8
      },
});