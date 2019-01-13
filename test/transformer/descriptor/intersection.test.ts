import { createMock } from "../../../src/transformer/create-mock";
import { Mock } from "ts-auto-mock";

describe('for intersection', () => {
    describe('interface', () => {
		interface IntersectionA {
			a: string;
		}

		interface IntersectionB {
			b: number;
		}
		interface Interface {
			intersection: IntersectionA & IntersectionB,
			anotherIntersection: IntersectionA & {
				c: boolean
			}
		}

		it('should merge all the values', () => {
			const properties: Interface = createMock<Interface>();
			expect(properties.intersection).toEqual({
				a: "",
				b: 0
			});

			expect(properties.anotherIntersection).toEqual({
				a: "",
				c: false
			})
		});
    });
    
    describe('literal', () => {
		interface Intersection {
			a: "s" & "s2";
		}
		it('should have undefined as value', () => {
			const properties: Intersection = createMock<Intersection>();
			expect(properties.a).toBeUndefined();
		});
    });
	
	describe('literal and basic', () => {
		type TypeIntersection = "s" & string & "s2";
		type TypeIntersectionNumber = {} & number;
		type TypeIntersectionString = {} & string;
		type TypeIntersectionBoolean = {} & boolean;
		type TypeIntersectionBooleanArray = {} & boolean[];
		
		interface Intersection {
			a: TypeIntersection;
			b: TypeIntersectionNumber
			c: TypeIntersectionBoolean
			d: TypeIntersectionBooleanArray
			e: TypeIntersectionString
		}
		it('should be undefined', () => {
			const properties: Mock<Intersection> = createMock<Intersection>();
			expect(properties.a).toBeUndefined();
			expect(properties.b).toBeUndefined();
			expect(properties.c).toBeUndefined();
			expect(properties.d).toBeUndefined();
			expect(properties.e).toBeUndefined();
		});
	});
});