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
    public on(event: T, fn: (data: P) => any | void): void;
  }
}

declare module 'vuetify/es5/util/colors' {
  interface Color {
    base: string;
    lighten5: string;
    lighten4: string;
    lighten3: string;
    lighten2: string;
    lighten1: string;
    darken1: string;
    darken2: string;
    darken3: string;
    darken4: string;
  }
  const colors: {[color: string]: Color}
  export = colors
}