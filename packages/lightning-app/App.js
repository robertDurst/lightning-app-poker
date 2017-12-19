import React from 'react'

import { Route, Switch, Redirect } from 'react-router-dom'
import { Box } from 'lightning-components'
import { Notifications } from 'lightning-notifications'
import { LandingPage, LobbyPage, Streams, Gameroom } from 'lightning-core'

const App = () => {
  return (
    <Box style={{width: '100%', height: '100%'}}>
        <Switch>
          <Route path="/landing" component={ LandingPage } />
          <Route path="/lobby" component={ LobbyPage } />
          <Route path="/game" component={ Gameroom } />
          <Route render={ () => <Redirect to="/landing" /> } />
        </Switch>
        <Notifications />
        <Streams />
    </Box>
  )
}

export default App
