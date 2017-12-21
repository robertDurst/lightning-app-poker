// This reducer keeps track of the socket the node connects to
// the host with. This is important for creating a persistent
// connection across views.

import * as types from './actions/types';
import SocketHandler from './utils/SocketHandler';

export const reducer = (state = "", action) => {
  switch (action.type) {
    case types.SOCKET_CONNECT:
      SocketHandler(action.socket)
      return action.socket;
    case types.SOCKET_DISCONNECT:
      return "";
    default:
      return state;
  }
};
