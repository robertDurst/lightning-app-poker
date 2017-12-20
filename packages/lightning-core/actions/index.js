// This file contains action definitions

import * as types from './types';

// Called upon socket connection
// Input: socket object
export function gameUpdate(game) {
  return {
    type: types.GAME_UPDATE,
    game,
  };
}

// Called upon socket connection
// Input: socket object
export function socketConnect(socket) {
  return {
    type: types.SOCKET_CONNECT,
    socket,
  };
}

// Called upon socket disconnection
// Input: NONE
export function socketDisconnect() {
  return {
    type: types.SOCKET_DISCONNECT,
  };
}
