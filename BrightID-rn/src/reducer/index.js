// @flow

import { combineReducers } from 'redux';
// reducer/web3.js

import {
  TRUST_SCORE,
  GROUPS_COUNT,
  SEARCH_PARAM,
  ALL_CONNECTIONS,
  SAVE_DATA_SUCCESS,
  LOADING_USER,
  USER_DATA,
  REMOVE_USER_DATA,
  USER_AVATAR,
  REFRESH_NEARBY_PEOPLE,
  PUBLICKEY2,
} from '../actions';

// immutable js optional, but works really well with redux

// import { fromJS } from "immutable";

/**
 * INITIAL STATE
 * structure the state of tha app here
 *
 * @param trustScore String
 * @param name String
 * @param userAvatar Image
 * @param groupsCount Number
 * @param searchParam String
 * @param allConnections List => Map
 */

const initialState = {
  trustScore: '',
  name: '',
  userAvatar: '',
  groupsCount: 0,
  searchParam: '',
  allConnections: [{ name: 'Rand Paul' }],
  ronPaul: '',
  savingData: false,
  saveDataSuccess: false,
  nearbyPeople: [],
  publicKey: '',
  secretKey: '',
  publicKey2: '',
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case TRUST_SCORE:
      return {
        ...state,
        trustScore: action.payload,
      };
    case LOADING_USER:
      return {
        ...state,
        loadingUser: true,
      };
    case USER_DATA:
      return {
        ...state,
        userAvatar: action.avatarUri,
        name: action.nameornym,
        publicKey: action.publicKey,
        secretKey: action.secretKey,
        loadingUser: false,
      };
    case GROUPS_COUNT:
      return {
        ...state,
        groupsCount: action.payload,
      };
    case SEARCH_PARAM:
      return {
        ...state,
        searchParam: action.value,
      };
    case ALL_CONNECTIONS:
      return {
        ...state,
        allConnections: action.connections,
      };
    case USER_AVATAR:
      return {
        ...state,
        userAvatar: action.avatarUri,
      };
    case SAVE_DATA_SUCCESS:
      return {
        ...state,
        userAvatar: action.avatarUri,
        name: action.nameornym,
        publicKey: action.publicKey,
        secretKey: action.secretKey,
        savingData: false,
      };
    case REMOVE_USER_DATA:
      return {
        ...state,
        avatarUri: '',
        name: '',
        publicKey: '',
        secretKey: '',
      };
    case REFRESH_NEARBY_PEOPLE:
      return {
        ...state,
        nearbyPeople: action.nearbyPeople,
      };
    case PUBLICKEY2:
      return {
        ...state,
        publicKey2: action.publicKey2,
      };
    default:
      return state;
  }
};

// unnecessary for now, but when the app gets larger, combine reducers here

const reducer = combineReducers({
  main: mainReducer,
});

export default reducer;