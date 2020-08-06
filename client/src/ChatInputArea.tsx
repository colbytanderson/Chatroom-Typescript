import { Classes, FormGroup, Icon, InputGroup, Popover, Tag } from '@blueprintjs/core';
import * as React from 'react';
import * as Shared from './SharedTypes';
import { socket } from './Socket';

interface Props {
  user: Shared.User;
}

interface State {
  msg: string,
  newNick: string,
  changingNick: boolean,
}

export class ChatInputBar extends React.Component<Props, State> {

  state: State = {
    msg: '',
    newNick: '',
    changingNick: false,
  };

  newNickChanged: React.ChangeEventHandler<HTMLInputElement> = e => {
    const newNick = e.target.value.trim();
    this.setState({ newNick });
  };

  changeNickKeyPress: React.KeyboardEventHandler = (e) => {
    if (e.key !== 'Enter') return;
    if (!Shared.validNick(this.state.newNick)) return;

    const newNick = this.state.newNick.trim();
    if (newNick.length === 0) return;

    this.setState({
      changingNick: false,
      newNick: '',
    });

    socket.emit('change nick', newNick);
  };

  keyPressed: React.KeyboardEventHandler = (e) => {
    if (e.key !== 'Enter') return;

    const str = this.state.msg.trim();
    if (str.length === 0) return;

    socket.emit('new message', this.state.msg);
    this.setState({ msg: '' });
  };

  changed: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    this.setState({ msg: e.target.value });
  };

  render() {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gridGap: '1em',
        alignItems: 'center',
      }}>
        <div>
          <Popover
            popoverClassName={Classes.POPOVER_CONTENT_SIZING}
            usePortal={true}
            className='bp3-fixed'
            onInteraction={(nextOpenState) => {
              this.setState({
                newNick: this.props.user.nick || '',
                changingNick: nextOpenState,
              });
            }}
            isOpen={this.state.changingNick}
            content={
              <FormGroup
                label="Nick to use"
                helperText={Shared.validNick(this.state.newNick) ? "Good idea. Let's go with that." : 'Not valid! Try again.'}
              >
                <InputGroup
                  autoFocus
                  onKeyPress={this.changeNickKeyPress}
                  value={this.state.newNick}
                  onChange={this.newNickChanged}
                />
              </FormGroup>
            }
          >
            <Tag
              interactive
              minimal
              large
              intent='primary'
              icon={this.props.user.guest ? undefined : <Icon icon='person' iconSize={12} />}
            >
              #{this.props.user.n} {this.props.user.nick}
            </Tag>
          </Popover>
        </div>
        <InputGroup
          autoFocus
          placeholder='Message'
          onKeyPress={this.keyPressed}
          onChange={this.changed}
          value={this.state.msg}
        />
      </div>
    );
  }

};
