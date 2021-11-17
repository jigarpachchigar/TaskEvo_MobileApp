import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import shortid from 'shortid';
import styles from './createProjectStyle';
import { combineData } from '../../../utils/DataHelper';
import { AuthContext } from '../../../context';
import database from '@react-native-firebase/database';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
export function CreateProject() {
  const { state, dispatch } = useContext(AuthContext);
  const { members } = state;
  const [data, setData] = useState({
    newProject: { title: '', description: '', selectedMembers: [] },
  });
  const [textInput, setTextInput] = useState([])
  const [inputData, setInputData] = useState([])

  const [loader, setLoader] = useState(false)
  const [UserArray, setUserArray] = useState([])
  useEffect(async() => {
    const value = await AsyncStorage.getItem('UserName')
    var recentPostsRef = database().ref('/users');
    var userarray = []
    recentPostsRef.once('value').then((snapshot) => {
      snapshot.forEach((childSnap) => {
        console.log(childSnap.val().Username);
        if(childSnap.val().Username!=value){
          userarray.push({ name: (childSnap.val().Username).toString(), select: false })
        }
        
      });
      setUserArray(userarray)
    });



  }, [])

  

 
  const createProject = () => {
   
  
    var tempArr = UserArray 
    var Arr = []
    for(var i=0;i<tempArr.length;i++){
      
        if(tempArr[i].select == true){
          Arr.push(tempArr[i].name)
        
        }
    }
    

 
    const contactsDbRef = database().ref('Project/');

    contactsDbRef.push({
      title: data.newProject.title,
      description: data.newProject.description,
      selectedMembers: Arr,
      cdate:moment(new Date()).format("MMM DD YYYY"),
      status:"Ongoing"
    }).then(() => {
      onRefresh()
      console.log("Data updated")
    }).catch(e => console.log(e))
    dispatch({
      type: 'toggleBottomModal',
      payload: {bottomModal:null},
    });
alert("Successfully created")

  }
  const onRefresh = () => {
    //set isRefreshing to true
   
    var recentPostsRef = database().ref('/Project');
    var userarray = []
    recentPostsRef.once('value').then((snapshot) => {
    
      snapshot.forEach((childSnap) => {
       var selmem = []
        childSnap.val().selectedMembers.forEach((childSnap1) => {
            console.log("111dsdsds",childSnap1)
            selmem.push(childSnap1.toString())
        });
         userarray.push({ id: childSnap.key.toString(),title: (childSnap.val().title).toString(), description: (childSnap.val().description).toString(),selectedMembers: selmem,cdate:(childSnap.val().cdate).toString(),status:(childSnap.val().status).toString()})
      });
      dispatch({
        type: 'projectData',
        payload: { projectsData: userarray },
      });
   
    
      // setUserArray(userarray)
    });
  
    // and set isRefreshing to false at the end of your callApiMethod()
}
  const handleSetValue = (field, value) => {
    let { newProject } = data;
    if (field === 'selectedMembers') {
      let { selectedMembers } = newProject;
      const foundIndex = selectedMembers?.findIndex(a => a?.id === value?.id);
      if (foundIndex === -1) {
        selectedMembers.push(value);
      } else {
        selectedMembers = selectedMembers.filter(a => a?.id !== value?.id);
      }
      newProject['selectedMembers'] = selectedMembers;
    } else {
      newProject[field] = value;
    }

    setData(
      combineData(data, {
        newProject,
      }),
    );
  };

  const isSelectedMember = member => {
    let value;
    let { selectedMembers } = data?.newProject;
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
      <Text style={styles.boldText}>Create Project</Text>
      <TextInput
        placeholder="Title"
        placeholderTextColor="gray"
        style={styles.textInput}
        onChangeText={text => handleSetValue('title', text)}
      />
      <TextInput
        placeholder="Description"
        placeholderTextColor="gray"
        style={styles.textInput}
        onChangeText={text => handleSetValue('description', text)}
      />

      {/* <View style={styles.teamSection}>
      <View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={() => addTextInput()} style={styles.btnAdd}>
              <Text style={styles.btnText}>Add Task</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeTextInput()} style={styles.btnAdd}>
              <Text style={styles.btnText}>Remove Task</Text>
            </TouchableOpacity>
          </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          {textInput.map((value) => {
            return value
          })}
        </ScrollView>
      </View>  */}
      {/*
       <TextInput
        placeholder="Task 2"
        placeholderTextColor="gray"
        style={styles.textInput}
        onChangeText={text => handleSetValue('description', text)}
      />
       <TextInput
        placeholder="Task 3"
        placeholderTextColor="gray"
        style={styles.textInput}
        onChangeText={text => handleSetValue('description', text)}
      /> */}

      <View style={styles.teamTextWrapper}>
        <Text style={styles.teamText}>Select Members</Text>
      </View> 
      {
              loader?

            <ActivityIndicator></ActivityIndicator>
            :
      <View style={styles.teamSection}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.teamWrapper}>
           
            {
            
            UserArray?.map(member => (
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
                      if(tempArr[i].select == false)
                      {
                        tempArr[i].select = true
                      }
                      else{
                        tempArr[i].select = false
                      }
                     

                    }
                    console.log(tempArr)
                  }
                  setTimeout(function(){ setLoader(false)}, 200);
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
      <TouchableOpacity onPress={() => createProject()} style={styles.btnWrapper}>
        <Text style={styles.btnText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}
