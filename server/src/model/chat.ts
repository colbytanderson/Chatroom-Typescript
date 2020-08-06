import { Model } from "../model";
import { ModelArrayInDirectory } from "../persistence";
import { Room } from "./room";
import { User } from "./user";

const events = new ModelArrayInDirectory<ChatEvent>({
  dirname: 'chats',
  saveIntervalSeconds: 5,
});

export type ChatEvent = NameChangeEvent | MessageEvent | MeEvent;

export interface NameChangeEvent extends Model {
  type: 'NameChange';
  roomId: number;
  userId: number;
  guest: boolean;
  oldNick: string;
  newNick: string;
}

export interface MessageEvent extends Model {
  type: 'Message';
  roomId: number;
  userId: number;
  guest: boolean;
  nick: string;
  text: string;
}

export interface MeEvent extends Model {
  type: 'Me';
  roomId: number;
  userId: number;
  guest: boolean;
  nick: string;
  text: string;
}

export function addChatMessage(user: User, room: Room, text: string): MessageEvent {
  const e = events.insert<MessageEvent>({
    type: 'Message',
    roomId: room.id,
    userId: user.id,
    guest: user.googleId === null,
    nick: user.nick,
    text,
  });
  events.save(e.id);
  return e;
}

export function addMeMessage(user: User, room: Room, text: string): MeEvent {
  const e = events.insert<MeEvent>({
    type: 'Me',
    roomId: room.id,
    userId: user.id,
    guest: user.googleId === null,
    nick: user.nick,
    text,
  });
  events.save(e.id);
  return e;
}

export function addNameChangeMessage(user: User, room: Room, newNick: string): NameChangeEvent {
  const e = events.insert<NameChangeEvent>({
    type: 'NameChange',
    roomId: room.id,
    userId: user.id,
    guest: user.googleId === null,
    oldNick: user.nick,
    newNick,
  });
  events.save(e.id);
  return e;
}

export function getChatEvents(room: Room): ChatEvent[] {
  return events.chain.filter({ roomId: room.id }).value();
}
