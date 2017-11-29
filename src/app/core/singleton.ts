export abstract class SingletonFactory {

  public static getInstance<T extends object>(type: IConstructor<T>, ...args: any[]): T {

    if (!SingletonFactory.instances[type.name]) {

      SingletonFactory.instances[type.name] = new type(...args);

    }

    return SingletonFactory.instances[type.name] as T;

  }

  private static instances: { [k: string]: object } = {};

}
