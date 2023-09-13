import React, { useContext, useState, useEffect } from 'react';
import {Text, View, SafeAreaView, TouchableOpacity, StyleSheet, 
  Dimensions, TextInput, FlatList, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import {CustomeHeader} from '../common/CustomeHeader';
import {GlobalContext} from '../store/GlobalProvider';
import { Searchbar } from 'react-native-paper';
import {getListVatTu} from '../api/Api_DungChung';
import {insertVatTuSuaChua, insertVatTuThiCong} from '../api/Api_CongNhan';
import {listVatTuThuongDung_SuaChua, listVatTuThuongDung_LapMoi} from '../common/Constant';

const { width, height } = Dimensions.get('window');

export function TimKiemVatTuScreen ({navigation, route}) {

  const global = useContext(GlobalContext);
  let url = global.url;
  let username = global.username;
  let password = global.password;

  const type = route.params.type; //lấy type là sửa chữa hay lắp mới để hiển thị ds vật tư thường dùng cho đúng
  const madon = route.params.madon;

  const[searchKey, setSearchKey] = useState('');

  var OPTIONS = [];

  const [listVatTuTimKiem, setListVatTuTimKiem] = useState([]);

  if(type == 'suachua')
  {
    OPTIONS = listVatTuThuongDung_SuaChua;
  }
  else if (type == 'lapmoi')
  {
    OPTIONS =  listVatTuThuongDung_LapMoi;
  }    
  
  const [listVatTuThuongDung, setListVatTuThuongDung] = useState(OPTIONS);

  handleOnClick = (mavt, tenvt, dvt, slcty, slkh) => {
    if(listVatTuThuongDung.every((item) => item.mavattu !== mavt)){
      setListVatTuThuongDung(
      [...listVatTuThuongDung, 
        {
          mavattu : mavt, 
          tenvattu : tenvt, 
          dvt : dvt, 
          slcongty : '',  //add xuống list vật tư thường dùng nên để trống
          slkhachhang : '',
        }         
      ]
    );
   }
   else{
     alert('Vật tư đã có trong danh sách thường dùng.');
   }
  }

  _updateSlcty = (mavt, sl) => {
    let dsvattuNew = [...listVatTuThuongDung];
    let index = dsvattuNew.findIndex(el => el.mavattu === mavt);
    dsvattuNew[index] = {...dsvattuNew[index], slcongty: sl};
    setListVatTuThuongDung(dsvattuNew);
  }

  _updateSlkh= (mavt, sl) => {
    let dsvattuNew = [...listVatTuThuongDung];
    let index = dsvattuNew.findIndex(el => el.mavattu === mavt);
    dsvattuNew[index] = {...dsvattuNew[index], slkhachhang: sl};
    setListVatTuThuongDung(dsvattuNew);
  }

  const _getListVatTuTimKiem = async () => { 
    getListVatTu(url, username, password, searchKey) 
      .then(obj => {
          if(obj.ResultCode === true){   
            setListVatTuTimKiem(obj.Data); 
          }       
        })
        .catch(error => {
            alert('lỗi : ' + error);
        });
  }

  const successAlert = () => {
    Alert.alert(
      "Thông báo",
      "Thêm vật tư thành công",
      [        
        { text: "OK", 
          onPress: () => {           
           navigation.goBack();                  
          }
        }
      ],
      // { cancelable: false }
    );
    //console.log('thành công');
  }
    
  _onPressInsertSuaChua = async () =>{

    let listInsert = listVatTuThuongDung.filter(data => 
      (data.slcongty !== '' && data.slcongty != 0 ) 
      || (data.slkhachhang !== '' && data.slkhachhang != 0));

    if(listInsert.length == 0)
    {
      alert('Vui lòng chọn vật tư và nhập số lượng.');
      return;
    }

    async function loop(){
      for (const item of listInsert) {
        await _insertVatTuSuaChua(item.mavattu, item.slcongty, item.slkhachhang); // async await để thực hiện xong mới nhảy ra ngoài
      }
      //console.log('loop');
      return 'done';
    }
   
    loop().then(() => {
      //console.log('done');
      successAlert();
    })
    
  };

  const _insertVatTuSuaChua= async (mavt, slmp, sltt) => {
    const vattu = insertVatTuSuaChua(url, username, password, madon, mavt, slmp, sltt).then(obj => {     
        if(obj.ResultCode === true){          
        }      
        //console.log('insert nè');
      })
      .catch(error => {
          console.log('lỗi : ' + error);
      });
      return vattu;
  }

  _onPressInsertThiCong = async () =>{

    try{
      let listInsert = listVatTuThuongDung.filter(data => 
        (data.slcongty !== '' && data.slcongty != 0 ) 
        || (data.slkhachhang !== '' && data.slkhachhang != 0));
  
      if(listInsert.length == 0)
      {
        alert('Vui lòng chọn vật tư và nhập số lượng.');
        return;
      }

      for (const item of listInsert) {
        await _insertVatTuThiCong(item.mavattu, item.slcongty, item.slkhachhang); // async await để thực hiện xong mới nhảy ra ngoài
      }

      successAlert();
      
    }
    catch(error)
    {
      throw new Error(error);
    }
    
  };

  const _insertVatTuThiCong= async (mavt, slmp, sltt) => {
    insertVatTuThiCong(url, username, password, madon, mavt, slmp, sltt).then(obj => {    
        if(obj.ResultCode === true){          
        }      
      })
      .catch(error => {
          console.log('lỗi : ' + error);
      });
  }

    return (
        //<SafeAreaView style={{flex: 1, marginTop : Platform.OS === 'ios' ? 34 : 0}}>
        <SafeAreaView style={{flex: 1}}> 
          <CustomeHeader
            title = 'Tìm kiếm vật tư'
            isHome={false}
            navigation={navigation} 
          />         
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : null}
            style = {{flex : 1}}
          >
            <View style = {{
              flex : 1,
              backgroundColor : '#fff',
              marginBottom : 10
            }}>
              <Searchbar
                    placeholder="Search"
                    value = {searchKey}
                    onChangeText = {(text) => {
                        setSearchKey(text);
                    }}
                    onIconPress = {() => {
                        if(searchKey === '')
                        {
                          alert('Nội dung tìm kiếm không được để trống');
                          return;
                        }

                        _getListVatTuTimKiem();
                    }}
                />    
            </View>
            <View style = {{flex : 5}}>  
              <View style = {{
                flex : 1, 
                backgroundColor : 'white',
                alignItems : 'center', 
                justifyContent : 'center'
                }}>
                <Text style = {styles.title}>VẬT TƯ TÌM KIẾM</Text> 
              </View>  
              <View style = {styles.wrapper}/> 
              <View style = {{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.tenvattu}>Tên vật tư</Text>  
                      <Text style={styles.slcongty}>ĐVT</Text>
                  </View>
              </View>
              <View style = {styles.wrapper}/>     

              <View  style = {{flex : 7}}>
              <FlatList
                    data = {listVatTuTimKiem}
                    renderItem = {({item}) => (
                        <FlatListItemVatTuTimKiem item = {item}/>                       
                                             
                    )}
                    keyExtractor = {item => item.MAVT.toString()}>
                </FlatList>                  
              </View>  
                                                                      
            </View>   
            <View style = {styles.wrapper}/>           
            <View style = {{flex : 5}}>  
              <View style = {{
                flex : 1, 
                backgroundColor : 'white',
                alignItems : 'center', 
                justifyContent : 'center'
                }}>
                <Text style = {styles.title}>VẬT TƯ THƯỜNG DÙNG</Text> 
              </View>  
              <View style = {styles.wrapper}/> 
              <View style = {{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.tenvattu}>Tên vật tư</Text>  
                      <Text style={styles.slcongty}>SL Cty</Text>
                      <Text style={styles.slkhachhang}>SL Kh</Text>
                  </View>
              </View>
              <View style = {styles.wrapper}/>     

              <View  style = {{flex : 7}}>               
                <FlatList
                    data = {listVatTuThuongDung}
                    renderItem = {({item}) => (
                        <FlatListItemVatTuThuongDung item = {item}/>                       
                                             
                    )}
                    keyExtractor = {item => item.mavattu.toString()}>
                </FlatList>                 
              </View>  
                                                                      
            </View>    
            <View style = {styles.wrapper}/>           
            <View style = {{flex : 1}}>                   
                      <View style = {{
                          flex: 1,                          
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                        <TouchableOpacity 
                          style = {styles.btnButton}
                          onPress = {() => 
                            {     
                              let listInsert = listVatTuThuongDung.filter(data => 
                                (data.slcongty !== '' && data.slcongty != 0 ) 
                                || (data.slkhachhang !== '' && data.slkhachhang != 0));

                              if(type === 'suachua')
                              {
                                _onPressInsertSuaChua();
                              }
                              else
                              {
                                _onPressInsertThiCong();
                              }
                            }
                          }>
                            <Text style = {styles.submitText}>Chọn vật tư</Text>
                        </TouchableOpacity>                       
                      </View>                            
                  </View>  
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
}

function FlatListItemVatTuTimKiem ({item}){
  return (
      <View style={styles.cardView}>     
            <TouchableOpacity 
              onPress = {() => {
                handleOnClick(item.MAVT, item.TENVT, item.DVT, item.SOLUONG_MIENPHI, item.SOLUONG_TINHTIEN);
              }} >
              <View>
                  <View style = {styles.wrapper}/> 
                  <View style = {styles.viewContainerFlatlist}>
                      <Text style={styles.tenvattu}>{item.TENVT}</Text>  
                      <Text style={styles.slcongty}>{item.DVT}</Text>
                  </View>    
                  <View style = {styles.wrapper}/>                                                                              
              </View> 
            </TouchableOpacity>                    
      </View>  
  )
}

function FlatListItemVatTuThuongDung ({item}){

  const[slcty, setSlcty] = useState(item.slcongty.toString());
  const[slkh, setSlkh] = useState(item.slkhachhang.toString());

  return (   
    <View style={styles.cardView}>     
    <View style = {styles.wrapper}/> 
          <View style = {styles.viewContainerFlatlist}>
              <Text style={styles.tenvattu}>{item.tenvattu}</Text>  
              <TextInput style={[styles.slcongty, 
                {borderBottomColor: 'skyblue',
                borderBottomWidth: 2
                }]}
                keyboardType = 'decimal-pad'
                value = {slcty}
                onChangeText =  {(text) => {
                  setSlcty(text.replace(',', '.'));
                  _updateSlcty(item.mavattu, text);
              }}
                />
              <TextInput style={[styles.slkhachhang, {borderBottomColor: 'skyblue',
                borderBottomWidth: 2
                }]}
                keyboardType = 'decimal-pad'
                value = {slkh}
                onChangeText =  {(text) => {
                  setSlkh(text.replace(',', '.'));
                  _updateSlkh(item.mavattu, text);
              }}
                />
          </View>    
          <View style = {styles.wrapper}/>                       
</View> 
       
  )
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
  fontSize : 15,
  fontWeight : 'bold',
  fontStyle : 'italic'
},
cardView : {
  backgroundColor: 'white',
},
viewContainerFlatlist : {
  flex : 1,
  flexDirection : 'row',
  height : 42,
  justifyContent : 'center',
  alignItems : 'center'
}, 
tenvattu : {
  flex : 4,
  // margin : 3,
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
btnButton : {
  width : '40%',
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
  marginVertical : 10
}
});