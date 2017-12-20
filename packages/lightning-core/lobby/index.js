import React  from 'react'
import {Link}  from 'react-router-dom';
import axios from 'axios';
import io  from 'socket.io-client';
import { connect } from 'react-redux';
import { actions as accountActions } from '../accounts'
import { actions as payActions } from '../pay'
// import { socketConnect } from '../../actions/index';
import { withRouter } from 'react-router'
import { store } from '../../lightning-store/index.js'

import GameRoomTable from './GameRoomTable';
import { RaisedButton } from 'material-ui';
import startHost from '../../../apps/desktop/backend/gameHost/GameHostConnect';
import styles from './styles.js'
import StartHostPopup from './StartHostPopup';
import GameRoomDetailsPopup from './GameRoomDetailsPopup';

import { socketConnect } from '../actions/index';

import { actions as notificationActions } from 'lightning-notifications'

import { sanitizePaymentRequest } from '../helpers';
import CryptoJS from 'crypto-js';


class Lobby extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: {
        username: '',
        balance: ''
      },
      hosting: false,
      open: false,
      open_game: false,
      gameName: '',
      hostedGames: [],
      curGame: {},
      inChannel: true,
    }
    this.timer = null;
  }

   handleStartHost() {
         startHost.connect(this.state.gameName, this.props.pubkey)
         this.setState({
           open: false,
           hosting: true
         })
   }

   handleInputGameName(e) {
     this.setState({gameName: e.target.value})
   }

   handleGameHostClick(gameIndex){
     this.setState({
       open_game: true,
       curGame: this.state.hostedGames[gameIndex],
     })
   }

   handleGameHostConnect(){
     this.setState({
       open_game: false
     })

     window.location.hash = '/game'
     console.log("HOST IP",this.state.curGame.game_socket_ip)
     const socket = io(this.state.curGame.game_socket_ip);

     socket.emit('CHECK',"HEY THERE")
     this.props.socketConnectionMade(socket);
   }

   componentDidMount() {
     this.timer = setInterval(()=>{
       axios.get('https://secure-depths-49472.herokuapp.com/games')
       .then( x => this.setState({
         hostedGames: x.data
       }))
       .catch( err => console.log(err))
     }, 1000)

   }

   componentWillUnmount() {
     clearInterval(this.timer)
   }

   handleClick() {

    if(this.state.hosting) {
      startHost.disconnect()
      this.setState({
        hosting: false
      })
    } else {
      this.setState({
        open: true,
      })
     }
    // startHost.lightning_socket.emit('BET', 'test', 100)
    //
    // startHost.lightning_socket.on('PAID_INVOICE', async (message) => {
    //   console.log("INVOICE PAID", message);
    // })
    //
    //
    // // Receive payment request invoice from Global LND
    // startHost.lightning_socket.on('BET_INVOICE', async (pay_req) => {
    //   this.handleSuccess({
    //     address: pay_req,
    //     amount: 100
    //   })
    // });
   }

   generateMemo(amount, userPubKey, gameId, time = new Date()) {
     const message = amount + userPubKey + gameId + time;
     return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
   }

   handleChannel() {
     if(!(this.props.channels.length && !(this.props.channels[0].id))) {
       this.state.inChannel ?
         (this.setState({inChannel: false}),
         this.closeChannel({channelPoint: this.props.channels[0].channelPoint, force: false})):
         (this.setState({inChannel: true}),
         this.connectToGlobalLND('03c04ad48e7c80c71a65fecbaf004c5f6124224ef640fe4bdec7413aedd7746e3e@192.241.224.112:10011', 100000));
     }
   }

   async connectToGlobalLND( ip, amount, clear) {
     var resp = await this.props.createChannel({ ip, amount })
       .then(() => {
         this.props.push('/lobby')
       })
       // eslint-disable-next-line no-console
       .catch('HERE',console.error)
   }

   handleSuccess({ address, amount }) {
     this.props.onMakePayment({ address, amount })
       .then(() => {
         this.props.fetchAccount()
       })
       .catch(console.error)
   }

   closeChannel({ channelPoint, force }) {
     const call = this.props.onCloseChannel({ channelPoint, force })
     call.on('data', () => {
       this.props.onSuccess('Channel Closed')
     })
     call.on('error', err => onSuccess(err.message))
   }

   handleClose() {
    this.setState({
      open: false,
      open_game: false,
      curGame: {},
    });
   }
  render() {
    return (
    <div style={styles.container_overall}>
        <div style={styles.container_header}>
          <div style={styles.hostbutton_top}>
            <RaisedButton
              label= {this.state.hosting ? "Disconnect" : "Host"}
              onClick={this.handleClick.bind(this)}
              style={styles.host_button}
            />
            <RaisedButton
              label= {this.state.inChannel ? "Withdraw" : "Reconnect"}
              onClick={this.handleChannel.bind(this)}
              style={styles.withdraw_button}
              backgroundColor={"black"}
              labelColor={"#ddd"}
            />
          </div>
          <h1 style={styles.username_top}> Welcome <span style={styles.pubkey_header}>{this.props.pubkey}</span></h1>
          <p style={styles.balance_top}>Bank Account: {this.props.balances.wallet} BTC</p>
        </div>
        <div style={styles.container_body}>
          <div style={styles.gamehost_table_container}>
            <div style={styles.gamehost_table}>
              <GameRoomTable
                handleGameHostClick={this.handleGameHostClick.bind(this)}
                hostedGames={this.state.hostedGames}
              />
            </div>

          </div>

          <div>
            <h1>Connection Info</h1>
            {
              this.props.channels.length ?  <h3>Open Chanels</h3> : <p>No Channels Open</p>
            }
            {
              this.props.channels.map( (x,i) => x.id ? <div key={i}>
                <p>Channel id: {x.id}</p>
                <p>Remaining Channel Balance: {x.localBalance - x.totalSatoshisSent}</p>
                <p>Satoshis sent: {x.totalSatoshisSent}</p>
              </div> : <div key={i}>Pending...</div>)
            }
          </div>
          {/* <div className={styles.body_footer_container}>

            <RaisedButton
              label="Direct Game Connection"
            />
          </div> */}
        </div>
        <div style={styles.container_footer}></div>
        <StartHostPopup
        open={this.state.open}
        handleStartHost={this.handleStartHost.bind(this)}
        handleClose={this.handleClose.bind(this)}
        handleInputGameName={this.handleInputGameName.bind(this)}
      />
      <GameRoomDetailsPopup
        open={this.state.open_game}
        handleClose={this.handleClose.bind(this)}
        handleGameHostConnect={this.handleGameHostConnect.bind(this)}
        game={this.state.curGame}
      />
    </div>
  )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    socketConnectionMade: (socket) => dispatch(socketConnect(socket)),
    fetchAccount: accountActions.fetchAccount,
    fetchBalances: accountActions.fetchBalances,
    createChannel: accountActions.createChannel,
    onCloseChannel: accountActions.startCloseChannel,
    push: accountActions.push,
    onDecodePaymentRequest: payActions.decodePaymentRequest,
    onMakePayment: payActions.makePayment,
    onSuccess: notificationActions.addNotification,
  };
};

export default withRouter(connect(
  state => ({
    serverRunning: store.getServerRunning(state),
    isSynced: store.getSyncedToChain(state),
    pubkey: store.getAccountPubkey(state),
    currency: store.getCurrency(state),
    balances: store.getAccountBalances(state),
    address: store.getAddress(state),
    logs: store.getRecentLogs(state),
    numPeers: store.getNumPeers(state),
    isTestnet: store.getTestnet(state),
    chains: store.getChains(state),
    channels: store.getChannels(state),
  }), mapDispatchToProps,

)(Lobby))
