import store from '../../../apps/desktop/index'
import {gameUpdate} from '../actions/index';
import { actions as payActions } from '../pay'
import { actions as accountActions } from '../accounts'
export default(socket) => {

  socket.on('GAME_UPDATE', (game) => {
    console.log("GAME UPDATE RECEIVED");
    store.dispatch(gameUpdate(game))
  })

  socket.on('LOG', (data) => {
    console.log('HOST LOG:', data);
  })

  socket.on('REQUEST_ACTION', () => {
    console.log("MAKE CHOICE");
  })

  socket.on('INVOICE', (invoice, amount) => {
    if (invoice !== null) {
      console.log('invoice',invoice);
      onMakePayment({
        address: invoice,
        amount,
      }).then( data => {
        console.log("DATA",data);
      }).catch( err => {
        console.log("err", err);
      })
    }

  })
}

const onMakePayment = ({address, amount}) => {
  return new Promise((resolve, reject) => {
    const resolveSuccess = () => {
      store.dispatch(accountActions.fetchChannels())
      store.dispatch(accountActions.fetchBalances())
      store.dispatch(accountActions.fetchAccount())
      resolve('Payment Sent')
    }
    const rejectError = (err) => {
      reject(err.message)
    }
    console.log('infunc: address:',address);
    const payments = store.dispatch(payActions.sendPayment())
    payments.on('data', (payment) => {
      if (payment.payment_error === '') {
        resolveSuccess()
      } else {
        // TODO(roasbeef): need to switch and properly display errors
        rejectError({message: 'Payment route failure'})
      }
    })
    payments.on('error', rejectError)
    payments.write({payment_request: address})
  })

}
