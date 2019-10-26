// @flow

import * as React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import moment from 'moment';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import emitter from '../../emitter';
import { toggleTrustedConnection } from '../../actions/backup.js';

class TrustedConnectionCard extends React.PureComponent<Props> {
  handleConnectionSelect = () => {
    console.log('pressed');
    let { toggleConnection, publicKey } = this.props;
    toggleConnection(publicKey);
  };

  scoreColor = () => {
    const { score } = this.props;
    if (score >= 85) {
      return { color: '#139c60' };
    } else {
      return { color: '#e39f2f' };
    }
  };

  renderActionButton = () => {
    const { selected } = this.props;
    return (
      <TouchableOpacity
        style={styles.moreIcon}
        onPress={this.handleConnectionSelect}
      >
        <AntDesign
          size={30.4}
          name={selected ? 'checkcircle' : 'checkcircleo'}
          color="#000"
        />
      </TouchableOpacity>
    );
  };

  render() {
    const { photo, name, score, connectionDate, style } = this.props;

    return (
      <View style={{ ...styles.container, ...style }}>
        <Image
          source={{
            uri: `file://${RNFS.DocumentDirectoryPath}/photos/${
              photo.filename
            }`,
          }}
          style={styles.photo}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLeft}>Score:</Text>
            <Text style={[styles.scoreRight, this.scoreColor()]}>{score}</Text>
          </View>
          <Text style={styles.connectedText}>
            Connected {moment(parseInt(connectionDate, 10)).fromNow()}
          </Text>
        </View>
        {this.renderActionButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    height: 94,
    marginBottom: 11.8,
    shadowColor: 'rgba(0,0,0,0.32)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.43,
    shadowRadius: 4,
  },
  photo: {
    borderRadius: 30,
    width: 60,
    height: 60,
    marginLeft: 14,
  },
  info: {
    marginLeft: 25,
    flex: 1,
    height: 71,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  name: {
    fontFamily: 'ApexNew-Book',
    fontSize: 20,
    shadowColor: 'rgba(0,0,0,0.32)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  scoreLeft: {
    fontFamily: 'ApexNew-Book',
    fontSize: 14,
    color: '#9b9b9b',
    marginRight: 3,
    paddingTop: 1.5,
  },
  scoreRight: {
    fontFamily: 'ApexNew-Medium',
    fontSize: 16,
  },
  connectedText: {
    fontFamily: 'ApexNew-Book',
    fontSize: 12,
    color: '#aba9a9',
    fontStyle: 'italic',
  },
  moreIcon: {
    marginRight: 16,
  },
});

export default connect(
  null,
  (dispatch) => ({
    toggleConnection: (publicKey) =>
      dispatch(toggleTrustedConnection(publicKey)),
  }),
)(TrustedConnectionCard);
