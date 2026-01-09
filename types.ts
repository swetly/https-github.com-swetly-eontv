
export interface Channel {
  id: string;
  name: string;
  logo?: string;
}

export enum ControlAction {
  PROGRAM_UP = 'PROGRAM_UP',
  PROGRAM_DOWN = 'PROGRAM_DOWN',
  VOLUME_UP = 'VOLUME_UP',
  VOLUME_DOWN = 'VOLUME_DOWN',
  MUTE = 'MUTE',
  ENTER = 'ENTER'
}
