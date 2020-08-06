export function validNick(nick: string): boolean {
  return nick.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(nick);
}

export interface User {
  guest: boolean;
  token: string;
  n: number;
  nick: string | null;
}

export interface BasicRoom {
  name: string;
  id: number;
}

export type ChatEvent = NameChangeEvent | MessageEvent | MeEvent;

export interface NameChangeEvent {
  type: 'NameChange';
  n: number;
  guest: boolean;
  oldNick: string;
  newNick: string;
}

export interface MessageEvent {
  type: 'Message';
  n: number;
  guest: boolean;
  nick: string;
  text: string;
}

export interface MeEvent {
  type: 'Me';
  n: number;
  guest: boolean;
  nick: string;
  text: string;
}
