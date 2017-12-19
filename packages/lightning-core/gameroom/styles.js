import reactCSS from 'reactcss'

export default reactCSS({
  default: {
    container_overall: {
      backgroundColor: 'black',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    container_header: {
      flex: '1',
      backgroundColor: 'yellow',
      display: 'flex',
      color: 'white',
      alignSelf: 'center',

    },
    container_header_item: {
      backgroundColor: 'black',
      height: 'auto',
      padding: '25px 45px',
      fontSize: '22px',
    },
    // container_header_item:hover: {
    //   backgroundColor: 'grey',
    // },
    container_body: {
      flex: '10',
      backgroundColor: 'pink',
      display: 'lock',
    },
    container_body_top: {
      width: '100vw',
      height: '60%',
      backgroundColor: 'dodgerBlue',
      display: 'flex',
      /*flexDirection: 'column',*/
    },
    choice_box_overall: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    /*,
    Table_player_bar: {
      flex: '1',
      backgroundColor: 'lightBlue',
      width: 100'%',
      display: 'flex',
    },
    Table_table: {
      flex: '5',
      display: 'flex',
      width: 100'%',
      backgroundColor: 'darkGreen',
    },
    Table_table_top: {
      backgroundColor: 'green',
      display: 'flex',
      width: '80vw',
      margin: 0 '10vw',
    }*/
    /*Player: {
      flex: '1',
      height: 'auto',
    }*/


    container_body_bottom: {
      width: '100vw',
      height: '40%',
      display: 'flex',
    },
    Hand_overall: {
      display: 'flex',
    },
    info_item: {
      flex:'1',
    },
    container_footer: {
      flex: '1',
      backgroundColor: 'red',
    }
  },
})
