import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import shortid from 'shortid';
import styles from './membersStyle';
import appTheme from '../../constants/colors';
import {TabScreenHeader, EmptyListComponent} from '../../components';
import {AuthContext} from '../../context';
import {navigate} from '../../navigators/RootNavigation';
import {getScreenParent} from '../../utils/NavigationHelper';

export function Members() {
  const {state, dispatch} = useContext(AuthContext);
  const {members} = state;

  const handleNavigation = (screen, params) => {
    navigate( screen, params);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TabScreenHeader
        leftComponent={() => <Text style={styles.headerTitle}>App Info</Text>}
        isSearchBtnVisible={false}
        isMoreBtnVisible={true}
      />
      <ScrollView>
      <Text style={{margin:20}}>
      What is Smart Task Management?

      </Text>

      <Text style={{margin:20}}>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.


      </Text>
      <Text style={{margin:20}}>
      Why do we use it?

      </Text>

      <Text style={{margin:20}}>
      It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).

      </Text>
      </ScrollView>
      {/* {members?.length ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.membersWrapper}>
            {members.map(member => (
              <TouchableOpacity
                style={styles.singleMember}
                onPress={() => handleNavigation('Chat', member)}
                key={shortid.generate()}>
                <Image
                  style={styles.singleMemberPhoto}
                  source={{
                    uri: member?.photo,
                  }}
                />
                <View style={styles.singleMemberInfo}>
                  <Text
                    style={styles.selectedMemberName}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {member?.name}
                  </Text>
                  <Text style={styles.selectedMemberLastSeen}>
                    {member?.designation}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="message"
                  size={17}
                  color={appTheme.PRIMARY_COLOR}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <EmptyListComponent />
      )} */}
    </SafeAreaView>
  );
}
