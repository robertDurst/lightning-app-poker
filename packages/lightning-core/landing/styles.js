import reactCSS from 'reactcss'

export default reactCSS({
  default: {
    container: {
      backgroundColor: '#4CAF50',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: "url(https://images.pexels.com/photos/279009/pexels-photo-279009.jpeg?w=5472&h=3648&auto=compress&cs=tinysrgb) no-repeat center center fixed"
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
    header_text: {
      fontSize: '100pt',
      fontWeight: 'lighter'
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
