import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import shortid from 'shortid';
import styles from './createTaskStyle';
import { combineData } from '../../../utils/DataHelper';
import { AuthContext } from '../../../context';
import database from '@react-native-firebase/database'
import moment from 'moment'
import DatePicker from 'react-native-date-picker'

export function CreateTask() {
  const { state, dispatch } = useContext(AuthContext);
  const { members, selectedProject } = state;
  const [loader, setLoader] = useState(false)
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [date1, setDate1] = useState(new Date())
  const [open1, setOpen1] = useState(false)
  const [data, setData] = useState({
    newTask: { title: '', description: '', selectedMembers: [], time: '' },
  });
  const [UserArray, setUserArray] = useState([])
  const handleSetValue = (field, value) => {
    let { newTask } = data;
    if (field === 'selectedMembers') {
      let { selectedMembers } = newTask;
      const foundIndex = selectedMembers?.findIndex(a => a?.id === value?.id);
      if (foundIndex === -1) {
        selectedMembers.push(value);
      } else {
        selectedMembers = selectedMembers.filter(a => a?.id !== value?.id);
      }
      newTask['selectedMembers'] = selectedMembers;
    } else {
      newTask[field] = value;
    }

    setData(
      combineData(data, {
        newTask,
      }),
    );
  };
  const getData = () => {
    
    var recentPostsRef = database().ref('/Task');
    var Taskarray = []
    recentPostsRef.once('value').then((snapshot) => {

      snapshot.forEach((childSnap) => {
        var selmem = []
        childSnap.val().selectedMembers.forEach((childSnap1) => {
          console.log("111dsdsds", childSnap1)
          selmem.push(childSnap1.toString())
        });
        Taskarray.push({ per: (childSnap.val().per).toString(), projectName: (childSnap.val().projectName).toString(), id: childSnap.key.toString(), title: (childSnap.val().title).toString(), description: (childSnap.val().description).toString(), selectedMembers: selmem, cdate: (childSnap.val().cdate).toString(), status: (childSnap.val().status).toString(), time: (childSnap.val().time).toString() })
      });
    
      dispatch({
        type: 'taskData',
        
        payload: { tasksData: Taskarray.filter(i => i.projectName == selectedProject.title) },
      });
      
      // setUserArray(userarray)
    });
  }
  const handleBottomModal = bottomModal => {
    dispatch({
      type: 'toggleBottomModal',
      payload: { bottomModal },
    });
  };
  const createTask = () => {

    var tempArr = UserArray
    var Arr = []
    for (var i = 0; i < tempArr.length; i++) {

      if (tempArr[i].select == true) {
        Arr.push(tempArr[i].name)

      }
    }
    console.log(Arr)
   if(data.newTask.description != '' && data.newTask.title != '' && Arr != ''){

   
    const contactsDbRef = database().ref('Task/');

    contactsDbRef.push({
      projectName: selectedProject.title,
      title: data.newTask.title,
      description: data.newTask.description,
      selectedMembers: Arr,
      time: data.newTask.time,
      per: 10,
      cdate: moment(new Date()).format("MMM DD YYYY"),
      sdate: date.toString(),
      edate: date1.toString(),
      status: "Ongoing",
      hourWorked:"0"
    }).then(() => {
      console.log("Data updated")
    }).catch(e => console.log(e))
    getData()
    alert("Successfully created")
    handleBottomModal(null)
  }
  else{
    alert("Enter all detail")
  }
  }

  useEffect(() => {


    var userarray = []
  for(var i=0;i<selectedProject.selectedMembers.length;i++)
  {
    userarray.push({ name: selectedProject.selectedMembers[i], select: false })
  }
      
     
      setUserArray(userarray)
   



  }, [])
  const isSelectedMember = member => {
    let value;
    let { selectedMembers } = data?.newTask;
    const foundIndex = selectedMembers?.findIndex(
      a => a?.id?.toLowerCase() == member?.id?.toLowerCase(),
    );
    if (foundIndex > -1) {
      value = true;
    }
    return value;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.boldText}>Create Task</Text>
      <TextInput
        placeholder="Title"
        placeholderTextColor="gray"
        style={styles.textInput}
        onChangeText={text => handleSetValue('title', text)}
      />
      <TextInput
        placeholder="Description"
        placeholderTextColor="gray"
        style={[styles.textInput,{height:100}]}
        multiline={true}
        onChangeText={text => handleSetValue('description', text)}
      />
      {/* <TextInput
        placeholder="Time"
        placeholderTextColor="gray"
        style={styles.textInput}
        onChangeText={text => handleSetValue('time', text)}
      /> */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ alignSelf: 'center',width:'50%' }}>Start Date</Text>
        <Text style={{ alignSelf: 'center' }}>End Date</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>


        <TouchableOpacity onPress={() => { setOpen(true) }} style={styles.datestyle}>
          <Text style={{ alignSelf: 'center' }}>{date.toDateString()}</Text>
        </TouchableOpacity >
        <TouchableOpacity onPress={() => { setOpen1(true) }} style={styles.datestyle}>
          <Text style={{ alignSelf: 'center' }}>{date1.toDateString()}</Text>
        </TouchableOpacity>
      </View>

      <DatePicker
        modal
        open={open}
        date={date}
        mode={'date'}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />

      <DatePicker
        modal
        open={open1}
        date={date1}
        mode={'date'}
        onConfirm={(date) => {
          setOpen1(false)
          setDate1(date)
        }}
        onCancel={() => {
          setOpen1(false)
        }}
      />


      <View style={styles.teamTextWrapper}>
        <Text style={styles.teamText}>Select Members</Text>
      </View>
      {
        loader ?

          <ActivityIndicator></ActivityIndicator>
          :
          <View style={styles.teamSection}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.teamWrapper}>
                {UserArray?.map(member => (
                  <TouchableOpacity
                    key={shortid.generate()}
                    style={[
                      styles.memberWrapper,
                      member.select ? styles.activeTeamWrapper : null,
                    ]}
                    onPress={() => {
                      setLoader(true)
                      let tempArr = UserArray
                      for (var i = 0; i < tempArr.length; i++) {
                        if (tempArr[i].name == member.name) {
                          if (tempArr[i].select == false) {
                            tempArr[i].select = true
                          }
                          else {
                            tempArr[i].select = false
                          }


                        }
                        console.log(tempArr)
                      }
                      setTimeout(function () { setLoader(false) }, 200);
                      setUserArray(tempArr)
                    }}>
                    <Image
                      style={styles.memberPhoto}
                      source={require('../../../assets/user.png')}
                    />
                    <Text
                      style={[
                        styles.memberName,
                        member.select ? styles.activeMemberName : null,
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {member.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
      }
      <TouchableOpacity onPress={() => createTask()} style={styles.btnWrapper}>
        <Text style={styles.btnText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}
