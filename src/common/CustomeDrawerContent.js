import React, { useContext, useState } from 'react';
import {View, StyleSheet} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {Avatar, Title, Caption, Drawer} from 'react-native-paper';
import {IMAGE} from '../common/Image';
import {GlobalContext} from '../store/GlobalProvider';
import {upperCaseEachWord} from '../common/CommonFunction';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const CustomeDrawerContent = (props) => {

  const global = useContext(GlobalContext);
  const congviec = global.macv;

  return(
    <View style = {{flex : 1}}>
      <DrawerContentScrollView {...props}>
        <View style = {styles.drawerContent}>
          <View style = {styles.userInfoSection}>
            <View style = {{flexDirection : 'row', marginTop : 15}}>
              <Avatar.Image 
                source = {IMAGE.ICON_PROFILE}
                size = {50}
                style = {{backgroundColor : '#6495ed'}}
              />
              <View style = {{marginLeft : 15, flexDirection : 'column'}}>
                <Title style = {styles.title}>{global.fullname}</Title>
                <Caption style = {styles.caption}>{'@' + global.username}</Caption>
              </View>
            </View>
          </View>                   
          {
            congviec === 'KYTHUAT'
            ?
            
            <Drawer.Section style = {styles.drawerSection}>
              <View style = {styles.wrapper}/>    
              <DrawerItem
                icon = {({color, size}) => 
                  <FontAwesome 
                    name = 'list-alt'
                    color = {color}
                    size = {size}
                  />
                }
                label = 'Phân công sửa chữa'
                onPress = {() => {
                  props.navigation.navigate('PhanCongSuaChua');
                }}
              />
              <View style = {styles.wrapper}/>    
              <DrawerItem
                icon = {({color, size}) => 
                  <FontAwesome 
                    name = 'list-alt'
                    color = {color}
                    size = {size}
                  />
                }
                label = 'Phân công lắp mới'
                onPress = {() => {
                  props.navigation.navigate('PhanCongLapMoi');
                }}
              />
              <View style = {styles.wrapper}/>    
              <DrawerItem
                icon = {({color, size}) => 
                  <FontAwesome 
                    name = 'plus-circle'
                    color = {color}
                    size = {size}
                  />
                }
                label = 'Tạo thông tin sửa chữa'
                onPress = {() => {
                  props.navigation.navigate('TaoMoiThongTinSuaChua_KyThuat');
                }}
              />
              <View style = {styles.wrapper}/>    
              <DrawerItem
                icon = {({color, size}) => 
                  <FontAwesome 
                    name = 'line-chart'
                    color = {color}
                    size = {size}
                  />
                }
                label = 'Theo dõi tiến độ'
                onPress = {() => {
                  props.navigation.navigate('TheoDoiCongViecScreen');
                }}
              />
            </Drawer.Section>  
            :
            <Drawer.Section style = {styles.drawerSection}>
              <View style = {styles.wrapper}/>    
              <DrawerItem
                icon = {({color, size}) => 
                <FontAwesome 
                  name = 'file-o'
                  color = {color}
                  size = {size}
                />
              }
              label = 'Danh sách công việc'
              onPress = {() => {
                props.navigation.navigate('Home');
              }}
            />
            <View style = {styles.wrapper}/> 
              <DrawerItem
                icon = {({color, size}) => 
                <FontAwesome 
                  name = 'plus-square-o'
                  color = {color}
                  size = {size}
                />
              }
              label = 'Tạo thông tin sửa chữa'
              onPress = {() => {
                props.navigation.navigate('TaoThongTinSuaChua_CongNhan');
              }}
            />
            <View style = {styles.wrapper}/>    
            {/* <DrawerItem
              icon = {({color, size}) => 
                <FontAwesome 
                  name = 'plus-square'
                  color = {color}
                  size = {size}
                />
              }
              label = 'Thay đồng hồ định kỳ'
              onPress = {() => {

              }}
            /> */}
            <View style = {styles.wrapper}/>    
            <DrawerItem
              icon = {({color, size}) => 
                <FontAwesome 
                  name = 'check-square-o'
                  color = {color}
                  size = {size}
                />
              }
              label = 'Công việc đã làm'
              onPress = {() => {
                props.navigation.navigate('CongViecDaLam');
              }}
            />
            </Drawer.Section>  
          }                                          
                 
        </View>
      </DrawerContentScrollView>  
      <Drawer.Section style = {styles.bottomDrawerSection}>
        <DrawerItem 
          icon = {({color, size}) =>  
            <FontAwesome  
              name = 'sign-out'
              color = {color}
              size = {size}
            />
          } 
          label = 'Đăng xuất'
          onPress = {() => {
            props.navigation.navigate('Login');
          }}
        />        
      </Drawer.Section> 
      <Drawer.Section>       
        <DrawerItem
          label = 'App sửa chữa version 1.0.2'
      />
      </Drawer.Section> 
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent : {
    flex : 1
  },
  userInfoSection : {
    paddingLeft : 20
  },
  title : {
    fontSize : 16,
    marginTop : 3,
    fontWeight : 'bold'
  },
  caption : {
    fontSize : 14,
    lineHeight : 14,
  },
  row : {
    marginTop : 20,
    flexDirection : 'row',
    alignItems : 'center',
  },
  section : {
    flexDirection : 'row',
    alignItems : 'center',
    marginRight : 15
  },
  paragraph : {
    fontWeight : 'bold',
    marginRight : 3
  }, 
  drawerSection : {
    marginTop : 15,
  },
  bottomDrawerSection : {
    marginBottom : 15,
    borderTopColor : '#f4f4f4',
    borderTopWidth : 1
  },
  bottomSectionLabel: {
    borderTopColor : '#f4f4f4',
    borderTopWidth : 1
  },
  wrapper: {
    borderBottomColor: '#dcdcdc',
    borderBottomWidth: 0.4,
},
});



