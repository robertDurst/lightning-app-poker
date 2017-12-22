import reactCSS from 'reactcss'

export default reactCSS({
  default: {
    Player: {
      width: '400px',
      margin: '10px',
      display: 'flex',
    },
    img_container: {
      flex: 1,
    },
    info_container: {
      flex: 2,
      display: 'flex',
      flexDirection: 'column'
    },
    displayName: {
      flex: 2,
      backgroundColor: '#03A9F4',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '5px',
    },
    amountBet: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '5px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: '5px',
    },
    logo_container: {
      flex: 1,
    },
    logo: {
      width: '25%',
      height: '10%'
    },
    img: {
      width: '100%',
      height: '100%',
    }
  },
})
