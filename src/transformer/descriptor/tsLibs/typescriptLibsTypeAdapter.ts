import * as ts from 'typescript';
import { TypescriptLibsTypes } from "./typescriptLibsTypes";
import { GetEmptyMethodDescriptor } from "../method/method";
import { TypeChecker } from "../../typeChecker/typeChecker";

export function TypescriptLibsTypeAdapter(type: TypescriptLibsTypes): ts.Node {
	switch (type) {
		case(TypescriptLibsTypes.Array):
		case(TypescriptLibsTypes.ReadonlyArray):
			return ts.createNode(ts.SyntaxKind.ArrayType);
		case(TypescriptLibsTypes.Number):
			return ts.createNode(ts.SyntaxKind.NumberKeyword);
		case(TypescriptLibsTypes.String):
			return ts.createNode(ts.SyntaxKind.StringKeyword);
		case(TypescriptLibsTypes.Boolean):
			return ts.createNode(ts.SyntaxKind.BooleanKeyword);
		case(TypescriptLibsTypes.Object):
            return ts.createNode(ts.SyntaxKind.TypeLiteral);
        case(TypescriptLibsTypes.Function):
            const type = ts.createNode(ts.SyntaxKind.VoidKeyword);
            return ts.createFunctionTypeNode([], [], type as ts.TypeNode);
		default:
			return ts.createNode(ts.SyntaxKind.UndefinedKeyword);
	}
}