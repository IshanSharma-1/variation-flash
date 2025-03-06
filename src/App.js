import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import Room from './components/Room';
import Game from './components/Game';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={WelcomeScreen} />
        <Route path="/room/:roomId" component={Room} />
        <Route path="/game/:roomId" component={Game} />
      </Switch>
    </Router>
  );
}

export default App;