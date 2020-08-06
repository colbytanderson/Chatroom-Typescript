import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CenteredSpinner } from './CenteredInContainer';
import { Room } from './Room';
import * as Shared from './SharedTypes';
import { socket } from './Socket';
import { TopMenu } from './TopMenu';

interface State {
  version: number,
  user: Shared.User | null,
  rooms: Shared.BasicRoom[],
}

interface MatchParams {
  room: string;
}

export class App extends React.Component<RouteComponentProps<MatchParams>, State> {

  state: State = {
    version: 0,
    user: null,
    rooms: [],
  };

  componentDidMount() {
    socket.emit('identify', localStorage.getItem('token'), (user: Shared.User) => {
      console.log('identified', user);
      localStorage.setItem('token', user.token);
      this.setState({ user });

      socket.emit('list rooms', (rooms: Shared.BasicRoom[]) => {
        this.setState({ rooms });
      });
    });

    socket.on('changed nick', this.changedNick);
  }

  componentWillUnmount() {
    socket.off('changed nick', this.changedNick);
  }

  changedNick = (event: Shared.NameChangeEvent) => {
    const me = this.state.user;
    if (!me) return;
    if (event.n === me.n) {
      this.setState({ user: { ...me, nick: event.newNick } });
    }
  };

  joinRoom = (room: string) => {
    this.props.history.push('/r/' + room);
  };

  render() {
    const { rooms, user } = this.state;
    const { room } = this.props.match.params;

    return <>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
        }}
      >

        <TopMenu user={user} />

        {
          user
            ?
            <Room
              key={room}
              rooms={rooms}
              room={room}
              user={user}
              join={this.joinRoom}
            />
            :
            <CenteredSpinner />
        }

      </div>
    </>;
  }

}
