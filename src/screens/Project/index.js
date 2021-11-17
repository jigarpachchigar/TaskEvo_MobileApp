import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressCircle from 'react-native-progress-circle';
import shortid from 'shortid';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from './projectStyle';
import { TabScreenHeader, EmptyListComponent, TaskInfo } from '../../components';
import { combineData } from '../../utils/DataHelper';
import { AuthContext } from '../../context';
import appTheme from '../../constants/colors';
import database from '@react-native-firebase/database'
export function Project({ navigation, route, props }) {
  const project = route.params;
  const { state, dispatch } = useContext(AuthContext);
  const { tasks,isPM,tasksData } = state;

  const [isRefreshing, setIsRefreshing] = useState(false)
  const tabs = ['Task List', 'File', 'Comments'];

  const [data, setData] = useState({
    activeTab: 'Task List',
  });
  const [taskarray, setTaskArray] = useState([]);
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'All Tasks', value: 'All Tasks' },
    { label: 'In', value: 'Ongoing' },
    { label: 'Completed', value: 'Completed' },
  ]);


  const getTasks = () => {
    let tasksToRender = [];
    if (!value || value === 'All Tasks') {




      tasksToRender = tasksData;
    } else if (value === 'Ongoing') {
      tasksToRender = tasksData.filter(task => task.progress < 100) || [];
    } else if (value === 'Completed') {
      tasksToRender = tasksData.filter(task => task.progress === 100) || [];
    }

    return tasksToRender;
  };

  const handleBackButton = () => {
    navigation?.goBack();
  };

  const toggleTab = tab => {

    setData(combineData(data, { activeTab: tab }));
  };

  const isActiveTab = tab => {
    const value = data?.activeTab === tab;
    return value;
  };

  const handleCreateTask = () => {
    dispatch({
      type: 'toggleBottomModal',
      payload: { bottomModal: 'CreateTask' },
    });
    dispatch({
      type: 'selectData',
      payload: { selectedProject: project },
    });
  };
  const getData = () => {
    setLoader(true)
    var recentPostsRef = database().ref('/Task');
    var Taskarray = []
    recentPostsRef.once('value').then((snapshot) => {

      snapshot.forEach((childSnap) => {
        var selmem = []
        childSnap.val().selectedMembers.forEach((childSnap1) => {
          console.log("111dsdsds", childSnap1)
          selmem.push(childSnap1.toString())
        });
        Taskarray.push({ per: (childSnap.val().per).toString(), projectName: (childSnap.val().projectName).toString(), id: childSnap.key.toString(), title: (childSnap.val().title).toString(), description: (childSnap.val().description).toString(), selectedMembers: selmem, cdate: (childSnap.val().cdate).toString(), status: (childSnap.val().status).toString(), sdate: (childSnap.val().sdate).toString(),edate: (childSnap.val().edate).toString(),hourWorked:(childSnap.val().hourWorked).toString() })
      });
      setTaskArray(Taskarray.filter(i => i.projectName == project?.title))
      dispatch({
        type: 'taskData',
        payload: { tasksData: Taskarray.filter(i => i.projectName == project?.title) },
      });
      setLoader(false)
      // setUserArray(userarray)
    });
  }
  useEffect(() => {
    getData()


  }, [])
  const handleChangeTaskStatus = value => { };

  return (
    <SafeAreaView style={styles.container}>
      <TabScreenHeader
        leftComponent={() => (
          <TouchableOpacity
            onPress={() => handleBackButton()}
            style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={25} color="#000" />
          </TouchableOpacity>
        )}
        isSearchBtnVisible={true}
        isMoreBtnVisible={true}
      />
      <View>
        <View style={styles.projectDetailsSection}>
          <View style={styles.projectTitleWrapper}>
            <Text style={styles.projectTitle}>{project?.title}</Text>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={20}
                color="#000"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.projectDescription}>{project?.description}</Text>
          <View style={styles.projectTeamAndProgress}>
            {/* <View style={styles.projectProgressWrapper}>
              <ProgressCircle
                percent={project?.progress}
                radius={50}
                borderWidth={10}
                color="#6AC67E"
                shadowColor="#f4f4f4"
                bgColor="#fff">
                <Text style={styles.projectProgress}>{project?.progress}%</Text>
              </ProgressCircle>
            </View> */}
            <View>
              <Text style={styles.projectTeamTitle}>Team</Text>
              <View style={styles.projectTeamWrapper}>
                {project?.selectedMembers?.map(member => (
                  <View>
                    <Image
                      key={shortid.generate()}
                      style={styles.projectMemberPhoto}
                      source={require('../../assets/user.png')}
                    />
                    <Text style={{ fontSize: 10 }}>{member}</Text>
                  </View>
                ))}
                <TouchableOpacity style={styles.plusBtnContainer}>
                  <MaterialCommunityIcons name="plus" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text style={styles.projectStatus}>{project?.status}</Text>
        </View>
        <View style={styles.projectBody}>
          <View style={styles.projectTabs}>
            {tabs?.map(tab => (
              <TouchableOpacity
                style={[
                  styles.projectTab,
                  isActiveTab(tab) ? styles.activeProjectTab : null,
                ]}
                onPress={() => toggleTab(tab)}
                key={shortid.generate()}>
                <Text
                  style={[
                    styles.projectTabText,
                    isActiveTab(tab)
                      ? styles.activeProjectTabText
                      : styles.inActiveProjectTabText,
                  ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {data?.activeTab === 'Task List' ? (
            <>
              <View style={styles.tasksHeader}>
                {
                  isPM == "Project Manager"?
               
                <TouchableOpacity
                  style={styles.tasksRow}
                  onPress={() => handleCreateTask()}>
                  <Text style={styles.tasksLeftText}>Add Task</Text>
                  <View style={styles.plusBtnContainer2}>
                    <MaterialCommunityIcons
                      name="plus"
                      size={19}
                      color="#fff"
                    />
                  </View>
                </TouchableOpacity>:
                null}
                <DropDownPicker
                  placeholder="All Tasks"
                  placeholderStyle={{ fontSize: 15 }}
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  containerStyle={{
                    width: 130,
                  }}
                  style={{
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: '#fff',
                    borderColor: 'transparent',
                  }}
                  labelStyle={{
                    fontSize: 15,
                  }}
                />
              </View>

              {/* {

                loader?
                <ActivityIndicator>

                </ActivityIndicator>:
                <FlatList  
                data={taskarray}  
                renderItem={({item}) =>  
               <View>
                 <Text>{item.title}</Text>
               </View>}  
               
            />  
              } */}
              {

                loader ?
                  <ActivityIndicator>

                  </ActivityIndicator> :
                  <View style={styles.bottomContainer}>

                    <View style={styles.bottomContent}>
                      <FlatList
                        data={getTasks()}
                        onRefresh={getData}
                        refreshing={isRefreshing}
                        renderItem={({ item }) =>
                          <TaskInfo prop={props} cancel={(id) => {
                            database().ref("Task").child(id).update({ 'status': "In Process", per: 50 })
                            getData()
                            alert("Task In Process")
                          }}
                            complete={(id) => {
                              database().ref("Task").child(id).update({ 'status': "Completed", per: 100 })
                              getData()
                              alert("Task Completed")
                            }} delete={(id) => {

                              database().ref("Task").child(id).remove();
                              getData()
                            }} task={item} key={shortid.generate()} />}

                      />



                    </View>

                  </View>
              }
            </>
          ) : data?.activeTab === 'File' ? (
            <></>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}
