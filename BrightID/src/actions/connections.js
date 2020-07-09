// @flow

export const SET_CONNECTIONS = 'SET_CONNECTIONS';
export const CONNECTIONS_SORT = 'CONNECTIONS_SORT';
export const UPDATE_CONNECTIONS = 'UPDATE_CONNECTIONS';
export const DELETE_CONNECTION = 'DELETE_CONNECTION';
export const ADD_CONNECTION = 'ADD_CONNECTION';
export const ADD_TRUSTED_CONNECTION = 'ADD_TRUSTED_CONNECTION';
export const REMOVE_TRUSTED_CONNECTION = 'REMOVE_TRUSTED_CONNECTION';
export const SET_CONNECTIONS_SEARCH_PARAM = 'SET_CONNECTIONS_SEARCH_PARAM';
export const SET_CONNECTIONS_SEARCH_OPEN = 'SET_CONNECTIONS_SEARCH_OPEN';
export const HYDRATE_CONNECTIONS = 'HYDRATE_CONNECTIONS';

/**
 * redux action creator for setting connections array
 * @param type SET_CONNECTIONS
 * @param connections array of connections obtained from server and stored locally
 */

export const setConnections = (connections: connection[]) => ({
  type: SET_CONNECTIONS,
  connections,
});

export const setConnectionsSearchParam = (searchParam: string) => ({
  type: SET_CONNECTIONS_SEARCH_PARAM,
  searchParam,
});

export const setConnectionsSearchOpen = (searchOpen: boolean) => ({
  type: SET_CONNECTIONS_SEARCH_OPEN,
  searchOpen,
});

export const setConnectionsSort = (connectionsSort: string) => ({
  type: CONNECTIONS_SORT,
  connectionsSort,
});

/**
 * redux action creator for removing a connection
 * @param type UPDATE_CONNECTIONS
 * @param connections updates connections from server
 */

export const updateConnections = (connections: connection[]) => ({
  type: UPDATE_CONNECTIONS,
  connections,
});

export const deleteConnection = (id: string) => ({
  type: DELETE_CONNECTION,
  id,
});

/**
 * redux action creator for setting connections array
 * @param type ADD_CONNECTION
 * @param connection add a single connection
 */

export const addConnection = (connection: connection) => ({
  type: ADD_CONNECTION,
  connection,
});

export const addTrustedConnection = (id: string) => ({
  type: ADD_TRUSTED_CONNECTION,
  id,
});

export const removeTrustedConnection = (id: string) => ({
  type: REMOVE_TRUSTED_CONNECTION,
  id,
});

export const hydrateConnections = (data: ConnectionsState) => ({
  type: HYDRATE_CONNECTIONS,
  data,
});
