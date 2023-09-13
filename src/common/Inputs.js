import React, {Component, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input} from 'react-native-elements';

export function Inputs(props)
{
    const [isfocused, setIsfocused] = useState(false);

    onFocusChange = () =>{
        setIsfocused(true);
    }

    return(
        <View
            style = {[styles.container, {borderColor : isfocused ? '#4169e1' : '#eee'}]}
        >
            <Input
                placeholder = {props.name}
                onFocus = {onFocusChange}
                inputContainerStyle = {styles.inputContainer}
                inputStyle = {styles.inputText}
                secureTextEntry = {props.pass}
                leftIcon = {
                    <Icon
                        name = {props.icon}
                        size = {22}
                        color = {isfocused ? '#4169e1' : 'grey'}
                    />
                }
                onChangeText={props.onChangeText}
            >
            </Input>

        </View>
    );
};
const width = Dimensions.get('screen').width;

const styles = StyleSheet.create({
    container : {
        width : width - 20,
        height : 50,
        borderRadius : 100,
        marginVertical : 10,
        borderWidth : 3.5
    },
    inputContainer : {
        borderBottomWidth : 0
    },
    inputText : {
        color : '#4169e1',
        fontWeight : 'bold',
        marginLeft : 5
    }
});