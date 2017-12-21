import reactCSS from 'reactcss'

export default reactCSS({
  default: {
    container_overall: {
      backgroundColor: '#0288D1',
      backgroundImage: 'url(background.svg)',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    container_header: {
      flex: '1',
      background: "linear-gradient(to right, #E65100, #E65100)",
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: 'solid #0288D1 1px',
      paddingLeft: '20px',
      minWidth: '1000px'
    },
    pubkey_header: {
      fontSize: '10pt',
    },
    header_left: {
      flex: 1,
      marginRight: '25px',
    },
    header_center: {
      flex: 6,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    header_right: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    header_right_column_balance: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '10px',
      marginRight: '10px',
      textAlign: 'right',
      lineHeight: 1.6,
    },
    header_column_user: {
      flex: 2,
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '10px',
      lineHeight: 1.6,
    },
    header_column_buttons: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      marginRight: '10px',
    },
    header_logo: {
      height: '20px',
      width: '20px',
      marginRight: '5px'
    },
    header_right_text: {
      fontSize: '16pt',
    },
    header_address: {
      fontSize: '8pt',
    },
    header_username: {
      fontSize: '14pt',
      color: 'white'
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
      marginBottom: '5px',
      marginRight: '5px',
    },
    host_button: {
      flex: '1',
      marginBottom: '5px',
      marginRight: '5px',
    },
    container_body: {
      flex: '10',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    },
    header_title: {
      fontSize: '40pt',
      color: '#0288D1',
      textShadow: '1px 1px black'
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
