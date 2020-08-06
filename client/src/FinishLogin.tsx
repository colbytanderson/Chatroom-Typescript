import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CenteredSpinner } from './CenteredInContainer';
import { User } from './SharedTypes';
import { socket } from './Socket';

export class FinishLogin extends React.Component<RouteComponentProps<any>> {

  componentDidMount() {
    socket.emit('finish login',
      this.props.location.search,
      localStorage.getItem('token'),
      (user: User) => {
        localStorage.setItem('token', user.token);
        this.props.history.replace('/');
      });
  }

  render() {
    return <CenteredSpinner />;
  }

}
