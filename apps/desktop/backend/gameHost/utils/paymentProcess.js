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

// export function test() {
//   lightning_socket.emit("GAME_END", "lnsb280u1pdrefxhpp5w605ep52nwf0vkwp03caxm5e7j4rtqnt0zdcw7uk3gthz33ygpasdq8w3jhguccqzysu4utnv6wrmqqgq6ffs6y6g53t2tsl6gzzvvuvzs4056jp6nj4fwsnvwjh00nqfajutmtm37wshw4p0uq2asptcv83kdqturdetc5r5cqfhj00d")
// }
