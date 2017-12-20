import React from 'react';
import { Link } from 'react-router-dom';
import { RaisedButton } from 'material-ui';
import styles from './styles.js'
import { connect } from 'react-redux';
import { actions as accountActions } from '../accounts'
import { withRouter } from 'react-router'

class Landing extends React.Component {
  constructor(props) {
    super(props)
  }


  componentDidMount() {

  }

  handleConnect() {
    this.handleSuccess('03c04ad48e7c80c71a65fecbaf004c5f6124224ef640fe4bdec7413aedd7746e3e@192.241.224.112:10011', 100000)
  }

  async handleSuccess( ip, amount, clear) {
    var resp = await this.props.createChannel({ ip, amount })
      .then(() => {
        this.props.push('/lobby')
      })
      // eslint-disable-next-line no-console
      .catch('HERE',console.error)
  }

  render() {
    return (

    <div style={styles.container} >

      <div style={styles.container_header}>
      </div>
      <div style={styles.container_body}>
          <div style={styles.title_container}>

            <h1 style={styles.title} style={{fontSize: 40}}>Poker Game</h1>
          </div>
          <div style={styles.connect_button_container}>

             <RaisedButton
               label="Connect"
               onClick={this.handleConnect.bind(this)}
             />
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

  }), {
    createChannel: accountActions.createChannel,
    push: accountActions.push,
  },
)(Landing))
