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

import animals from 'animals';
import adjectives from 'adjectives';
import colors from 'color-name-list';


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
      btcPrice: 0,
      username: 'loading...',
    }
    this.timer = null;
    this.timerPrice = null;
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


     axios.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')
     .then( x => this.setState({
       btcPrice: x.data.USD
     }))
     .catch( err => console.log(err))

     this.timerPrice = setInterval(()=>{
       axios.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD')
       .then( x => this.setState({
         btcPrice: x.data.USD
       }))
       .catch( err => console.log(err))
     }, 30000)

     this.nameGenerator()
   }

   componentWillUnmount() {
     clearInterval(this.timer)
     clearInterval(this.timerPrice)
   }

   nameGenerator() {
     const adjective = adjectives[this.props.pubkey.substr(0,22).split("").reduce( (sum, x) => sum + x.charCodeAt(), 0) % 1133];
     const color = colors[this.props.pubkey.substr(22,44).split("").reduce( (sum, x) => sum + x.charCodeAt(), 0) % 1671];
     const animal = animals.words[this.props.pubkey.substr(44,66).split("").reduce( (sum, x) => sum + x.charCodeAt(), 0) % 236];
     const name = adjective + " " + color.name + " " + animal;
     const colorHex = color.hex;
     this.setState({
       username: name,
       usernameColor: colorHex
     })
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
    this.closeChannel({channelPoint: this.props.channels[0].channelPoint, force: false})
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
      this.props.push('/landing')
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
        <div style={styles.header_left}>
          <h1 style={styles.header_title}>dPoker</h1>
        </div>

        <div style={styles.header_center}>

        </div>

        <div style={styles.header_right}>
          <div  style={styles.header_right_row}>
            <RaisedButton
              label= {this.state.hosting ? "Disconnect" : "Host"}
              onClick={this.handleClick.bind(this)}
              style={styles.host_button}
            />
            <RaisedButton
              label={"Withdraw"}
              onClick={this.handleChannel.bind(this)}
              style={styles.withdraw_button}
              backgroundColor={"black"}
              labelColor={"#ddd"}
            />
          </div>
          <div  style={styles.header_right_column_user}>
            <div style={styles.header_right_text}>
              Username: <span style={styles.header_username}>{this.state.username}</span>
            </div>
            <div style={styles.header_right_text}>
              Address: <span style={styles.header_address}>{this.props.pubkey}</span>
            </div>
          </div>
          <div  style={styles.header_right_column_balance}>
            <div style={styles.header_right_text}>
              <img style={styles.header_logo} src="https://seeklogo.com/images/B/bitcoin-logo-DDAEEA68FA-seeklogo.com.png" />
              {
                this.props.channels[0] ? ((this.props.channels[0].localBalance - this.props.channels[0].totalSatoshisSent)/100000000).toFixed(5) : "loading..."
              }
            </div>
            <div style={styles.header_right_text}>
              <img style={styles.header_logo} src="https://t7.rbxcdn.com/f0524f9b622c56c7a31a85a167579a42" />
              {
                this.props.channels[0] ? ((this.props.channels[0].localBalance - this.props.channels[0].totalSatoshisSent)/100000000 * this.state.btcPrice).toFixed(2) : "loading..."
              }
            </div>
          </div>
        </div>
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
      </div>

        {/* <div style={styles.container_header}>
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
        </div> */}
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
  }),
  dispatch => ({
    fetchAccount: accountActions.fetchAccount,
    fetchBalances: accountActions.fetchBalances,
    createChannel: accountActions.startCloseChannel,
    onCloseChannel: accountActions.closeChannel,
    push: accountActions.push,
    onDecodePaymentRequest: payActions.decodePaymentRequest,
    onMakePayment: payActions.makePayment,
    onSuccess: notificationActions.addNotification,
    socketConnectionMade: (socket) => dispatch(socketConnect(socket)),
  }),
)(Lobby))
