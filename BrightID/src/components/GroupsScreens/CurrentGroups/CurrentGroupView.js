// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import Spinner from 'react-native-spinkit';
import { connect } from 'react-redux';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionSheet from 'react-native-actionsheet';
import MemberCard from './MemberCard';
import { getMembers } from '../../../actions/getMembers';
import api from '../../../Api/BrightId';
import SearchMembers from './SearchMembers';
import GroupPhoto from './GroupPhoto';
import emitter from '../../../emitter';
import { leaveGroup } from '../../../actions';

type State = {
  loading: boolean,
  members: string[],
};

export class CurrentGroupView extends Component<Props, State> {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    loading: true,
    members: [],
  };

  static navigationOptions = ({ navigation }: { navigation: navigation }) => {
    const { group } = navigation.state.params;
    return {
      title: group.name,
      headerTitleStyle: { fontSize: 16 },
      headerBackTitleVisible: false,
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 11 }}
          onPress={() => {
            emitter.emit('optionsSelected');
          }}
        >
          <Material name="dots-horizontal" size={32} color="#fff" />
        </TouchableOpacity>
      ),
    };
  };

  showOptionsMenu = () => {
    this.actionSheet.show();
  };

  componentDidMount() {
    const { navigation } = this.props;
    emitter.on('optionsSelected', this.showOptionsMenu);
    navigation.addListener('didFocus', this.getMembers);
  }

  componentWillUnmount() {
    emitter.off('optionsSelected', this.showOptionsMenu);
  }

  confirmDismiss = (user) => {
    const buttons = [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          const { navigation, dispatch } = this.props;
          const groupId = navigation.state.params.group.id;
          try {
            await api.dismiss(user.id, groupId);
            navigation.goBack();
          } catch (err) {
            Alert.alert('Error leaving group', err.message);
          }
        },
      },
    ];
    Alert.alert(
      `Leave Group`,
      `Are you sure you want to dismiss ${user.name} from this group?`,
      buttons,
      {
        cancelable: true,
      },
    );
  };

  performAction = (action) => {
    if (!this.actionSheet) return;
    action = this.actionSheet.props.options[action];
    if (action === 'Leave Group') {
      this.confirmLeaveGroup();
    } else if (action === 'Invite') {
      const { navigation } = this.props;
      navigation.navigate('InviteList', {
        group: navigation.state.params.group,
      });
    }
  };

  confirmLeaveGroup = () => {
    const buttons = [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          const { navigation, dispatch } = this.props;
          const groupId = navigation.state.params.group.id;
          try {
            await api.leaveGroup(groupId);
            await dispatch(leaveGroup(groupId));
            navigation.goBack();
          } catch (err) {
            Alert.alert('Error leaving group', err.message);
          }
        },
      },
    ];
    Alert.alert(
      `Leave Group`,
      `Are you sure you want to leave this group?`,
      buttons,
      {
        cancelable: true,
      },
    );
  };

  filterMembers = () => {
    const { searchParam } = this.props;
    const searchString = searchParam.toLowerCase().replace(/\s/g, '');
    return this.state.members.filter((item) =>
      `${item.name}`
        .toLowerCase()
        .replace(/\s/g, '')
        .includes(searchString),
    );
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  renderMember = ({ item }) => {
    const { group } = this.props.navigation.state.params;
    const isAdmin = group.admins.includes(item.id);
    const handler = isAdmin ? null : this.confirmDismiss;
    return (
      <MemberCard {...item} menuHandler={handler}/>
    );
  };

  renderListOrSpinner() {
    const { loading } = this.state;
    const { group } = this.props.navigation.state.params;
    if (loading) {
      return (
        <Spinner
          style={styles.spinner}
          isVisible={true}
          size={47}
          type="WanderingCubes"
          color="#4990e2"
        />
      );
    } else {
      return (
        <View>
          <GroupPhoto group={group} radius={35} />
          <Text style={styles.groupName}>{group.name}</Text>
          <FlatList
            style={styles.membersContainer}
            data={this.filterMembers()}
            keyExtractor={({ id }, index) => id + index}
            renderItem={this.renderMember}
          />
        </View>
      );
    }
  }

  getMembers = async () => {
    const { dispatch, navigation } = this.props;
    const groupId = navigation.state.params.group.id;
    const members = await dispatch(getMembers(groupId));
    this.setState({
      loading: false,
      members,
    });
  };

  render() {
    const { navigation, id } = this.props;
    const { loading } = this.state;
    const { group } = this.props.navigation.state.params;
    let actions = ['Leave Group', 'cancel'];
    if (group.admins && group.admins.includes(id)) {
      actions = ['Invite'].concat(actions);
    }
    return (
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <SearchMembers navigation={navigation} />
          <View style={styles.mainContainer}>{this.renderListOrSpinner()}</View>
        </View>
        <ActionSheet
          ref={(o) => {
            this.actionSheet = o;
          }}
          title="What do you want to do?"
          options={actions}
          cancelButtonIndex={actions.indexOf('cancel')}
          destructiveButtonIndex={actions.indexOf('Leave Group')}
          onPress={(index) => this.performAction(index)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  membersContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 8,
  },
  moreIcon: {
    marginRight: 16,
  },
  groupName: {
    fontFamily: 'ApexNew-Book',
    fontSize: 28,
    shadowColor: 'rgba(0,0,0,0.32)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    textAlign: 'center',
  },
  optionsOverlay: {
    backgroundColor: 'rgba(62,34,24,0.4)',
  },
  optionsContainer: {
    backgroundColor: '#fdfdfd',
    height: '12%',
    width: '105%',
    borderRadius: 5,
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fdfdfd',
    position: 'absolute',
    top: -18,
    right: 20,
  },
  optionsBox: {
    flexDirection: 'row',
    width: '90%',
    height: '70%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  leaveGroupText: {
    fontFamily: 'ApexNew-Book',
    fontSize: 24,
    marginLeft: 30,
  },
});

export default connect((state) => state)(CurrentGroupView);
