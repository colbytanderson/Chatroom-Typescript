import shortid from 'shortid';
import { Model } from '../model';
import { ModelArrayInFile } from '../persistence';

const users = new ModelArrayInFile<User>({
  filename: 'users',
  saveIntervalSeconds: 60,
});


export interface User extends Model {
  token: string;
  googleId: string | null;
  isAdmin: boolean;
  nick: string;
}


export function findUserByToken(token: string): User | undefined {
  return users.chain.find(user => user.token === token).value();
}

export function findUserById(id: number): User | undefined {
  return users.chain.find(user => user.id === id).value();
}

export function findUserByGoogleId(googleId: string): User | undefined {
  return users.chain.find(user => user.googleId === googleId).value();
}

export function createUser(googleId: string | null): User {
  const user = users.insert({
    token: shortid.generate(),
    googleId,
    isAdmin: false,
    nick: 'guest',
  });
  users.save(user.id);
  return user;
}

export function setGoogleId(user: User, googleId: string) {
  user.googleId = googleId;
  users.save(user.id);
}

export function setNick(user: User, nick: string) {
  user.nick = nick;
  users.save(user.id);
}
