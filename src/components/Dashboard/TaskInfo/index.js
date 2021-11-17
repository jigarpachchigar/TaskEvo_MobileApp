import React, { useContext, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Image, Touchable } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ProgressBar } from 'react-native-paper';
import shortid from 'shortid';
import Feather from 'react-native-vector-icons/Feather';
import styles from './taskInfoStyle';
import appTheme from '../../../constants/colors';
import { AuthContext } from '../../../context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import database from '@react-native-firebase/database'
import moment from 'moment';

export function TaskInfo(props,{ task }) {
  const { state, dispatch } = useContext(AuthContext);
  let { isPM } = state;
 const [select,setSelect] = useState(false);
  const handleBottomModal = () => {
    dispatch({
      type: 'toggleBottomModal',
      payload: { bottomModal: 'TaskView' },
    });

    dispatch({
      type: 'viewTask',
      payload: { selectedTask: props.task },
    });
  };

  return (

    <View >
      <View style={styles.container}>
      {
          isPM == "Project Manager"?
        <TouchableOpacity onPress={()=>props.complete(props.task?.id)}>
        <AntDesign
          name="checksquareo"
          size={20}
          color={
            props.task?.status == "Completed"  ? appTheme.COLOR2 :props.task?.status == "In Process" ? appTheme.COLOR1 : "grey"
          }
          style={styles.taskProgressIndicator}
        />
        </TouchableOpacity>
        :
        <AntDesign
          name="checksquareo"
          size={20}
          color={
            props.task?.status == "Completed"  ? appTheme.COLOR2 :props.task?.status == "In Process" ? appTheme.COLOR1 : "grey"
          }
          style={styles.taskProgressIndicator}
        />
}
        <View style={styles.taskMiddleColumn}>
          <Text style={styles.taskTitle} numberOfLines={1} ellipsizeMode="tail">
            { props.task?.title}
          </Text>
          <Text style={styles.taskTitle} numberOfLines={1} ellipsizeMode="tail">
            {moment(props.task?.sdate).format("MMM DD")} - {moment(props.task?.edate).format("MMM DD")}
          </Text>
          {/* <ProgressBar
            progress={Number(task?.progress)}
            color={task?.progress === 100 ? appTheme.COLOR2 : appTheme.COLOR1}
            style={styles.taskProgressBar}
          /> */}
        </View>
        <View style={styles.teamWrapper}>
          { props.task?.selectedMembers?.slice(0, 2)?.map(member => (
            <View>
            <Image
              key={shortid.generate()}
              style={styles.memberPhoto}
              source={require('../../../assets/user.png')}
            />
            <Text>{member}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity onPress={() => handleBottomModal()}>
          <MaterialIcons
            name="unfold-more"
            size={25}
            color={"grey"}
          />
        </TouchableOpacity>
        {
          isPM == "Project Manager"?
           <View style={{flexDirection:'row'}}>
        <TouchableOpacity onPress={() => {
          // database().ref("Task").child(task?.id).remove();
          props.cancel(props.task?.id)
        //  props.delete(props.task?.id)
        }}>
         <Feather
                name="clock"
                size={25}
                color={appTheme.COLOR1}
                style={styles.statisticsIcon}
              />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          // database().ref("Task").child(task?.id).remove();
         
          props.delete(props.task?.id)
        }}>
          <MaterialIcons
            name="delete-forever"
            size={25}
            color={"red"}
          />
        </TouchableOpacity>
        </View>
        :
        null
      }
      </View>
    </View>
  );
}
