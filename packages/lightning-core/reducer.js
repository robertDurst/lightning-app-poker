import { combineReducers } from 'redux'

import { reducer as accounts } from './accounts'
import { reducer as pay } from './pay'
import { reducer as request } from './request'
import { reducer as settings } from './settings'
import { reducer as transactions } from './transactions'
import socket from './socketReducer'
import game from './currentGameReducer'

export const reducer = combineReducers({
  accounts,
  pay,
  request,
  settings,
  transactions,
  socket,
  game,
})

export { selectors } from './selectors'
