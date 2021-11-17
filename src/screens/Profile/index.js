import React, {useContext,useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import styles from './profileStyle';
import appTheme from '../../constants/colors';
import {AuthContext} from '../../context';
import {TabScreenHeader} from '../../components';
import {navigate, navigateToNestedRoute} from '../../navigators/RootNavigation';
import {getScreenParent} from '../../utils/NavigationHelper';
import AsyncStorage  from '@react-native-async-storage/async-storage';



export function Profile({navigation}) {
  const {state, dispatch} = useContext(AuthContext);
  const {user,isPM} = state;
  const [username,setUserName] = useState("")
  const handleBackButton = () => {
    navigation?.goBack();
  };

  const handleNavigation = (screen, params) => {
    navigateToNestedRoute(getScreenParent(screen), screen, params);
  };

  const getData = async () => {
   
        const value = await AsyncStorage.getItem('UserName')
        setUserName(value)
     
         
   

}

useEffect(() => {
    getData()

}, []);


  return (
    <SafeAreaView style={styles.container}>
      <TabScreenHeader
        leftComponent={() => (
          <View style={styles.leftHeaderWrapper}>
            {/* <TouchableOpacity
              onPress={() => handleBackButton('Members')}
              style={styles.backButton}>
              <Ionicons name="arrow-back-outline" size={25} color="#000" />
            </TouchableOpacity> */}
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        )}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.profileDetailsSection}>
            <View style={styles.profileInfoSection}>
              <View style={styles.statisticsContainer}>
                <Text style={styles.statisticsText}>135</Text>
                <Text style={styles.statisticsTitle}>Completed Tasks</Text>
              </View>
              <Image
                style={styles.profilePhoto}
                source={require('../../assets/profile.png')}
              />
              <View style={styles.statisticsContainer}>
                <Text style={styles.statisticsText}>20</Text>
                <Text style={styles.statisticsTitle}>Ongoing Tasks</Text>
              </View>
            </View>
            <View style={styles.profileCenterSection}>
              <Text style={styles.nameText}>{username}</Text>
              <Text style={styles.designationText}>{isPM}</Text>
              <TouchableOpacity style={styles.editProfileWrapper}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.exploreSection}>
            <Text style={styles.exploreHeader}>Explore</Text>
            <View style={styles.exploreContent}>
              <TouchableOpacity onPress={()=>navigate("Members")} style={styles.singleExplore}>
                <Ionicons name="people" size={22} color={appTheme.COLOR1} />
                <Text style={styles.exploreText}>Members</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.singleExplore}>
                <SimpleLineIcons
                  name="settings"
                  size={22}
                  color={appTheme.COLOR1}
                />
                <Text style={styles.exploreText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={ async() => {
                  try {
                    await AsyncStorage.setItem('login', "false")
                  } catch (e) {
                   alert(error)
                  }
                  navigation.replace('Login')}} style={styles.singleExplore}>
                <MaterialCommunityIcons
                  name="logout"
                  size={22}
                  color={appTheme.COLOR1}
                />
                <Text style={styles.exploreText}>Logout</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.singleExplore}>
                <SimpleLineIcons
                  name="logout"
                  size={22}
                  color={appTheme.COLOR1}
                />
                <Text style={styles.exploreText}>Settings</Text>
              </TouchableOpacity> */}
              {/* <TouchableOpacity
                style={[
                  styles.singleExplore,
                  {marginRight: 'auto', marginLeft: '7%'},
                ]}
                onPress={ async() => {
                  try {
                    await AsyncStorage.setItem('login', "false")
                  } catch (e) {
                   alert(error)
                  }
                  navigation.replace('Login')}}>
                <MaterialCommunityIcons
                  name="logout"
                  size={22}
                  color={appTheme.COLOR1}
                />
                <Text style={styles.exploreText}>Log out</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
