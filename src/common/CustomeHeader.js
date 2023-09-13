import React from 'react';
import {Text, View, TouchableOpacity, 
  Image, StyleSheet, StatusBar} from 'react-native';
import {IMAGE} from './Image';

export const CustomeHeader = (props) => {
  return (
    <View style={{flexDirection: 'row',height: 50}}>
      { props.isHome ?   
        null  
        : 
        <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center'}}
        onPress = {() => {props.navigation.goBack()}}
        >
            <Image style={{width: 20, height : 20, marginLeft: 5}} 
              source = {IMAGE.ICON_BACK}
              resizeMode = 'contain'
              
            />
            <Text>Back</Text>
        </TouchableOpacity>
      }  
      <StatusBar barStyle = 'dark-content'></StatusBar>   
      <View style={{flex: 5,justifyContent: 'center'}}>
        <Text style={{marginLeft: 10, fontWeight : 'bold', fontSize : 20, color: '#4169e1'}}>{props.title}</Text>
      </View>
      {/* <View style={{flex: 1}}>
        <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', justifyContent: 'center'}}
          onPress = {() => {
            props.navigation.navigate('Home');
          }}
          >
              <Image style={{width: 25, height : 25, marginLeft: 5, marginTop : 15}} 
                source = {IMAGE.ICON_HOME}
                resizeMode = 'contain'               
              />
          </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
});