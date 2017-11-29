declare module "*.vue" {
  import Vue from 'vue';
  export default Vue;
}

declare module "@" {
}

declare module "config" {
  const conf: any;
  export default conf;
}

declare interface IConstructor<T> {
  new(...args: any[]): T;
}

declare module 'events' {
  export class EventEmitter {
    public emit(event: string, ...args: any[]): void;
    public on(event: string, fn: (event: any) => void): void;
  }
}
