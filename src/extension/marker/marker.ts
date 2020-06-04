export class Marker {
  private static _instance: Marker;

  public static get instance(): Marker {
    this._instance = this._instance || new Marker();
    return this._instance;
  }

  private readonly _marker: symbol;

  private constructor() {
    this._marker = Symbol('__marker');
  }

  public get(): Symbol {
    return this._marker;
  }

  public override<T extends { [key in string | number | symbol]: unknown }, K extends keyof T>(some: T, type: string): T {
    return new Proxy(
      some,
      {
        get(_target: T, prop: string | number | symbol , receiver: T): T[K] {
          if (prop === this._marker) {
            return type as T[K];
          }

          return receiver[prop as K];
        },
      }
    );
  }
}
