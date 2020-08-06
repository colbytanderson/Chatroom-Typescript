import 'socket.io';
import { Room } from './src/model/room';
import { User } from './src/model/user';

declare module 'socket.io' {

  interface Socket {
    ip: string;
    user?: User;
    room?: Room;
  }

}
