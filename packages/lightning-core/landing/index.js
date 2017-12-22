import React from 'react';
import { Link } from 'react-router-dom';
import { RaisedButton } from 'material-ui';
import styles from './styles.js'
import { connect } from 'react-redux';
import { actions as accountActions } from '../accounts'
import { actions as payActions } from '../pay'
import { withRouter } from 'react-router'

import path from 'path';
import { store } from '../../lightning-store/index.js'
import {serverRunningActionSent} from 'redux-grpc-middleware'

class Landing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      buttonColor: [0,0,0,0,0,0],
      interval: '',
    }
  }


  componentDidMount() {
    var self = this;
    let isReadyInterval = setInterval(function () {
      if(serverRunningActionSent) {
        clearInterval(isReadyInterval);
        self.setState({
          loading: false,
        })
      }
    }, 1000);

    const colorInterval = setInterval(function () {
      self.incrementColor();
    }, 500);

    this.setState({
      interval: colorInterval
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  handleConnect() {
    this.setState({
      loading: true,
    })
    this.handleSuccess('027545369216650891dae90798fb737809c2a75d9fc7b35df68534aeea38a28632@192.241.224.112:10011', 1600000)
  }

  async handleSuccess( ip, amount ) {
    this.props.channels.forEach( x => {
      if(x.status == 'open') this.closeChannel({channelPoint: x.channelPoint, force: false});
    })
    var resp = await this.props.createChannel({ ip, amount })
      .then(() => {
        this.props.onMakePayment({
          address: 'lnsb14m1pdr60xgpp55rtw5qz28crq77h96uv24yf73sy9ly4p27zvwhe7rkuejry6n2yqdqqcqzyshq7r9a806ysh3j2zugql4e88wm7gacmxy2dt7d8flx424p5y0nz3l5pr73qsp7wu7majtskfg6zqjx3vsrdnagexzafayap5qw373kqpqmy0ah',

          amount: 140000
        })
        this.props.push('/lobby')
      })
      // eslint-disable-next-line no-console
      .catch('HERE',console.error)
  }

  closeChannel({ channelPoint, force }) {
    console.log("CLOSING", channelPoint);
    const call = this.props.onCloseChannel({ channelPoint, force })
  }

  incrementColor() {
    const newColor = this.state.buttonColor.map( x => {
      const num = Math.floor(Math.random() * 15);

      switch(num) {
        case 10:
          return 'a'
        case 11:
          return 'b';
        case 12:
          return 'c';
        case 13:
          return 'd';
        case 14:
          return 'e';
        case 15:
          return 'f';
        default:
          return num;
      }
    })

    this.setState({
      buttonColor: newColor
    })
  }

  render() {

    return (

    <div style={styles.container} >

      <div style={styles.container_header}>
      </div>
      <div style={styles.container_body}>


          <div style={styles.connect_button_container}>

            {
              !this.state.loading ?
              <div>
              <div style={styles.title_container}>

                {/* <h1 style={styles.title} style={{fontSize: 40}}>Poker Game</h1> */}
              </div>
              {/* <h1 style={styles.header_text}>dPoker</h1> */}
               <RaisedButton
                 label="Connect to DPOKER"
                 onClick={this.handleConnect.bind(this)}
                 labelColor={"#"+this.state.buttonColor.join("")}
                 labelStyle={{fontSize: '40pt'}}
                 buttonStyle={{padding: '30px', paddingBottom: '60px'}}
                 backgroundColor={'black'}
               />
             </div>:
    <div>
      <img src="https://steemitimages.com/DQmWyBbzVbhUA8upetUbY6kNFUjMknT5XKEBwQZXJyG9Wk7/389.gif" />
    </div>
            }
          </div>


      </div>
      <div style={styles.container_footer}>

        Footer

      </div>
    </div>
  )
  }
}

export default withRouter(connect(
  state => ({
    channels: store.getChannels(state),
  }), {
    createChannel: accountActions.createChannel,
    push: accountActions.push,
    onCloseChannel: accountActions.startCloseChannel,
    onFetchChannels: accountActions.fetchChannels,
    onMakePayment: payActions.makePayment,
  },
)(Landing))
