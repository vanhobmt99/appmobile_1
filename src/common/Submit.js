import React from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions, Text} from 'react-native';

export function Submit(props)
{
    return(
        <TouchableOpacity
            style = {[styles.container, {backgroundColor : props.color}]}
            onPress = {props.onPress}
        >
            <Text style = {styles.submitText}>{props.title}</Text>
        </TouchableOpacity>
    );
};

const width = Dimensions.get('screen').width;

const styles = StyleSheet.create({
    container : {
        width : width - 20,
        height : 50,
        borderColor : 'blue',
        borderRadius : 10,
        marginVertical : 10,
        borderWidth : 0
    },
    submitText : {
        fontSize : 22,
        fontWeight : 'bold',
        color : 'white',
        alignSelf : 'center',
        marginVertical : 10
    }
});