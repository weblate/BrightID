// @flow

import { NavigationScreenProp } from 'react-navigation';
import { Dispatch } from 'redux';

declare type dispatch = Dispatch;

declare type getState = () => state;

declare type state = { main: Main };

declare type navigation = NavigationScreenProp;

declare type Props = Main & navigation & dispatch;

declare type Main = {
  score: number,
  name: string,
  photo: {
    filename: string,
  },
  groupsCount: number,
  searchParam: string,
  newGroupCoFounders: [],
  eligibleGroups: [],
  currentGroups: [],
  connections: [],
  publicKey: string,
  safePubKey: string,
  secretKey: Uint8Array,
  connectionsSort: string,
  connectQrData: {
    aesKey: string,
    ipAddress: string,
    uuid: string,
    user: string,
    qrString: string,
    channel: string,
  },
  connectUserData: {
    publicKey: string,
    photo: string,
    name: string,
    timestamp: number,
    signedMessage: string,
    score: number,
    secretKey?: Uint8Array,
  },
};

declare type connection = {
  publicKey: string,
  name: string,
  score: number,
  secretKey?: Uint8Array,
  connectionDate: number,
  photo: {
    filename: string,
  },
};

declare type eligibleGroups = {
  isNew: boolean,
  score: number,
  id: string,
  knownMembers: string[],
  founders: string[],
}[];
