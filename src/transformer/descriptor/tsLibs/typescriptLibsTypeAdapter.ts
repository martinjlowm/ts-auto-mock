import * as ts from 'typescript';
import { TypescriptLibsTypes } from "./typescriptLibsTypes";
import { TypeChecker } from "../../typeChecker/typeChecker";
import { TypeReferenceCache } from "../typeReference/cache";

export function TypescriptLibsTypeAdapter(node): ts.Node {
    const type = TypeChecker().getTypeAtLocation(node);
    const typeScriptType = TypescriptLibsTypes[type.symbol.name];

	switch (typeScriptType) {
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
            const functionNode = ts.createNode(ts.SyntaxKind.VoidKeyword);
            return ts.createFunctionTypeNode([], [], functionNode as ts.TypeNode);
        case(TypescriptLibsTypes.Promise):
            const parameter = node.typeParameters[0];
            const type = TypeChecker().getTypeAtLocation(parameter);

            const promiseResolveType = TypeReferenceCache.instance.get(type);
            return ts.createCall(
                ts.createPropertyAccess(ts.createIdentifier("Promise"), ts.createIdentifier("resolve")),
                [],
                [promiseResolveType.descriptor]
            );
		default:
			return ts.createNode(ts.SyntaxKind.UndefinedKeyword);
	}
}