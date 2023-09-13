import * as React from 'react';
import { Vibration} from 'react-native';
import {NavigationContainer, DefaultTheme, useIsFocused} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//dùng chung
import {Login} from './src/screens/Login';
import {TimKiemVatTuScreen} from './src/screens/TimKiemVatTuScreen';
import {CustomeDrawerContent} from './src/common/CustomeDrawerContent';
import {GoogleMapDirection} from './src/screens/GoogleMapDirection';

//kỹ thuật
import {PhanCongSuaChuaScreen} from './src/screens/kythuat/PhanCongSuaChuaScreen';
import {PhanCongLapMoiScreen} from './src/screens/kythuat/PhanCongLapMoiScreen';
import {TaoMoiThongTinSuaChua_KyThuat_Screen} from './src/screens/kythuat/TaoMoiThongTinSuaChua_KyThuat_Screen';
import {TheoDoiCongViecScreen} from './src/screens/kythuat/TheoDoiCongViecScreen';

//công nhân
import {HomeScreen} from './src/screens/congnhan/HomeScreen';
import {CongViecDaLamScreen} from './src/screens/congnhan/CongViecDaLamScreen';
import {CapNhatThongTinSuaChuaScreen} from './src/screens/congnhan/CapNhatThongTinSuaChuaScreen';
import {CapNhatThongTinLapMoiScreen} from './src/screens/congnhan/CapNhatThongTin_LapMoiScreen';
import {TaoThongTinSuaChua_CongNhan_Screen} from './src/screens/congnhan/TaoThongTinSuaChua_CongNhan_Screen';

import {GlobalContext} from './src/store/GlobalProvider';
import {getListSuaChuaChuaPhanCong} from './src/api/Api_KyThuat';
import {getListSuaChuaDuocPhanCong} from './src/api/Api_CongNhan';

//Đếm số chưa phân công (sửa chữa)
function CountChuaPhanCongSuaChua() {
  
  let count_number = 0;
  const global = React.useContext(GlobalContext);  
  let username = global.username;
  let password = global.password;
  const [listChuaPhanCong, setListChuaPhanCong] = React.useState(global.list_suachua_chuaphancong_initial);
  const [loading, setLoading] = React.useState(true);
 
  React.useEffect(() => {
    _getListSuaChuaChuaPhanCong();
    count_number = listChuaPhanCong.length;
  }, [listChuaPhanCong]);  

  const _getListSuaChuaChuaPhanCong = async () => {
    getListSuaChuaChuaPhanCong(global.url, username, password).then(obj => {
          if(obj.ResultCode === true)
          {    
            setLoading(false);
            let arr_temp = obj.Data;                                    
            if(arr_temp.length > 0)
            {                
              count_number = arr_temp.length;                  
              setListChuaPhanCong(arr_temp); 
              //alert(count_number);                           
            }   
          }      
        })
        .catch(error => {
            alert('lỗi : ' + error);
        });
  }    

  return count_number;
}

//Đếm số chưa phân công (Lắp mới)
function CountChuaPhanCongLapMoi() {
  
  let count_number = 0;  
  const global = React.useContext(GlobalContext);
  const [listChuaPhanCong, setListChuaPhanCongLapmoi] = React.useState(global.list_thicong_chuaphancong_initial);  
  count_number = listChuaPhanCong.length;
  return count_number;
}

//Đếm số sủa chữa chưa làm
function CountCongNhan() {
  
    let count_number = 0;
    const global = React.useContext(GlobalContext);
    const [listsuachua, setListsuachua] = useState(global.list_suachua_initial);
    count_number = listsuachua.length;
    
  return count_number;
}


const Stack = createStackNavigator();

const navOptionHandler = () => ({
    //headerShown : false,    
    headerStyle: {
     backgroundColor: '#05a4e4',
   },
   headerTintColor: '#fff',
   headerTitleStyle: {
     fontWeight: 'bold',
   },  
   headerTitleAlign: 'center',
   title:'App sửa chữa BIWASE',
 })

 const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    border: "transparent",
  }
}

const StackHome = createStackNavigator();

function HomeStack(){
  return(
    <StackHome.Navigator initialRouteName="Home" headerMode='none'>
      <StackHome.Screen name = "Home" component = {HomeScreen} options = {navOptionHandler}  />  
      <StackHome.Screen name = "CongViecDaLam" component = {CongViecDaLamScreen} options = {navOptionHandler}/>      
      <StackHome.Screen name = "CapNhatThongTinSuaChua" component = {CapNhatThongTinSuaChuaScreen} options = {navOptionHandler}/> 
      <StackHome.Screen name = "CapNhatThongTinLapMoi" component = {CapNhatThongTinLapMoiScreen} options = {navOptionHandler}/> 
      <StackHome.Screen name = "TimKiemVatTu" component = {TimKiemVatTuScreen} options = {navOptionHandler}/>  
      <StackHome.Screen name = "TaoThongTinSuaChua_CongNhan" component = {TaoThongTinSuaChua_CongNhan_Screen} options = {navOptionHandler}/>  
      <StackHome.Screen name = "GoogleMapDirection" component = {GoogleMapDirection} options = {navOptionHandler}/>    
    </StackHome.Navigator>
  )
}

const TabHome = createBottomTabNavigator();

