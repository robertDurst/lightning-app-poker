import React from 'react';
import { Link } from 'react-router-dom';
import { RaisedButton } from 'material-ui';
import styles from './styles.js'
import { connect } from 'react-redux';
import { actions as accountActions } from '../accounts'
import { withRouter } from 'react-router'
import { store } from '../../lightning-store/index.js'
import {serverRunningActionSent} from 'redux-grpc-middleware'


class Landing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
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
  }

  handleConnect() {
    this.setState({
      loading: true,
    })
    this.handleSuccess('03c04ad48e7c80c71a65fecbaf004c5f6124224ef640fe4bdec7413aedd7746e3e@192.241.224.112:10011', 100000)
  }

  async handleSuccess( ip, amount ) {
    this.props.channels.forEach( x => {
      if(x.status == 'open') this.closeChannel({channelPoint: x.channelPoint, force: false});
    })
    var resp = await this.props.createChannel({ ip, amount })
      .then(() => {
        this.props.push('/lobby')
      })
      // eslint-disable-next-line no-console
      .catch('HERE',console.error)
  }

  closeChannel({ channelPoint, force }) {
    console.log("CLOSING", channelPoint);
    const call = this.props.onCloseChannel({ channelPoint, force })
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
               <RaisedButton
                 label="Connect"
                 onClick={this.handleConnect.bind(this)}
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
  },
)(Landing))
