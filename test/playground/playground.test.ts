import { createMock} from 'ts-auto-mock';
import { ExtensionHandler , On } from 'ts-auto-mock/extension';


/*
 USE THIS FILE ONLY FOR TESTING NEW IMPLEMENTATION
 1) build the module you need
 2) run test:playground to see if it pass
 3) run build:playground to see the output generated

 */

describe('On', () => {
  it('should throw when is used without a mock', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(() => On({ prop: () => {} })).toThrow();
  });

  it('should return an ExtensionHandler when used with a mock', () => {
    expect(On(createMock<{prop: () => void}>())).toEqual(jasmine.any(ExtensionHandler));
  });
});
