import * as ts from 'typescript';
import { MethodSignature, TypescriptCreator } from '../../helper/creator';
import { MockDefiner } from '../../mockDefiner/mockDefiner';
import { Scope } from '../../scope/scope';
import { TypeChecker } from '../../typeChecker/typeChecker';
import { GetReturnNodeFromBody } from './bodyReturnType';
import { GetMethodDescriptor } from './method';

function GenerateKeyFor(declaration: ts.Declaration): void {
  // NOTE: We generate a key so we're able to determine what call expressions
  // are mocked by this library. With that knowledge, we can proxy the
  // non-primitive inputs so we can identify them in conditional logic based on
  // overload signatures.
  MockDefiner.instance.getDeclarationKeyMap(declaration);
}

export function GetMethodDeclarationDescriptor(node: ts.MethodDeclaration | ts.FunctionDeclaration, scope: Scope): ts.Expression {
  const declarationType: ts.Type | undefined = TypeChecker().getTypeAtLocation(node);
  const methodDeclarations: Array<ts.MethodDeclaration | ts.FunctionDeclaration> = declarationType.symbol.declarations
    .filter(
      (declaration: ts.Declaration): declaration is ts.MethodDeclaration | ts.FunctionDeclaration =>
        ts.isMethodDeclaration(declaration) || ts.isFunctionDeclaration(declaration)
    );

  if (!methodDeclarations.length) {
    methodDeclarations.push(node);
  }

  const methodSignatures: MethodSignature[] = methodDeclarations.map((signature: ts.MethodDeclaration | ts.FunctionDeclaration) => {
    GenerateKeyFor(signature);

    let signatureType: ts.TypeNode | undefined = signature.type;

    if (!signatureType) {
      signatureType = ts.createLiteralTypeNode(GetReturnNodeFromBody(signature) as ts.LiteralExpression);
    }

    return TypescriptCreator.createMethodSignature(
      signature.parameters.map((p: ts.ParameterDeclaration) => p.type),
      signatureType,
    );
  });

  if (!node.name) {
    throw new Error(
      `The transformer couldn't determine the name of ${node.getText()}. Please report this incident.`,
    );
  }

  return GetMethodDescriptor(node.name, methodSignatures, scope);
}
