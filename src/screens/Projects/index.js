import React, {useState, useContext,useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator
} from 'react-native';
import shortid from 'shortid';
import styles from './projectsStyle';
import {AuthContext} from '../../context';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import {
  TabScreenHeader,
  ProjectCard,
  EmptyListComponent,
} from '../../components';
import {combineData} from '../../utils/DataHelper';
import database from '@react-native-firebase/database'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export function Projects({navigation}) {
  const tabs = ['All', 'Ongoing', 'Completed'];
  const [isLoading, setisLoading] = useState(false);
  const {state, dispatch} = useContext(AuthContext);
  const {projectsData,isPM} = state;
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [data, setData] = useState({activeTab: 'All'});
  const [Allproject, setAllproject] = useState([]);
  const toggleTab = tab => {
    setData(combineData(data, {activeTab: tab}));
  };

  const isActiveTab = tab => {
    const value = data?.activeTab === tab;
    return value;
  };
  const onRefresh = async() => {
    //set isRefreshing to true
    setisLoading(true)
    var valid = false 
    var recentPostsRef = database().ref('/Project');
    var userarray = []
    const value = await AsyncStorage.getItem('UserName')
    recentPostsRef.once('value').then((snapshot) => {
      if(isPM == 'Project Manager'){
        snapshot.forEach((childSnap) => {
          var selmem = []
           childSnap.val().selectedMembers.forEach((childSnap1) => {
               console.log("111dsdsds",childSnap1)
               selmem.push(childSnap1.toString())
              
           });
         
             userarray.push({ id: childSnap.key.toString(),title: (childSnap.val().title).toString(), description: (childSnap.val().description).toString(),selectedMembers: selmem,cdate:(childSnap.val().cdate).toString(),status:(childSnap.val().status).toString()})
             valid = false
           
         }); 
      }else{ snapshot.forEach((childSnap) => {
        var selmem = []
         childSnap.val().selectedMembers.forEach((childSnap1) => {
             console.log("111dsdsds",childSnap1)
             selmem.push(childSnap1.toString())
             if(childSnap1.toString()==value){
               valid = true
             }
         });
         if(valid == true){
           userarray.push({ id: childSnap.key.toString(),title: (childSnap.val().title).toString(), description: (childSnap.val().description).toString(),selectedMembers: selmem,cdate:(childSnap.val().cdate).toString(),status:(childSnap.val().status).toString()})
           valid = false
         }
       });
        
      }
     
      dispatch({
        type: 'projectData',
        payload: { projectsData: userarray },
      });
     setAllproject(userarray)
     setisLoading(false)
      // setUserArray(userarray)
    });
    // and set isRefreshing to false at the end of your callApiMethod()
}
  useEffect(() => {

    
    onRefresh()


  }, [])

  const getProjects = () => {
    let {activeTab} = data;
    let projectsToRender = [];
    if (activeTab === 'All') {
      projectsToRender = projectsData;
    } else if (activeTab === 'Ongoing'){
      projectsToRender =projectsData.filter(data => data.status == "Ongoing")
         || [];
    } else if (activeTab === 'Completed'){
      projectsToRender =projectsData.filter(data => data.status == "Completed")
         || [];
    } 

    return projectsToRender;
  };

  const renderProjectInfo = ({item}) => {
    return (
      <ProjectCard
        delete={(id)=>{
          database().ref("Project").child(id).remove();
          alert("Task Deleted")
          onRefresh()
        }}
        complete={(id) => {
          database().ref("Project").child(id).update({ 'status': "Completed"  })
          onRefresh()
          alert("Task Completed")
        }}
        project={item}
        key={shortid.generate()}
        navigation={navigation}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TabScreenHeader
        leftComponent={() => <Text style={styles.headerTitle}>Projects</Text>}
        isSearchBtnVisible={true}
        isMoreBtnVisible={true}
      />
      <View style={styles.projectsBody}>
        <View style={styles.projectsTabs}>
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
        {isLoading?
   
      
        <ActivityIndicator size="large" color="#9E9E9E"/>
          :
          <View>
        {projectsData?.length > 0 ? (
          <View style={{height:hp('70%'),width:'100%'}}>
          <FlatList
            data={getProjects()}
            keyExtractor={(item, index) => shortid.generate()}
            renderItem={renderProjectInfo}
            horizontal={false}
            onRefresh={onRefresh}
        refreshing={isRefreshing}
            showsVerticalScrollIndicator={false}
          />
          </View>
        ) : (
          <EmptyListComponent />
        )}
        </View>
}
      </View>
    </SafeAreaView>
  );
}