function HomeTab(){
  return(    
    <TabHome.Navigator initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: "#078877",
          tabBarInactiveTintColor: "black",
          tabBarActiveBackgroundColor: "transparent",
          tabBarInactiveBackgroundColor: "transparent",       
          headerShown: false,
          tabBarStyle: {
            borderWidth: 0,
            marginTop: 10,
          },
          style: {
            backgroundColor: "transparent",       
            
          },
        }}>
      <TabHome.Screen name = "Home" component = {HomeScreen} screenOptions={{ headerShown: false }} options={{
        tabBarBadge:(CountCongNhan() >0 ? CountCongNhan(): null),
        tabBarLabel: 'Trang chủ',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" color={color} size={26} />        
        ),
        
      }} />  
      <TabHome.Screen name = "TaoThongTinSuaChua_CongNhan" component = {TaoThongTinSuaChua_CongNhan_Screen}  screenOptions={{ headerShown: false }} options={{
        tabBarLabel: 'Tạo đơn sửa chữa',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="plus-circle" color={color} size={26} />
        ),
      }} />     
      <TabHome.Screen name = "CongViecDaLam" component = {CongViecDaLamScreen} screenOptions={{ headerShown: false }} options={{
        tabBarLabel: 'Công việc đã làm',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="bell" color={color} size={26} />
        ),
      }} />   
           
      <TabHome.Screen name = "CapNhatThongTinSuaChua" component = {CapNhatThongTinSuaChuaScreen} options={{
        tabBarVisible: false, 
        tabBarButton: (props) => null,
        tabBarStyle: {display: 'none'},
      }}/> 
      <TabHome.Screen name = "CapNhatThongTinLapMoi" component = {CapNhatThongTinLapMoiScreen} options={{
        tabBarVisible: false, 
        tabBarButton: (props) => null,
        tabBarVisible : false,
        tabBarStyle: {display: 'none'},
      }}/> 
      <TabHome.Screen name = "TimKiemVatTu" component = {TimKiemVatTuScreen} options={{
         tabBarVisible: false, 
         tabBarButton: (props) => null,
         tabBarVisible : false,
         tabBarStyle: {display: 'none'},
      }}/>   
      <TabHome.Screen name = "GoogleMapDirection" component = {GoogleMapDirection} options={{
        tabBarVisible: false, 
        tabBarButton: (props) => null,
        tabBarStyle: {display: 'none'},
      }}/>              
    </TabHome.Navigator>
  )
}

const Drawer = createDrawerNavigator();

function DrawerNavigator({navigation}){
  return(
    <Drawer.Navigator initialRouteName="HomeTabs"
    drawerContent = {()=> <CustomeDrawerContent navigation={navigation}/>}
    >
      <Drawer.Screen name ="HomeTabs" component = {HomeStack} options = {navOptionHandler}  />      
    </Drawer.Navigator>
  )
}

const TabPhanCong = createBottomTabNavigator();

function PhanCongTab(){
  return(
    <TabPhanCong.Navigator initialRouteName="PhanCongSuaChua"
        screenOptions={{
          tabBarActiveTintColor: "#078877",
          tabBarInactiveTintColor: "black",
          tabBarActiveBackgroundColor: "transparent",
          tabBarInactiveBackgroundColor: "transparent",       
          headerShown: false,
          tabBarStyle: {
            borderWidth: 0,
            marginTop: 10,
          },
          style: {
            backgroundColor: "transparent",       
            
          },
        }}>
      <TabPhanCong.Screen name = "PhanCongSuaChua" onPress={() => Vibration.vibrate([0, 0, 0, 30])}  component = {PhanCongSuaChuaScreen} screenOptions={{ headerShown: false }} options={{
        tabBarBadge:(CountChuaPhanCongSuaChua() >0 ? CountChuaPhanCongSuaChua(): null),
        tabBarLabel: 'Trang chủ',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home" color={color} size={26} />
        ),
      }} />  
      <TabPhanCong.Screen name = "PhanCongLapMoi" component = {PhanCongLapMoiScreen}  screenOptions={{ headerShown: false }} options={{       
        tabBarLabel: 'Phân công lắp mới',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="bell" color={color} size={26} />
        ),
      }} />
      <TabPhanCong.Screen name = "TaoMoiThongTinSuaChua_KyThuat" component = {TaoMoiThongTinSuaChua_KyThuat_Screen} screenOptions={{ headerShown: false }} options={{        
        tabBarLabel: 'Tạo đơn sửa chữa',        
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="plus-circle" color={color} size={26} />
        ),
      }} />   

      <TabPhanCong.Screen name = "TheoDoiCongViecScreen" component = {TheoDoiCongViecScreen} screenOptions={{ headerShown: false }} options={{
        tabBarLabel: 'Tiến độ',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="chart-line" color={color} size={26} />
        ),
       
      }} />     

    </TabPhanCong.Navigator>
  )
}

const DrawerPhanCong = createDrawerNavigator();

function DrawerPhanCongNavigator({navigation}){
  return(
    <DrawerPhanCong.Navigator initialRouteName="PhanCongTabs"
    drawerContent = {()=> <CustomeDrawerContent navigation={navigation}  />}
    >
      <DrawerPhanCong.Screen name="PhanCongTabs" component={PhanCongTab} options = {navOptionHandler}/>
    </DrawerPhanCong.Navigator>
  )
}

export default function Navigation(props)
{  
    return(
        <NavigationContainer theme={theme}>         
            <Stack.Navigator initialRouteName = 'Login' headerMode='none'>
                <Stack.Screen name = 'Login' component = {Login} options = {navOptionHandler} />
                <Stack.Screen name = "HomeApp" component = {DrawerNavigator} options = {navOptionHandler}/>
                <Stack.Screen name = "QuanLyTab" component = {DrawerPhanCongNavigator} options = {navOptionHandler}/>
            </Stack.Navigator>                                                                          
        </NavigationContainer>        
    )
}


