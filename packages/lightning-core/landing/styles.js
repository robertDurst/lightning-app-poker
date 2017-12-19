import reactCSS from 'reactcss'

export default reactCSS({
  default: {
    container: {
      backgroundColor: '#4CAF50',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    gamehost_table_container: {
      flex: 7,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    body_footer_container: {
      flex: 2,
    },
    gamehost_table: {
      width: '75%',
      height: '500px',
    },
    player_container: {
      display: 'flex',
    },
    body_footer_container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container_footer: {
      flex: 1,
    }
  },
})
