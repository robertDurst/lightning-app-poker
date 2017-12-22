const ioClient = require('socket.io-client');
import CryptoJS from 'crypto-js';


export const lightning_socket = ioClient("192.241.224.112:1279");

export function generateMemo( amount, userPubKey, time = new Date()) {
  const message = amount + userPubKey + time;
  return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
}

export function betInvoice(memo, cb) {
  lightning_socket.on('BET_INVOICE', (recievedMemo, invoice) => {
    if (recievedMemo === memo) {
      cb(invoice)
    }
  })
}

export function completePayment(originalMemo, cb) {
  lightning_socket.on('COMPLETED_PAYMENT', (recievedMemo) => {
    if (recievedMemo === originalMemo) {
      cb()
    }
  })
}

export function completePaymentRequest(paymentRequest) {
  lightning_socket.emit("GAME_END", paymentRequest)
  lightning_socket.on('WINNER_PAID', () => {
    cb()
  })
}
