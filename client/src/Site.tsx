import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { App } from './App';
import { FinishLogin } from './FinishLogin';
import { GotoDefaultRoom } from './GotoDefaultRoom';

export class Site extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/oauth2callback' component={FinishLogin} />
          <Route exact path='/r/:room' component={App} />
          <Route component={GotoDefaultRoom} />
        </Switch>
      </BrowserRouter>
    );
  }

}
