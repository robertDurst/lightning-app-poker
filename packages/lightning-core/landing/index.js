import React from 'react';
import { Link } from 'react-router-dom';
import { RaisedButton } from 'material-ui';
import styles from './Landing.css'
import styleObj from './styles.js'



class Landing extends React.Component {
  constructor(props) {
    super(props)
    this.state = { x: 0, y: 0 };
  }

  _onMouseMove(e) {
    this.setState({ x: e.screenX, y: e.screenY });
  }

  componentDidMount() {
    console.log(styles);
    console.log(styleObj);
  }

  render() {
    const { x, y } = this.state;
    return (
    <div style={styleObj.container} onMouseMove={this._onMouseMove.bind(this)}>
      <div className={styles.container_header}>
      </div>
      <div className={styles.container_body}>
          <div className={styles.title_container}>
            <h1 className={styles.title} style={{fontSize: y/5}}>Poker Game</h1>
          </div>
          <div className={styles.connect_button_container}>
            <Link to='/lobby' >
             <RaisedButton
               label="Connect"
             />
           </Link>
          </div>


      </div>
      <div className={styles.container_footer}>
      </div>
    </div>
  )
  }
}

module.exports = Landing
