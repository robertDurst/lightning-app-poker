import store  from '../../../apps/desktop/index'
import { gameUpdate } from '../actions/index';

export default (socket) => {

  socket.on('GAME_UPDATE', (game) => {
    console.log("GAME UPDATE RECEIVED");
    store.dispatch(gameUpdate(game))
  })

  socket.on('LOG', (data) => {
    console.log('HOST LOG:',data);
  })

  socket.on('REQUEST_ACTION', () => {
    console.log("MAKE CHOICE");
  })

}
