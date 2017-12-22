import reactCSS from 'reactcss'

export default reactCSS({
  default: {
    container_overall: {
      backgroundColor: '#0288D1',
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
    header_logo: {
      height: '20px',
      width: '20px',
      marginRight: '5px'
    },
    header_right_text: {
      fontSize: '16pt',
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
    header_title: {
      fontSize: '40pt',
      color: '#0288D1',
      textShadow: '1px 1px black'
    },
    container_body: {
      flex: '10',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
    },
    container_body_players: {
      flex: 2,
      display: 'flex',
    },
    container_body_gamespread: {
      flex: 10,
      backgroundColor: 'yellow',
    },
    container_body_hand: {
      flex: 5,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
    },
    container_body_your_cards: {
      flex: 6,
      backgroundColor: '#0288D1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    container_body_choicebox: {
      flex: 2,
      width: '100%',
      height: '100%',
      // backgroundColor: 'blue',
      position: 'relative',
      zIndex: '999'
    },
    container_footer: {
      flex: '1',
      backgroundColor: 'black',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container_footer_marquee: {
      color: 'white',
      fontSize: '20pt'
    },
    // Player: {
    //   width: '100px',
    //   height: '100px',
    // }
  }
})
