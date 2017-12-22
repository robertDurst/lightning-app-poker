import store from '../../../apps/desktop/index'
import {gameUpdate} from '../actions/index';
import { actions as payActions } from '../pay'
import { actions as accountActions } from '../accounts'
import { generateMemo, generatePaymentRequest } from './paymentProcess'

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

  socket.on("YOU_WIN", async function(amount) {
    console.log("WIN RECEIVED");
    let state = store.getState()
    const memo = generateMemo(amount, state.core.accounts.pubkey)
    const bool = generatePaymentRequest(store, amount, memo)



    const timer = setInterval(function () {
      state = store.getState()
      let paymentRequest = state.core.request.paymentRequest;
      paymentRequest = paymentRequest.slice(12)
      console.log("HERE", paymentRequest)
      if(paymentRequest) {
        clearInterval(timer);
        const packet =  {
          paymentRequest,
          memo,
        };
        console.log("PR EMIT", packet);
        socket.emit("GIMME_MONEY", packet)
      }
    }, 1000);


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
