import React from 'react';
import Chat from './chat';
import Home from './Home';
import { Switch, Route, Redirect } from 'react-router-dom';

function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/chat" component={Chat} />
      </Switch>
    </>
  );
}

export default App;
