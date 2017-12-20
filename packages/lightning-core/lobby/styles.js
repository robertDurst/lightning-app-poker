import reactCSS from 'reactcss'

export default reactCSS({
  default: {
    container_overall: {
      backgroundColor: '#4CAF50',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    container_header: {
      flex: '1',
      backgroundColor: 'blue',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0px 10px'
    },
    pubkey_header: {
      fontSize: '10pt',
    },
    username_top: {
      color: 'white',
      flex: '10',
      textAlign: 'center'
    },
    balance_top: {
      marginRight: '5px',
      color: 'white',
      flex: '3'
    },
    hostbutton_top: {
      flex: '3',
      display: 'flex',
    },
    withdraw_button: {
      flex: '1',
    },
    host_button: {
      flex: '1'
    },
    container_body: {
      flex: '10',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    gamehost_table_container: {
      flex: '7',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    body_footer_container: {
      flex: '2'
    },
    gamehost_table: {
      width: '75%',
      height: '500px'
    },
    player_container: {
      display: 'flex'
    },
    body_footer_container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    container_footer: {
      flex: '1'
    },
  },
})
