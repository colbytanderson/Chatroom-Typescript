import { Classes, Menu, MenuItem } from '@blueprintjs/core';
import * as React from 'react';
import * as Shared from './SharedTypes';

interface Props {
  rooms: Shared.BasicRoom[];
  currentRoom: string;
  join: (room: string) => void;
}

export const RoomList: React.SFC<Props> = ({ rooms, currentRoom, join }) => (
  <div style={{
    display: 'grid',
    justifyContent: 'start',
  }}>
    <Menu className={Classes.ELEVATION_1}>
      {rooms.map(room =>
        <MenuItem
          key={room.id}
          active={room.name === currentRoom}
          text={'#' + room.name}
          onClick={() => join(room.name)}
        />
      )}
    </Menu>
  </div>
);
