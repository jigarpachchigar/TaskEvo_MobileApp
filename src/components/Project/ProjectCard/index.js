import React,{useContext} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProgressCircle from 'react-native-progress-circle';
import shortid from 'shortid';
import styles from './projectCardStyle';
import { AuthContext } from '../../../context';
import appTheme from '../../../constants/colors';
import {navigate} from '../../../navigators/RootNavigation';
import {getScreenParent} from '../../../utils/NavigationHelper';

export function ProjectCard(props,{project, navigation}) {

  const { state, dispatch } = useContext(AuthContext);
  let { isPM } = state;
  const handleNavigation = (screen, params) => {
    navigate( screen, params);
  };

  return (
    <View
      style={styles.container}
      onPress={() => handleNavigation('Project', project)}>
      <Text style={styles.projectTitle}>{props.project?.title}</Text>
      <View style={styles.projectTeamAndProgress}>
        <View>
          <Text numberOfLines={1} style={styles.projectDescription}>{props.project?.description}</Text>
          <Text style={styles.projectTeamTitle}>Team</Text>
          <View style={styles.projectTeamWrapper}>
            {props.project?.selectedMembers?.map(member => (
              <View>
              <Image
                key={shortid.generate()}
                style={styles.projectMemberPhoto}
                source={require('../../../assets/user.png')}
              />
              <Text style={{fontSize:10}}>{member}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.plusBtnContainer}>
              <MaterialCommunityIcons name="plus" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {/* <ProgressCircle
          percent={props.project?.progress}
          radius={40}
          borderWidth={8}
          color="#6AC67E"
          shadowColor="#f4f4f4"
          bgColor="#fff">
          <Text style={styles.projectProgress}>{props.project?.progress}%</Text>
        </ProgressCircle> */}
      </View>
      <View style={styles.rowJustifyBetween}>
        <View style={styles.flexRow}>
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={20}
            color={appTheme.INACTIVE_COLOR}
          />
          <Text style={styles.projectBottomText}>{props.project?.cdate}</Text>
        </View>
        <TouchableOpacity onPress={() => handleNavigation('Project', props.project)} >
        <MaterialIcons
            name="unfold-more"
            size={20}
            color={appTheme.INACTIVE_COLOR}
          />
          </TouchableOpacity>
          {isPM == "Project Manager" ?   <View style={styles.rowJustifyBetween}>
          <TouchableOpacity  style={{marginRight:20}} onPress={()=>props.complete(props.project?.id)}>
          <View style={styles.flexRow}>
            
          <MaterialCommunityIcons
            name="checkbox-marked"
            size={20}
            color={props.project?.status == "Completed"  ? appTheme.COLOR2 :props.project?.status == "In Process" ? appTheme.COLOR1 : "grey"}
          />
          <Text style={styles.projectBottomText}>{props.project?.tasks} Tasks</Text>
        </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={{marginRight:20}} onPress={()=>
          {
           
           props.delete(props.project?.id)
            }}>
          <MaterialCommunityIcons
            name="delete"
            size={20}
            color={"red"}
          />
      </TouchableOpacity>
      </View>
          
          :
          null}
      </View>
    </View>
  );
}
