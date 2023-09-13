import React, { useContext, useState, useEffect } from 'react';
import {Text, View, SafeAreaView, TouchableOpacity, 
  ScrollView, StyleSheet, Dimensions, Animated} from 'react-native';
import {CustomeHeader} from '../../common/CustomeHeader';
import {GlobalContext} from '../../store/GlobalProvider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getListSuaChuaDaThucHien, getListThiCongDaThucHien} from '../../api/Api_CongNhan';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export function CongViecDaLamScreen (props) {
  
  var isFocused = useIsFocused();

  const global = useContext(GlobalContext);
  let url = global.url;
  let username = global.username;
  let password = global.password;

  const [active, setActive] = useState(0);

  const [list_suachua, setList_suachua] = useState([]);

  const [list_lapmoi, setList_lapmoi] = useState([]);

  useEffect(() => {
    if(isFocused){
      _getListSuaChuaDaThucHien();
      _getListThiCongDaThucHien();
    }
    return () => {
      isFocused = false // add this
     }
  }, [isFocused]);

  const _getListSuaChuaDaThucHien = async () => {
    getListSuaChuaDaThucHien(url, username, password).then(obj => {
          if(obj.ResultCode === true){    
            setList_suachua(obj.Data);    
          }      
        })
        .catch(error => {
            alert('lỗi : ' + error);
        });
  }
  const _getListThiCongDaThucHien = async () => {
    getListThiCongDaThucHien(url, username, password).then(obj => {
          if(obj.ResultCode === true){    
            setList_lapmoi(obj.Data);    
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

    return (
        <SafeAreaView style={{flex: 1}}>
          <CustomeHeader
            title= 'Công việc đã làm'
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
                  }} 
                    >
                  <Text style = {{color : active === 0 ? '#fff' : '#4169e1'}}>Sửa chữa</Text>
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
                  <Text style = {{color : active === 1 ? '#fff' : '#4169e1'}}>Lắp mới</Text>
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
                      list_suachua.map((item, index) => (
                        <FlatListItemSuaChua item = {item} key = {index}/>
                      ))
                      :
                      /* thay dòng này để ko dùng flatlist để ko lỗi 
                      VirtualizedLists should never be nested inside plain ScrollViews */
                      list_lapmoi.map((item, index) => (
                        <FlatListItemThiCong item = {item} key = {index}/>
                      ))
                    }               
                </ScrollView>
            </View>          
          </View>
          
        </SafeAreaView>
      );
}

function FlatListItemSuaChua ({item}){

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
              </View> 
            </TouchableOpacity>                    
      </View>  
  )
}

function FlatListItemThiCong({item}){

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
});