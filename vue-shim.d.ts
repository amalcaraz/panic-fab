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
  export class EventEmitter<T = string, P = any> {
    public emit(event: T, ...args: P[]): void;
    public on(event: T, fn: (event: P) => any | void): void;
  }
}
