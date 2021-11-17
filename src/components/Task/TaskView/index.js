import React, {useContext,useEffect,useState} from 'react';
import {View, Text, TouchableOpacity, Image , TextInput,ScrollView} from 'react-native';
import shortid from 'shortid';
import ProgressCircle from 'react-native-progress-circle';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from './taskViewStyle';
import {combineData} from '../../../utils/DataHelper';
import {AuthContext} from '../../../context';
import moment from 'moment';
import appTheme from '../../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database'


export function TaskView() {
  const {state, dispatch} = useContext(AuthContext);
  let { tasks, tasksData, isPM } = state;
  const [hour, setHours] = useState("");
  const {selectedTask} = state;
  const getData = async () => {
   
    var valid = false
    const value = await AsyncStorage.getItem('UserName')
    var recentPostsRef = database().ref('/Task');
    var Taskarray = []
    recentPostsRef.once('value').then((snapshot) => {
      if (isPM == 'Project Manager') {
        snapshot.forEach((childSnap) => {
          var selmem = []
          childSnap.val().selectedMembers.forEach((childSnap1) => {
            console.log("111dsdsds", childSnap1)
            selmem.push(childSnap1.toString())
          });
          Taskarray.push({ per: (childSnap.val().per).toString(), projectName: (childSnap.val().projectName).toString(), id: childSnap.key.toString(), title: (childSnap.val().title).toString(), description: (childSnap.val().description).toString(), selectedMembers: selmem, cdate: (childSnap.val().cdate).toString(), status: (childSnap.val().status).toString(), sdate: (childSnap.val().sdate).toString(), edate: (childSnap.val().edate).toString(), hourWorked: (childSnap.val().hourWorked).toString() })
        });
      } else {
        snapshot.forEach((childSnap) => {
          var selmem = []
          childSnap.val().selectedMembers.forEach((childSnap1) => {
            console.log("111dsdsds", childSnap1)
            selmem.push(childSnap1.toString())
            if (childSnap1.toString() == value) {
              valid = true
            }
          });
          if (valid == true) {
            Taskarray.push({ per: (childSnap.val().per).toString(), projectName: (childSnap.val().projectName).toString(), id: childSnap.key.toString(), title: (childSnap.val().title).toString(), description: (childSnap.val().description).toString(), selectedMembers: selmem, cdate: (childSnap.val().cdate).toString(), status: (childSnap.val().status).toString(), sdate: (childSnap.val().sdate).toString(), edate: (childSnap.val().edate).toString(), hourWorked: (childSnap.val().hourWorked).toString() })
            valid = false
          }
        });
      }
      dispatch({
        type: 'taskData',
        payload: { tasksData: Taskarray },
      });

     
    
    });
  }


  
  useEffect(() => {
    getData()


  }, [])
  return (
    <View style={styles.container}>
      <ScrollView>
      <View style={styles.topWrapper}>
        <View style={styles.taskProgressWrapper}>
          <ProgressCircle
            percent={selectedTask?.per}
            radius={30}
            borderWidth={7}
            color="#6AC67E"
            shadowColor="#f4f4f4"
            bgColor="#fff">
            <Text style={styles.taskProgress}>{selectedTask?.per}%</Text>
          </ProgressCircle>
        </View>
        <Text style={styles.taskTitle}>{selectedTask?.title}</Text>
      </View>
      
      <Text style={styles.taskTeamText}>Team</Text>
      <View style={styles.taskMembersWrapper}>
        {selectedTask?.selectedMembers?.map(member => (
          <View>
          <Image
            key={shortid.generate()}
            style={styles.taskMemberPhoto}
            source={require('../../../assets/user.png')}
          />
          <Text>{member}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.plusBtnContainer}>
          <MaterialCommunityIcons name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.scheduleWrapper}>
        <View style={styles.scheduleRow}>
          <MaterialCommunityIcons
            name="clock"
            size={20}
            color={appTheme.INACTIVE_COLOR}
          />
          <Text style={styles.scheduleText}>  {selectedTask?.hourWorked} Hours</Text>
        </View>
        <View style={styles.scheduleRow}>
          <AntDesign
            name="calendar"
            size={20}
            color={appTheme.INACTIVE_COLOR}
          />
          <Text style={styles.scheduleText}>{selectedTask?.cdate}</Text>
        </View>
      </View>
      <Text style={styles.scheduleText}><Text style={[styles.scheduleText,{color:'grey'}]}>Duration:</Text> {moment(selectedTask?.sdate).format("MMM DD YYYY")} to {moment(selectedTask?.edate).format("MMM DD YYYY")}</Text>

      <Text style={[styles.scheduleText,{margin:20}]}>
      <Text style={[styles.scheduleText,{color:'grey'}]}>Description : </Text>{selectedTask?.description}
      </Text>
      
      <TextInput
        placeholder="Hours Worked"
        placeholderTextColor="gray"
        style={styles.textInput}
        onChangeText={text => setHours(text)}
      />
       <TouchableOpacity onPress={() => {
           database().ref("Task").child(selectedTask?.id).update({ 'hourWorked':  hour })
           getData()
           dispatch({
            type: 'toggleBottomModal',
            payload: { bottomModal:null },
          });
       }} style={styles.btnWrapper}>
        <Text style={styles.btnText}>Update Worked Hours</Text>
      </TouchableOpacity>
      </ScrollView>
      {/* <View style={styles.bottomWrapper}>
        <TouchableOpacity style={styles.bottomContent}>
          <EvilIcons name="comment" size={25} color={appTheme.INACTIVE_COLOR} />
          <Text style={styles.bottomText}>3 comments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomContent}>
          <Ionicons name="attach" size={25} color={appTheme.INACTIVE_COLOR} />
          <Text style={styles.bottomText}>2 attachments</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}
