import * as React from 'react';
import { ChatEventArea } from './ChatEventArea';
import { ChatInputBar } from './ChatInputArea';
import { RoomList } from './RoomList';
import * as Shared from './SharedTypes';
import { socket } from './Socket';
import { UserList } from './UserList';

interface Props {
  room: string;
  rooms: Shared.BasicRoom[];
  user: Shared.User;
  join: (room: string) => void;
}

interface State {
  events?: Shared.ChatEvent[],
  users?: Shared.User[],
  backlogMode: boolean,
}

const Sidebar: React.SFC = ({ children }) => (
  <div style={{
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gridGap: '1em',
  }}>
    {children}
  </div>
);

export class Room extends React.Component<Props, State> {

  state: State = {
    backlogMode: true,
  };

  componentDidMount() {
    socket.emit('join', this.props.room, (events: Shared.ChatEvent[], users: Shared.User[]) => {
      this.setState({ events, users });
      setTimeout(() => {
        this.setState({ backlogMode: false });
      }, 100);

      socket.on('changed nick', this.changedNick);
      socket.on('new message', this.newMessage);
      socket.on('user joined', this.userJoined);
      socket.on('user left', this.userLeft);
    });
  }

  userJoined = (joiner: Shared.User) => {
    this.setState({ users: [...this.state.users!, joiner] });
  };

  userLeft = (leaver: Shared.User) => {
    this.setState({ users: this.state.users!.filter(user => user.n !== leaver.n) });
  };

  changedNick = (event: Shared.NameChangeEvent) => {
    this.setState({
      events: [...this.state.events!, event],
      users: this.state.users!.map(user => ({
        ...user,
        nick: event.n === user.n ? event.newNick : user.nick,
      }))
    });
  };

  componentWillUnmount() {
    socket.off('changed nick', this.changedNick);
    socket.off('new message', this.newMessage);
    socket.off('user joined', this.userJoined);
    socket.off('user left', this.userLeft);
  }

  newMessage = (event: Shared.MessageEvent) => {
    this.setState({ events: [...this.state.events!, event] });
  };

  render() {
    return <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        margin: '1em',
        gridGap: '1em',
      }}>

        <Sidebar>

          <RoomList
            rooms={this.props.rooms}
            currentRoom={this.props.room}
            join={room => this.props.join(room)} />

          <UserList
            users={this.state.users}
            me={this.props.user} />

        </Sidebar>

        <div style={{
          display: 'grid',
          gridTemplateRows: '1fr auto',
          gridGap: '1em',
        }}>

          <ChatEventArea
            events={this.state.events}
            user={this.props.user}
            smoothScroll={!this.state.backlogMode} />

          <ChatInputBar user={this.props.user} />

        </div>

      </div>

    </>;
  }

}
