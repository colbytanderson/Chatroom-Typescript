import { Model } from "../model";
import { ModelArrayInFile } from "../persistence";
import { User } from "./user";

const rooms = new ModelArrayInFile<Room>({
  filename: 'rooms',
  saveIntervalSeconds: 60,
});

export interface Room extends Model {
  name: string;
  isDefault: boolean;
}

export function defaultRoom(): Room {
  return rooms.chain.find({ isDefault: true }).value()!;
}

export function ensureDefaultRoom() {
  if (rooms.array.length > 0) return;

  const room1 = createRoom({ name: 'general', isDefault: true });
  rooms.save(room1.id);

  const room2 = createRoom({ name: 'lounge', isDefault: false });
  rooms.save(room2.id);
}

interface CreateRoomOptions {
  name: string;
  isDefault?: boolean;
}

export function createRoom(options: CreateRoomOptions): Room {
  const { name, isDefault } = options;
  const room = rooms.insert({ name, isDefault: isDefault || false });
  rooms.save(room.id);
  return room;
}

export function allRooms(): Room[] {
  return rooms.array;
}

export function findRoomByName(name: string): Room | undefined {
  return rooms.chain.find({ name }).value();
}

const users: { [roomId: number]: User[] } = {};

export function getUsers(room: Room): User[] {
  return users[room.id];
}

export function join(room: Room, user: User) {
  users[room.id] = users[room.id] || [];
  users[room.id].push(user);
}

export function leaveAll(user: User) {
  Object.entries(users).forEach(([roomid, users]) => {
    const i = users.findIndex(maybeUser => maybeUser.id === user.id);
    if (i !== -1) users.splice(i, 1);
  });
}
