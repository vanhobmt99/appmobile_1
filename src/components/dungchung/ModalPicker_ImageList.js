import React, {useState, useContext, useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Dimensions, KeyboardAvoidingView, ScrollView, Image, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {GlobalContext} from '../../store/GlobalProvider';
import {getListImageCaptured, postDeleteImage} from '../../api/Api_CongNhan';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export function ModalPicker_ImageList(props)
{
    const global = useContext(GlobalContext);

    let url = global.url;
    let username = global.username;
    let password = global.password;

    var madon = props.madon;
    var option = props.option;
    const [imagelist, setImageList] = useState([]);

    const onPressItemOption = () =>{
        props.changeModalVisible(false);
    }

    useEffect(() => {
      getListImageSuaChua(); 
    }, []);

    const getListImageSuaChua = async () => {
      getListImageCaptured(url, username, password, madon, option).then(obj => {  
        // console.log(obj);
            if(obj.ResultCode === true){    
              setImageList(obj.Data);                     
            }      
            else{          
            }
          })
          .catch(error => {
              alert('lỗi : ' + error);
          });
    }

    _deleteItemById = async (id) => {
      postDeleteImage(global.url, username, password, id).then(obj => {
              if(obj.ResultCode === true){    
                const filteredData = imagelist.filter(item => item.ID !== id);
                setImageList(filteredData);   
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
                <View style = {[styles.modal, {width : WIDTH - 20, height : HEIGHT/1.2}]}>                    
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
                    <View style = {{flex : 9}}>                                                        
                          <View style = {styles.rowsTitle}>
                            <Text style = {{
                                fontSize : 15, fontWeight : 'bold',  alignItems :'center', 
                                justifyContent : 'center',}}>HÌNH ẢNH ĐÃ CHỤP</Text>                       
                          </View>   
                          <ScrollView>
                            {/* thay dòng này để ko dùng flatlist để ko lỗi 
                            VirtualizedLists should never be nested inside plain ScrollViews */}
                            {imagelist.map((item, index) => (
                                <FlatList_Details item = {item} key = {index} type = {option}/>
                            ))}
                          </ScrollView>                          
                    </View>                                               
                </View>                                        
        </KeyboardAvoidingView>       
    );
}

function FlatList_Details({item}){

  const buttonDeleteAlert = () =>
    Alert.alert(
      "Thông báo",
      "Bạn có muốn xoá hình " + `${item.ID}`  + " không?",
      [
        {
          text: "Không",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Có", 
          onPress: () => {
            _deleteItemById(item.ID);       
          }
        }
      ],
      { cancelable: false }
    );

    return (
      <View style={styles.cardView}>    
        <View style = {{flex : 1, flexDirection : 'row'}}>
          <Image style={styles.bgContainer} 
            resizeMode='cover' 
            source={{ uri: 'data:image/jpeg;base64,' + item.Base64ImageString }}/> 
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
        position: 'absolute',
        left: 5,
        right: 0,
        top: 5,
        bottom: 0
      },
      bgContainer: 
      { 
        flex:1, 
        height: 300 
      },
});