import { Classes, Menu, MenuItem } from '@blueprintjs/core';
import * as React from 'react';
import { CenteredSpinner } from './CenteredInContainer';
import * as Shared from './SharedTypes';

interface Props {
  users: Shared.User[] | undefined;
  me: Shared.User;
}

export const UserList: React.SFC<Props> = ({ users, me }) => (
  users ?
    <div style={{
      display: 'grid',
      justifyContent: 'start',
    }}>
      <Menu className={Classes.ELEVATION_1}>
        {users.map(user =>
          <MenuItem
            key={user.n}
            intent={user.n === me.n ? 'primary' : 'none'}
            text={user.nick}
            label={'#' + user.n.toString()}
          />
        )}
      </Menu>
    </div> :
    <CenteredSpinner />
);
