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
    this.handleSuccess('036fbaaf580762e887036713d36b2410f12d3c259e7881f5bda0c89ba1b388dc46@192.241.224.112:10011', 100000)
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
            <Link to='/lobby' >

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
