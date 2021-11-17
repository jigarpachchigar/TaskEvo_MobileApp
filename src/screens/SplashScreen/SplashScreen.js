//import liraries
import React, { Component, useEffect, useState,useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {AuthContext} from '../../context';
// create a component

function SplashScreen({ navigation }) {
    const {state, dispatch} = useContext(AuthContext);
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('login')
            const IsPM = await AsyncStorage.getItem('IsPM')
            
            if (value == "true") {
                setTimeout(() => {
                    navigation.replace("BottomStack")
                }, 3000);
                dispatch({
                    type: 'designation',
                    payload: { isPM: IsPM },
                  });
            }
            else {
                setTimeout(() => {
                navigation.replace("Login")
            }, 3000);
            }
            return value
        } catch (e) {
            // error reading value
        }

    }

    useEffect(() => {
        getData()

    }, []);



    return (
        <SafeAreaView>
            <View style={{ height: '100%',backgroundColor:'white' ,alignItems:'center',justifyContent:'center'}}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={{ height: 120, width: 120, alignSelf:'center' }}

                >

                </Image>
                <Text style={{fontWeight:'bold',fontSize:20,marginTop:20}}>Smart Task </Text>
                <Text style={{fontWeight:'bold',fontSize:20}}>Management</Text>

            </View>
        </SafeAreaView>
    );
}


// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
});

//make this component available to the app
export default SplashScreen;
