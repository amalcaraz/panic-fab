declare module "*.vue" {
  import Vue from 'vue';
  export default Vue;
}

declare module "@" {
}

declare module "config" {
}

declare interface IConstructor<T> {
  new(...args: any[]): T;
}

declare module 'events' {
  export class EventEmitter {}
}
