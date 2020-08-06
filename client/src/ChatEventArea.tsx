import { Card, Icon, NonIdealState, Tag } from '@blueprintjs/core';
import * as React from 'react';
import { CenteredSpinner } from './CenteredInContainer';
import * as Shared from './SharedTypes';

const Message = ({ msg, me }: { msg: Shared.MessageEvent, me: Shared.User }) => (
  <Card elevation={1} style={{ padding: '10px' }}>
    <Tag
      minimal
      intent={msg.n === me.n ? 'primary' : 'none'}
      icon={msg.guest ? undefined : <Icon icon='person' iconSize={12} />}
    >
      #{msg.n} {msg.nick}
    </Tag>
    {' '}
    {msg.text}
  </Card>
);

const MeAction = ({ msg, me }: { msg: Shared.MeEvent, me: Shared.User }) => (
  <Card elevation={1} style={{ padding: '10px' }}>
    <Tag
      minimal
      intent={msg.n === me.n ? 'primary' : 'none'}
      icon={msg.guest ? undefined : <Icon icon='person' iconSize={12} />}
    >
      #{msg.n}
    </Tag>
    {' '}
    <em>{msg.nick} {msg.text}</em>
  </Card>
);

const NameChange = ({ msg, me }: { msg: Shared.NameChangeEvent, me: Shared.User }) => (
  <Card elevation={1} style={{ padding: '10px' }}>
    <Tag
      minimal
      intent={msg.n === me.n ? 'primary' : 'none'}
      icon={msg.guest ? undefined : <Icon icon='person' iconSize={12} />}
    >
      #{msg.n} {msg.oldNick}
    </Tag>
    {' is now known as '}
    <Tag
      minimal
      intent={msg.n === me.n ? 'primary' : 'none'}
      icon={msg.guest ? undefined : <Icon icon='person' iconSize={12} />}
    >
      #{msg.n} {msg.newNick}
    </Tag>
  </Card>
);

const ChatEventList: React.SFC = ({ children }) => (
  <div style={{
    position: 'relative',
  }}>
    <div style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      maxHeight: '100%',
      overflow: 'auto',
      margin: '0 -0.5em',
    }}>
      <div style={{
        display: 'grid',
        alignContent: 'end',
        minHeight: '100%',
        gridGap: '0.5em',
        padding: '0 0.5em',
      }}>
        {children}
      </div>
    </div>
  </div>
);

interface Props {
  events?: Shared.ChatEvent[];
  user: Shared.User;
  smoothScroll: boolean;
}

export class ChatEventArea extends React.Component<Props>{

  scrollToBottomDiv: React.RefObject<HTMLSpanElement> = React.createRef();

  componentDidUpdate() {
    if (this.scrollToBottomDiv.current) {
      this.scrollToBottomDiv.current.scrollIntoView({ behavior: this.props.smoothScroll ? 'smooth' : 'instant' });
    }
  }

  render() {
    const { events, user } = this.props;

    if (events === undefined)
      return <CenteredSpinner />;

    if (events.length === 0)
      return <NonIdealState
        title="This chat is empty."
        description="Say hello!"
        icon="user" />;

    return (
      <ChatEventList>
        {events.map((msg, i) => {
          switch (msg.type) {
            case 'Message': return <Message msg={msg} me={user} key={i} />;
            case 'NameChange': return <NameChange msg={msg} me={user} key={i} />;
            case 'Me': return <MeAction msg={msg} me={user} key={i} />;
          }
        })}

        <span
          style={{ float: 'left', clear: 'both' }}
          ref={this.scrollToBottomDiv}
        />
      </ChatEventList>
    );
  }

}
