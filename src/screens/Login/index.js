import React,{useState,useEffect,useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Image,
  ActivityIndicator,
  
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import styles from './loginStyle';
import Illustration from '../../assets/4529164.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate} from '../../navigators/RootNavigation';
import {getScreenParent} from '../../utils/NavigationHelper';
import appTheme from '../../constants/colors';
import firebase from '../../Database/firebase';
import { AuthContext } from '../../context';
import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth';
export function Login({navigation}) {
  const { state, dispatch } = useContext(AuthContext);  
  const { UserData} = state;
 
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [seen, setSeen] = useState(true);
  
  const handleBackButton = () => {
    navigation?.goBack();
  };

  const handleNavigation = (screen, params) => {
    navigate( screen, params);
  };
  useEffect(() => {

    var recentPostsRef = database().ref('/users');
    var userarray = []
    recentPostsRef.once('value').then((snapshot) => {
      snapshot.forEach((childSnap) => {
        console.log(childSnap);
        userarray.push({ name: (childSnap.val().Username).toString(), designation: (childSnap.val().designation).toString() })
      });
      dispatch({
        type: 'loginScreen',
        payload: { UserData: userarray },
      });
      
    });
  
   
  
   

    },[])
  const userLogin = () => {
    if(email == '' && password =='') {
      Alert.alert('Enter details to signin!')
    } else {

        setisLoading(true)
   
      auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log(res)
        console.log('User logged-in successfully!')
       var  filData = UserData.filter(data => data.name == res.user.displayName);
     console.log("dsda===================",filData)
       dispatch({
        type: 'designation',
        payload: { isPM: filData[0].designation },
      });
          setisLoading(false),
          setemail(''), 
          setpassword('')
          Alert.alert(
            "Success",
            "Login Successfull",
            [
              
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: async () =>
              {
                try {
                  await AsyncStorage.setItem('login', "true")
                  await AsyncStorage.setItem('IsPM', filData[0].designation)
                 await AsyncStorage.setItem('UserName', res.user.displayName)
                } catch (e) {
                 alert(error)
                }
                navigation.replace('BottomStack')
              }
              
               }
            ]
          );
          
      })
      .catch(error =>{
        setisLoading(false)
        alert(error)
      }
       )
    }
    
  }
  
  if(isLoading){
    return(
      <View style={styles.preloader,{justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large" color="#9E9E9E"/>
      </View>
    )
  }    else{
  return (

    <SafeAreaView style={styles.container}>
      
      {/* <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => handleBackButton()}>
          <MaterialIcons name="keyboard-arrow-left" size={25} color="gray" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.illustrationWrapper}>
        
      </View>
     
      <View style={styles.bodyContent}>
      <Image source={Illustration} style={styles.illustrationContent} />
        <Text style={styles.largeText}>Welcome Back!</Text>
        <Text style={styles.smallText}>
          Log into your account &amp; manage {'\n'}your tasks
        </Text>
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={20} color="gray" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="gray"
            onChangeText={(value)=>setemail(value)}
            style={styles.textInput}
          />
        </View>
        <View style={styles.inputRow}>
          <MaterialIcons name="lock-outline" size={20} color="gray" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="gray"
            secureTextEntry={seen}
            onChangeText={(value)=>setpassword(value)}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={()=>{
            setSeen(!seen)
            }}>
          <Octicons name="eye-closed" size={20} color="gray" /></TouchableOpacity>
        </View>
        {/* <View style={styles.savePwdRow}>
          <Text style={styles.savePwdText}>Save Password</Text>
          <Switch
            trackColor={{false: appTheme.INACTIVE_COLOR, true: appTheme.COLOR2}}
            thumbColor="#fff"
            value={true}
          />
        </View> */}
        <TouchableOpacity onPress={()=>userLogin()} style={styles.loginBtnWrapper}>
          <Text style={styles.loginBtnText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signUpBtnWrapper}
          onPress={() => handleNavigation('SignUp')}>
          <Text style={styles.signUpBtnText}>
            Don't have an account? SIGN UP
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
}