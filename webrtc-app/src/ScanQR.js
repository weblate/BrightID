// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { resetUserBStore, setUserBRtcId, setUserBArbiter } from './actions';
import {
  fetchArbiter,
  update,
  ZETA,
  ANSWER,
  ICE_CANDIDATE,
  ICE_SERVERS,
} from './webrtc';
import logging from './utils/logging';
import { socket } from './websockets';
import Chat from './Chat';

type Props = {
  dispatch: Function,
};

class ScanQR extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      connecting: true,
      // iceCandidates: [],
    };
    this.connection = null;
    this.channel = null;
    this.socket = null;
  }

  async componentDidUpdate(prevProps) {
    const { arbiter } = this.props;
    // set ice candidate
    if (
      this.connection &&
      this.connection.remoteDescription &&
      arbiter &&
      arbiter.ALPHA.ICE_CANDIDATE &&
      (arbiter.ALPHA.ICE_CANDIDATE.candidate !==
        prevProps.arbiter.ALPHA.ICE_CANDIDATE.candidate ||
        arbiter.ALPHA.ICE_CANDIDATE.sdpMLineIndex !==
          prevProps.arbiter.ALPHA.ICE_CANDIDATE.sdpMLineIndex ||
        arbiter.ALPHA.ICE_CANDIDATE.sdpMid !==
          prevProps.arbiter.ALPHA.ICE_CANDIDATE.sdpMid)
    ) {
      await this.connection.addIceCandidate(
        new RTCIceCandidate(arbiter.ALPHA.ICE_CANDIDATE),
      );
      // might implement in the future if ice candidate errors continue
      // if (
      //   this.connection &&
      //   this.connection.remoteDescription &&
      //   arbiter &&
      //   arbiter.ALPHA.ICE_CANDIDATE
      // ) {
      //   console.log(`setting ice candidates ${arbiter.ALPHA.ICE_CANDIDATE}`);
      //   await Promise.all(
      //     arbiter.ALPHA.ICE_CANDIDATE.map((val) =>
      //       this.connection.addIceCandidate(new RTCIceCandidate(val)),
      //     ),
      //   );
    }
  }

  componentWillUnmount() {
    // close and remove webrtc connection
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    // close data channel and remove
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    // disconnect and remove socket
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    const { dispatch } = this.props;
    dispatch(resetUserBStore());
  }

  setRtcDescription = async (offer) => {
    try {
      const { dispatch } = this.props;
      // set remote description
      await this.connection.setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      // create answer
      const answer = await this.connection.createAnswer();
      // set local description
      await this.connection.setLocalDescription(answer);
      // send answer to signal server
      await dispatch(update({ person: ZETA, type: ANSWER, value: answer }));
    } catch (err) {
      console.log(err);
    }
  };

  initiateWebrtc = async (rtcId) => {
    try {
      const { dispatch } = this.props;
      // set rtc token
      await dispatch(setUserBRtcId(rtcId));
      // create webrtc peer connection
      this.connection = new RTCPeerConnection(ICE_SERVERS);
      logging(this.connection, 'UserB');
      window.cb = this.connection;
      // handle ice
      this.connection.onicecandidate = this.updateIce;
      // create data channel
      this.connection.ondatachannel = this.updateChannel;
      // disconnect if ice connection fails
      this.connection.oniceconnectionstatechange = this.handleIce;
      // send ice candidates when done collecting
      // this.connection.onicegatheringstatechange = this.sendIce;
      // fetch dispatcher
      const arbiter = await dispatch(fetchArbiter());
      // return if error or no offer
      if (arbiter.error || !arbiter.ALPHA.OFFER) return;
      // set rtc description with offer
      this.setRtcDescription(arbiter.ALPHA.OFFER);
      // initiate websockets
      this.initiateWebSocket(rtcId);
    } catch (err) {
      console.log(err);
    }
  };

  initiateWebSocket = (rtcId) => {
    // fetch initial rtc id from signaling server
    const { dispatch } = this.props;
    // join websocket room
    this.socket = socket();
    this.socket.emit('join', rtcId);
    // subscribe to update event
    this.socket.on('update', (arbiter) => {
      // update redux store
      console.log('socket io update user B');
      console.log(arbiter);
      dispatch(setUserBArbiter(arbiter));
    });
  };

  updateChannel = (event) => {
    if (event.channel) {
      this.channel = event.channel;
      this.channel.onopen = () => {
        console.log('user B channel opened');
        this.setState({
          connecting: false,
        });
      };
      this.channel.onclose = () => {
        console.log('user B channel closed');
        this.setState({
          connecting: true,
        });
      };
      // this.channel.onmessage = (e) => {
      //   console.log(`user A recieved message ${e.data}`);
      //   console.log(e);
      // };
    }
  };

  updateIce = async (e) => {
    try {
      const { dispatch } = this.props;
      // const { iceCandidates } = this.state;
      if (e.candidate) {
        /**
         * update the signaling server arbiter with ice candidate info
         * @param person = ZETA
         * @param type = ICE_CANDIDATE
         * @param value = e.candidate
         */

        dispatch(
          update({
            person: ZETA,
            type: ICE_CANDIDATE,
            value: e.candidate,
          }),
        );
        // might implement in the future
        // this.setState({
        //   iceCandidates: [...iceCandidates, e.candidate],
        // });
        console.log(e.candidate);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  sendIce = () => {
    // const { dispatch } = this.props;
    // const { iceCandidates } = this.state;
    if (this.connection)
      console.log(`ice gathering state: `, this.connection.iceGatheringState);
    // send array instead of string value
    // if (this.connection.iceGatheringState === 'complete') {
    //   dispatch(
    //     update({
    //       person: ZETA,
    //       type: ICE_CANDIDATE,
    //       value: iceCandidates,
    //     }),
    //   );
    // }
  };

  handleIce = () => {
    if (this.connection) {
      const { iceConnectionState } = this.connection;
      console.log(`user b ice connection state ${iceConnectionState}`);
      if (
        iceConnectionState === 'failed' ||
        iceConnectionState === 'disconnected' ||
        iceConnectionState === 'closed'
      ) {
        this.setState({
          connecting: true,
        });
      }
    }
  };

  renderDefault = () => (
    <div>
      <div className="scan-text">copy / paste the qrcode</div>
      <div className="qr-input">
        <input
          type="text"
          className="form-control"
          placeholder="place id here"
          onChange={(e) => {
            if (e.target.value.trim().length === 21) {
              // initiate webrtc with rtc token
              this.initiateWebrtc(e.target.value.trim());
            }
          }}
        />
      </div>
    </div>
  );

  render() {
    const { connecting } = this.state;
    return (
      <div className="qrcode-screen">
        {connecting ? (
          this.renderDefault()
        ) : (
          <Chat user="UserB" channel={this.channel} {...this.props} />
        )}
      </div>
    );
  }
}

export default connect((s) => s.userB)(ScanQR);