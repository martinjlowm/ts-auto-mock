import assert from 'assert';
import { Marker } from '../extension/marker/marker';

const marker: symbol = Marker.instance.get() as symbol;

// eslint-disable-next-line
type SignatureDescriptor = (...args: any[]) => any;
type IdentityFlavored<K> = K & { [key in symbol]: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MethodWithDeferredValue = (name: string, value: () => any) => () => any;

export class Repository {
  private readonly _repository: { [key: string]: SignatureDescriptor };
  private _wrapper: MethodWithDeferredValue | undefined;

  private constructor() {
    this._repository = {};
  }

  private static _instance: Repository;

  public static get instance(): Repository {
    this._instance = this._instance || new Repository();
    return this._instance;
  }

  // TODO: Rename this registerSignature to generalize it
  public registerFactory(identity: string, factory: SignatureDescriptor): void {
    return this.registerSignature(identity, factory);
  }

  public registerSignature(identity: string, factory: SignatureDescriptor): void {
    const wrapper: MethodWithDeferredValue | undefined = this._wrapper;

    this._repository[identity] = new Proxy(
      factory,
      {
        apply(func: SignatureDescriptor, _this: unknown, args: Parameters<SignatureDescriptor>): IdentityFlavored<SignatureDescriptor> | undefined {
          let t: IdentityFlavored<SignatureDescriptor> = func(...args);

          if (wrapper) {
            t = wrapper(identity, t);
          }

          if (typeof t === 'undefined') {
            return;
          }

          if (!(t instanceof Object)) {
            return t;
          }

          if (typeof t[marker] !== 'undefined') {
            return t;
          }

          Object.defineProperty(t, marker, {
            value: identity,
          });

          return t;
        },
      },
    );
  }

  public registerWrapper(method: MethodWithDeferredValue): void {
    this._wrapper = method;
  }

  public getIdentity(instance: IdentityFlavored<SignatureDescriptor>): string | null {
    if (!(instance instanceof Object)) {
      return null;
    }

    assert(instance[marker], 'TODO: Instance is not mocked.');

    return instance[marker];
  }

  public getFactory(key: string): SignatureDescriptor {
    return this.getSignatureDescriptor(key);
  }
  public getSignatureDescriptor(key: string): SignatureDescriptor {
    return this._repository[key];
  }


}
