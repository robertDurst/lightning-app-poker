// This reducer keeps track of the socket the node connects to
// the host with. This is important for creating a persistent
// connection across views.

import * as types from './actions/types';

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case types.NAME_UPDATE:
      return Object.assign({}, { name: action.name, color: action.color }, state)
    case types.ROOMNAME_UPDATE:
      return Object.assign({}, { roomname: action.name }, state)
    default:
      return state;
  }
};
