import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CenteredSpinner } from "./CenteredInContainer";
import { socket } from "./Socket";

export class GotoDefaultRoom extends React.Component<RouteComponentProps<any>> {

  componentDidMount() {
    socket.emit('get default room', (room: string) => {
      this.props.history.push('/r/' + room)
    });
  }

  render() {
    return <CenteredSpinner />;
  }

}
