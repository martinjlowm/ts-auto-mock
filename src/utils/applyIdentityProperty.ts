import { Marker } from '../extension/marker/marker';

// eslint-disable-next-line
type Function<K> = (...args: any[]) => K;
type IdentityFlavored<K> = K & { [key in symbol]: string };

export function applyIdentityProperty<K extends object, T extends Function<K>>(target: T, identity: string): T {
  return new Proxy(
    target,
    {
      apply(func: T, _this: unknown, args: Parameters<T>): IdentityFlavored<K> | undefined {
        const t: IdentityFlavored<K> = func(...args);

        if (typeof t === 'undefined') {
          return;
        }

        if (!(t instanceof Object)) {
          return t;
        }

        // eslint-disable-next-line
        const marker: unique symbol = Marker.instance.get() as any;

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
