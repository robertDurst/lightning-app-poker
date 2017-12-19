import reactCSS from 'reactcss'

export default reactCSS({
  default: {
    container: {
      backgroundColor: '#4CAF50',
      height: '100%',
      width: '100%',
      display: 'flex',

      flexDirection: 'column'
    },
    container_header: {
      flex: '1'
    },
    container_body: {
      flex: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    title_container: {
      flex: '5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    title: {
      fontSize: '100pt',
      fontFamily: "Poker Font",
      fontWeight: 'lighter'
    },
    connect_button_container: {
      flex: '1',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerfooter: {
      flex: '1',
    },

  },
})
