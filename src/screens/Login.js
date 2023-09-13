import React, {useContext, useState} from 'react';
import {View, StyleSheet, Text, KeyboardAvoidingView} from 'react-native';
import {Inputs} from '../common/Inputs';
import {Submit} from '../common/Submit';
import {GlobalContext} from '../store/GlobalProvider';
import {loginPermision, getListThongTinXuLy, getListLoaiDongHo} from '../api/Api_DungChung';
import {getListSuaChuaDuocPhanCong, getListThiCongDuocPhanCong} from '../api/Api_CongNhan';
import {Loading} from '../common/Loading';
import {getListSuaChuaChuaPhanCong, getListThiCongChuaPhanCong} from '../api/Api_KyThuat';

export function Login(props) {   
    const global = useContext(GlobalContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const[isloading, setIsloading] = useState();
 
    const _checkLogin = async () => {       
        setIsloading(false); //hiển thị loading        
        loginPermision(global.url, username, password).then(obj => {       
              if(obj.ResultCode === true){
                global.setUsername(username);
                global.setPassword(password);
                global.setFullname(obj.Data.HOTEN);
                global.setMacv(obj.Data.MACV);
                global.setMakv(obj.Data.MAKV);
                
                if(obj.Data.MACV === 'PCSC' || obj.Data.MACV === 'PCON')
                {                     
                    getList_DonPhanCong_KyThuat().then(() => {
                        setIsloading(true); 
                        global.setMacv('KYTHUAT');
                        props.navigation.navigate('QuanLyTab');   
                    });                           
                }  
                else
                {
                    getList_Promise().then(() => {
                        setIsloading(true);                        
                        global.setMacv('CONGNHAN');
                        props.navigation.navigate('HomeApp');   
                    });                      
                }   
              }      
              else{
                setIsloading(true); 
                alert('Username hoặc password không đúng');
              }
            })
            .catch(error => {
                setIsloading(true); 
                alert('Error: ' + error);
            }); 
      }

    async function getList_Promise(){
        const ttxl =  _getListThongTinXuLy(); // lấy loại xử lý
        const ldh =  _getListLoaiDongHo(); // lấy loại đồng hồ
        const suachua =  _getListSuaChuaDuocPhanCong(); //lấy danh sách sửa chữa được phân công để so sánh báo rung
        const lapmoi =  _getListThiCongDuocPhanCong(); //lấy danh sách thi công được phân công để so sánh báo rung   

        const results = await Promise.all([ttxl, ldh, suachua, lapmoi]);

        return results;
    }

    async function getList_DonPhanCong_KyThuat(){
        const suachua =  _getListSuaChuaChuaPhanCong(); //lấy danh sách sửa chữa được phân công để so sánh báo rung
        const lapmoi =  _getListThiCongChuaPhanCong(); //lấy danh sách thi công được phân công để so sánh báo rung   

        const results = await Promise.all([suachua, lapmoi]);

        return results;
    }

    const _getListThongTinXuLy = async () => {
       const ttxl =  getListThongTinXuLy(global.url, username, password).then(obj => {
              if(obj.ResultCode === true){    
                global.setListloaixl(obj.Data);     
              }  
              //console.log('1');      
            })
            .catch(error => {
                alert('lỗi : ' + error);
            });

            return ttxl;
    }

    const _getListLoaiDongHo = async () => {
        const ldh = getListLoaiDongHo(global.url, username, password).then(obj => {
            if(obj.ResultCode === true){    
                global.setListloaidongho(obj.Data);              
            }    
            //console.log('2'); 
            })
                .catch(error => {
                alert('lỗi : ' + error);
            });

            return ldh;
    }

    const _getListSuaChuaDuocPhanCong = async () => {
        const suachua = getListSuaChuaDuocPhanCong(global.url, username, password).then(obj => {
            // console.log(obj);
              if(obj.ResultCode === true){ 
                global.setList_suachua_initial(obj.Data);   
              }      
              //console.log('3'); 
            })
            .catch(error => {
                alert('lỗi : ' + error);
            });

            return suachua;
      }
      const _getListThiCongDuocPhanCong = async () => {
        const thicong = getListThiCongDuocPhanCong(global.url, username, password).then(obj => {
            // console.log(obj);
              if(obj.ResultCode === true){    
                global.setList_thicong_initial(obj.Data);    
              }   
              //console.log('4');   
            })
            .catch(error => {
                alert('lỗi : ' + error);
            });

            return thicong;
      }
      const _getListSuaChuaChuaPhanCong = async () => {
        const phancong_suachua = getListSuaChuaChuaPhanCong(global.url, username, password).then(obj => {
              if(obj.ResultCode === true){    
                global.setList_suachua_chuaphancong_initial(obj.Data);    
              }      
              //console.log('5'); 
            })
            .catch(error => {
                alert('lỗi : ' + error);
            });
            return phancong_suachua;
      }
      const _getListThiCongChuaPhanCong = async () => {
        const phancong_lapmoi = getListThiCongChuaPhanCong(global.url, username, password).then(obj => {
              if(obj.ResultCode === true){    
                global.setList_thicong_chuaphancong_initial(obj.Data);    
              }      
              //console.log('6'); 
            })
            .catch(error => {
                alert('lỗi : ' + error);
            });
            return phancong_lapmoi;
      }
    return(
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style = {styles.container}
        >
                <View style = {styles.frmDangNhap}>
                    <Text style = {styles.textTitle}>ĐĂNG NHẬP</Text>
                    <Text style = {styles.textBody}>App sửa chữa BIWASE</Text>
                    <View style = {{marginTop : 20, marginLeft : 5, marginRight : 5}}>
                        <Inputs name = 'Username' icon = 'user' onChangeText={(value) => {setUsername(value)}}/> 
                        <Inputs name = 'Password' icon = 'lock' pass = {true} onChangeText={(value) => {setPassword(value)}}/>
                    </View>

                    <Submit 
                        title = 'ĐĂNG NHẬP' 
                        color = '#4169e1' 
                        onPress = {
                            _checkLogin                                                        
                        }/>
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
            </KeyboardAvoidingView>   
    );
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : '#f0f8ff',
    },
    frmDangNhap : {
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : 'white',
        borderColor: '#4169e1',
        borderWidth: 1,
        borderRadius: 10,
    },
    image : {
        marginTop : 10,
        width : 300,
        height : 250,
        // marginVertical : 10
    },
    textTitle : {
        fontSize : 40,
        marginVertical : 10,
        color: '#4169e1',
        fontWeight : 'bold'
    },
    textBody : {
        fontSize : 16,
        color: '#4169e1',
        fontStyle : 'italic'
    },
    iconLanguage : {
        width : 40,
        height : 40,
    }
});