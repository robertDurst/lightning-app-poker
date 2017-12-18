import React from 'react'

import { Route, Switch, Redirect } from 'react-router-dom'
import { Box } from 'lightning-components'
import { Notifications } from 'lightning-notifications'
import { LandingPage, LobbyPage, Streams } from 'lightning-core'

const App = () => {
  return (
    <Box>
        <Switch>
          <Route path="/landing" component={ LandingPage } />
          <Route path="/lobby" component={ LobbyPage } />
          <Route render={ () => <Redirect to="/landing" /> } />
        </Switch>
        <Notifications />
        <Streams />
    </Box>
  )
}

export default App
