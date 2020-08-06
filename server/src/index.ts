import querystring from 'querystring';
import socketio from 'socket.io';
import * as Chats from './model/chat';
import config from './config';
import { GoogleAuth } from './googleAuth';
import * as Rooms from './model/room';
import * as Shared from './SharedTypes';
import * as Users from './model/user';

Rooms.ensureDefaultRoom();

const server = socketio.listen(config.port);
console.log(`Listening on ${config.port}`);

const latestVersion = Date.now();

function normalizeUser(user: Users.User): Shared.User {
  return {
    guest: user.googleId === null,
    n: user.id,
    nick: user.nick,
    token: user.token,
  };
}

function normalizeEvent(event: Chats.ChatEvent): Shared.ChatEvent {
  switch (event.type) {
    case 'Message': return {
      type: event.type,
      n: event.userId,
      guest: event.guest,
      nick: event.nick,
      text: event.text,
    };
    case 'Me': return {
      type: event.type,
      n: event.userId,
      guest: event.guest,
      nick: event.nick,
      text: event.text,
    };
    case 'NameChange': return {
      type: event.type,
      n: event.userId,
      guest: event.guest,
      oldNick: event.oldNick,
      newNick: event.newNick,
    };
  }
}

GoogleAuth.create({
  clientSecret: config.oauth.clientSecret,
  clientId: config.oauth.clientId,
  callbackUrl: config.oauth.callback,
}).then(googleAuth => {

  server.on('connection', socket => {

    socket.ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;

    socket.on('get version', reply => {
      reply(latestVersion);
    });

    socket.on('identify', (token: string | null, reply: (user: Shared.User) => void) => {
      let user = token && Users.findUserByToken(token);
      if (!user) user = Users.createUser(null);

      socket.user = user;
      reply(normalizeUser(user));
    });

    socket.on('get login url', reply => {
      reply(googleAuth.getAuthUrl('openid'));
    });

    socket.on('finish login', (query: string, token: string | null, reply: (user: Shared.User | null) => void) => {
      googleAuth.getInfo(querystring.parse(query.substr(1)))
        .then(info => {
          console.log('validated id_token claims %j', info);

          const googleId = info.sub;

          let user = Users.findUserByGoogleId(googleId);

          if (!user && token) {
            user = Users.findUserByToken(token);
            if (user) Users.setGoogleId(user, googleId);
          }

          if (!user) {
            user = Users.createUser(googleId);
          }

          socket.user = user;
          reply(normalizeUser(user));
        })
        .catch(err => {
          console.log('err', err);
          reply(null);
        });
    });

    socket.on('get default room', (reply: (room: string) => void) => {
      reply(Rooms.defaultRoom().name);
    });

    socket.on('list rooms', (reply: (rooms: Shared.BasicRoom[]) => void) => {
      if (!socket.user) return;
      reply(Rooms.allRooms().map(room => ({
        name: room.name,
        id: room.id
      })));
    });

    socket.on('join', (roomName: string, reply: (events: Shared.ChatEvent[], users: Shared.User[]) => void) => {
      if (!socket.user) return;

      const room = Rooms.findRoomByName(roomName);
      if (!room) return;

      const oldRoom = socket.room;
      socket.room = room;

      if (oldRoom) socket.leave(oldRoom.name);
      socket.join(room.name);

      Rooms.leaveAll(socket.user);
      Rooms.join(room, socket.user);

      if (oldRoom) server.to(oldRoom.name).emit('user left', normalizeUser(socket.user));
      server.to(room.name).emit('user joined', normalizeUser(socket.user));

      reply(
        Chats.getChatEvents(room).map(normalizeEvent),
        Rooms.getUsers(room).map(normalizeUser)
      );
    });

    socket.on('disconnect', () => {
      if (!socket.user) return;

      const oldRoom = socket.room;
      if (!oldRoom) return;

      Rooms.leaveAll(socket.user);
      server.to(oldRoom.name).emit('user left', normalizeUser(socket.user));
    });

    socket.on('new message', (text: string) => {
      if (!socket.user) return;
      if (!socket.room) return;

      text = text.trim();
      if (text.length > 1000) return;

      let event: Shared.ChatEvent;

      if (text.startsWith('/me ')) {
        text = text.substr(3).trim();
        event = normalizeEvent(Chats.addMeMessage(socket.user, socket.room, text));
      }
      else {
        event = normalizeEvent(Chats.addChatMessage(socket.user, socket.room, text));
      }

      server.to(socket.room.name).emit('new message', event);
    });

    socket.on('change nick', (nick: string) => {
      if (!socket.user) return;
      if (!socket.room) return;
      if (!Shared.validNick(nick)) return;
      if (nick === socket.user.nick) return;

      const event: Shared.ChatEvent = normalizeEvent(Chats.addNameChangeMessage(socket.user, socket.room, nick));
      Users.setNick(socket.user, nick);

      server.to(socket.room.name).emit('changed nick', event);
    });

  });

});
