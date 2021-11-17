import React,{useState,useEffect,useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './signUpStyle';
import DropDownPicker from 'react-native-dropdown-picker';
import database from '@react-native-firebase/database';
import {navigate} from '../../navigators/RootNavigation';
import {getScreenParent} from '../../utils/NavigationHelper';
import appTheme from '../../constants/colors';
import firebase from '../../Database/firebase';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../../context';
export function SignUp({navigation}) {
  const { state, dispatch } = useContext(AuthContext);  
  
  const [displayName, setdisplayName] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [items, setItems] = useState([
    { label: 'Project Manager', value: 'Project Manager' },
    { label: 'Member', value: 'Member' },
    
  ]);
  useEffect(() => {
   
  
   

    },[])

  const handleBackButton = () => {
    navigation?.goBack();
  };

  const handleNavigation = (screen, params) => {
    navigate( screen, params);
  };
const registerUser = () => {
    if(email != '' && password != '' && displayName != '' && value != ' ') {


      setisLoading(true)
      auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        res.user.updateProfile({
          displayName: displayName
        })
        const contactsDbRef = database().ref('users/');

        contactsDbRef.push({
          Username:displayName,
          email: email,
          password: password,
          designation:value,
        }).then(() => {
          console.log("Data updated")
        }).catch(e => console.log(e))
        
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
  
        console.log('User registered successfully!')
        setisLoading(false)
        setdisplayName('')
        setemail('')
        setpassword('')
        setValue('')
      
        handleNavigation('Login')
      })
      .catch(error => {
        setisLoading(false)
        alert(error)
      }
        )      
    
     
    } else {
      Alert.alert('Enter details to signup!')
    }
  }
  if(isLoading){
    return(
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color="#9E9E9E"/>
      </View>
    )
  }    else{
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => handleBackButton()}>
          <MaterialIcons name="keyboard-arrow-left" size={25} color="gray" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContent}>
        <Text style={styles.largeText}>Welcome Back!</Text>
        <Text style={styles.smallText}>
          Log into your account &amp; manage {'\n'}your tasks
        </Text>
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={20} color="gray" />
          <TextInput
            placeholder="Username"
            placeholderTextColor="gray"
            style={styles.textInput}
            onChangeText={(text)=>setdisplayName(text)}
          />
        </View>
        <View style={styles.inputRow}>
          <MaterialCommunityIcons name="email-outline" size={20} color="gray" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="gray"
           
            style={styles.textInput}
            onChangeText={(text)=>setemail(text)}
          />
        </View>
        <View style={styles.inputRow}>
          <MaterialIcons name="lock-outline" size={20} color="gray" />
          <TextInput
            placeholder="Password"
            placeholderTextColor="gray"
            secureTextEntry={true}
            style={styles.textInput}
            onChangeText={(text)=>setpassword(text)}
          />
          <TouchableOpacity>
          <Octicons name="eye-closed" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <DropDownPicker
              placeholder="Select Designation"
              placeholderStyle={{ fontSize: 15 }}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              containerStyle={{
                width: '100%',
              }}
              style={{
                borderColor: 'transparent',
                backgroundColor: 'transparent',
                borderBottomColor:'#ccc',
                borderBottomWidth:1
              }}
              dropDownContainerStyle={{
                backgroundColor: '#fff',
                borderColor: 'transparent',
              }}
              labelStyle={{
                fontSize: 15,
              }}
            />
        {/* <View style={styles.savePwdRow}>
          <Text style={styles.savePwdText}>Save Password</Text>
          <Switch
            trackColor={{false: appTheme.INACTIVE_COLOR, true: appTheme.COLOR2}}
            thumbColor="#fff"
            value={true}
          />
        </View> */}
        <TouchableOpacity onPress={()=>registerUser()} style={styles.signUpBtnWrapper}>
          <Text style={styles.signUpBtnText}>SIGN UP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginBtnWrapper}
          onPress={() => handleNavigation('Login')}>
          <Text style={styles.loginBtnText}>
            Already have an account? LOGIN
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  }
}
