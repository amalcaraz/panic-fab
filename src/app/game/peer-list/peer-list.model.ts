export enum PeerState {
  FREE,
  BUSSY
}

export interface IPeerData {
  alias: string;
  state: PeerState;
  rooms: string[];
}
