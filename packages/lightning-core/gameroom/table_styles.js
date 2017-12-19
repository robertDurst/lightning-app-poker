import reactCSS from 'reactcss'

export default reactCSS({
  default: {
    Table_overall: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    Table_player_bar: {
      flex: '1',
      backgroundColor: 'lightBlue',
      width: '100%',
      display: 'flex',
    },
    Table_table: {
      flex: '5',
      display: 'flex',
      width: '100%',
      backgroundColor: 'darkGreen',
    },
    Table_table_top: {
      backgroundColor: 'green',
      display: 'flex',
      width: '80vw',
      margin: '0 10vw',
    },
  },
})
