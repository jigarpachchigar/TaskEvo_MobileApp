import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import shortid from 'shortid';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from './dashboardStyle';
import { AuthContext } from '../../context';
import database from '@react-native-firebase/database'
import { TabScreenHeader, TaskInfo, EmptyListComponent } from '../../components';
import { formatCurrentDate } from '../../utils/DataHelper';
import appTheme from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';

export function Dashboard() {
  const { state, dispatch } = useContext(AuthContext);
  let { tasks, tasksData, isPM } = state;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [loader, setLoader] = useState(false);
  const [taskarray, setTaskArray] = useState([]);
  const [items, setItems] = useState([
    { label: 'All Tasks', value: 'All Tasks' },
    { label: 'In Process', value: 'In Process' },
    { label: 'Completed', value: 'Completed' },
  ]);
  const getData = async () => {
    setLoader(true)
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

      setLoader(false)
      // setUserArray(userarray)
    });
  }
  const getTasks = () => {
    let tasksToRender = [];
    if (!value || value === 'All Tasks') {
      tasksToRender = tasksData;
    } else if ((value === 'In Process')) {
      tasksToRender = tasksData.filter(data => data.status == "In Process") || [];
    } else if ((value === 'Completed')) {
      tasksToRender =
        tasksData.filter(data => data.status == "Completed") || [];
    }

    return tasksToRender;
  };

  const handleCreateTask = () => {
    dispatch({
      type: 'toggleBottomModal',
      payload: { bottomModal: 'CreateTask' },
    });
  };
  useEffect(() => {
    getData()


  }, [])
  return (
    <SafeAreaView>
      <TabScreenHeader
        leftComponent={() => (
          <View style={styles.flexRow}>
            <Text style={styles.headerLeftText}>{formatCurrentDate()}</Text>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={20}
              color="#000"
            />
          </View>
        )}
        isSearchBtnVisible={true}
        isMoreBtnVisible={true}
      />
      <View style={styles.contentBody}>
        <View style={styles.statisticsSection}>
          <Text style={styles.contentTitle}>Today</Text>
          <View style={styles.statisticsContainer}>
            <View
              style={[
                styles.statisticsContent,
                { backgroundColor: appTheme.PRIMARY_COLOR },
              ]}>
              <FontAwesome
                name="refresh"
                size={17}
                color="#fff"
                style={styles.statisticsIcon}
              />
              <View style={styles.statisticsCounter}>
                <Text style={styles.statisticsValue}>{tasksData?.filter(data => data.status == "Ongoing").length}</Text>
                <Text style={styles.statisticsTitle}>Ongoing</Text>
              </View>
            </View>
            <View
              style={[
                styles.statisticsContent,
                { backgroundColor: appTheme.COLOR1 },
              ]}>
              <Feather
                name="clock"
                size={17}
                color="#fff"
                style={styles.statisticsIcon}
              />
              <View style={styles.statisticsCounter}>
                <Text style={styles.statisticsValue}>{tasksData?.filter(data => data.status == "In Process").length}</Text>
                <Text style={styles.statisticsTitle}>In Process</Text>
              </View>
            </View>
            <View
              style={[
                styles.statisticsContent,
                { backgroundColor: appTheme.COLOR2 },
              ]}>
              <MaterialCommunityIcons
                name="file-check-outline"
                size={19}
                color="#fff"
                style={styles.statisticsIcon}
              />
              <View style={styles.statisticsCounter}>
                <Text style={styles.statisticsValue}>{tasksData?.filter(data => data.status == "Completed").length}</Text>
                <Text style={styles.statisticsTitle}>Completed</Text>
              </View>
            </View>
            <View
              style={[
                styles.statisticsContent,
                { backgroundColor: "#87CEEB" },
              ]}>
              <MaterialCommunityIcons
                name="file-remove-outline"
                size={19}
                color="#fff"
                style={styles.statisticsIcon}
              />
              <View style={styles.statisticsCounter}>
                <Text style={styles.statisticsValue}>{tasksData?.length}</Text>
                <Text style={styles.statisticsTitle}>All</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.tasksSection}>
          <View style={styles.tasksHeader}>
            {/* <TouchableOpacity
              style={styles.tasksRow}
              onPress={() => handleCreateTask()}>
              <Text style={styles.tasksLeftText}>Add Task</Text>
              <View style={styles.plusBtnContainer}>
                <MaterialCommunityIcons name="plus" size={19} color="#fff" />
              </View>
            </TouchableOpacity> */}
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
          {loader ?
            <ActivityIndicator></ActivityIndicator>
            :
            <View>{
              getTasks()?.length > 0 ? (
                <View style={styles.tasksBody}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.tasksList}>
                      {getTasks().map(task => (
                        <TaskInfo task={task}
                          cancel={(id) => {
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
                          }} key={shortid.generate()} />
                      ))}
                    </View>
                  </ScrollView>
                </View>)
                : (
                  <EmptyListComponent />
                )}
            </View>
          }
        </View>
      </View>
    </SafeAreaView>
  );
}
