import assert from 'assert';
import ts from 'typescript';
import { MethodSignature, ParameterDeclaration } from './types';

export namespace TypescriptCreator {
  export function createArrowFunction(block: ts.ConciseBody, parameter: ReadonlyArray<ts.ParameterDeclaration> = []): ts.ArrowFunction {
    return ts.createArrowFunction(undefined, undefined, parameter, undefined, ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), block);
  }

  export function createFunctionExpression(block: ts.Block, parameter: ReadonlyArray<ts.ParameterDeclaration> = []): ts.FunctionExpression {
    return ts.createFunctionExpression(undefined, undefined, undefined, undefined, parameter, undefined, block);
  }

  export function createFunctionExpressionReturn(descriptorToReturn: ts.Expression, parameter: ReadonlyArray<ts.ParameterDeclaration> = []): ts.FunctionExpression {
    const block: ts.Block = ts.createBlock([ts.createReturn(descriptorToReturn)]);

    return ts.createFunctionExpression(undefined, undefined, undefined, undefined, parameter, undefined, block);
  }

  export function createCall(expression: ts.Expression, argumentExpressions: ts.Expression[]): ts.CallExpression {
    return ts.createCall(
      expression,
      undefined,
      argumentExpressions,
    );
  }

  export function createVariableStatement(declarations: ts.VariableDeclaration[]): ts.VariableStatement {
    return ts.createVariableStatement(undefined, declarations);
  }

  export function createIIFE(block: ts.Block): ts.CallExpression {
    return ts.createCall(
      ts.createParen(ts.createFunctionExpression(
        undefined,
        undefined,
        undefined,
        undefined,
        [],
        undefined,
        block,
      )),
      undefined,
      [],
    );
  }

  export function createEmptyProperty(): ts.PropertyDeclaration {
    return createProperty('', undefined);
  }

  export function createProperty(propertyName: string | ts.PropertyName, type: ts.TypeNode | undefined): ts.PropertyDeclaration {
    return ts.createProperty(undefined, undefined, propertyName, undefined, type, undefined);
  }

  export function createPropertySignature(propertyName: string | ts.PropertyName, type: ts.TypeNode): ts.PropertySignature {
    return ts.createPropertySignature([], propertyName, undefined, type, undefined);
  }

  export function createParameter(parameterName: string): ts.ParameterDeclaration {
    return ts.createParameter(
      undefined,
      undefined,
      undefined,
      ts.createIdentifier(parameterName),
      undefined,
      undefined,
      undefined,
    );
  }

  export function createMethod(methodName: string, body: ts.Block, parameterNames: ts.Identifier[] = []): ts.MethodDeclaration {
    const parameters: ts.ParameterDeclaration[] = parameterNames.map((parameterName: ts.Identifier) => ts.createParameter(
      undefined,
      undefined,
      undefined,
      parameterName,
      undefined,
      undefined,
      undefined,
    ));
    return ts.createMethod(
      undefined,
      undefined,
      undefined,
      ts.createIdentifier(methodName),
      undefined,
      undefined,
      parameters,
      undefined,
      body,
    );
  }

  function isDefinitiveMethodSignature(signature: ts.MethodSignature): signature is MethodSignature {
    return !!signature.type;
  }

  function isDefinitiveParameterDeclaration(parameter: ts.ParameterDeclaration): parameter is ParameterDeclaration {
    return !!parameter.type;
  }

  export function createMethodSignature(parameterTypes: Array<ts.TypeNode | undefined> = [], returnType: ts.TypeNode | undefined): MethodSignature {
    const parameters: ParameterDeclaration[] = parameterTypes
      .filter((type: ts.TypeNode | undefined): type is ts.TypeNode => !!type)
      .map((parameterType: ts.TypeNode, i: number) => {
        // TODO: Merge/move this block with/to typescriptLibs.ts
        if (ts.isTypeReferenceNode(parameterType)) {
          const declaration: ts.Declaration = TypescriptHelper.GetDeclarationFromNode(parameterType.typeName);
          if (IsTypescriptType(declaration)) {
            parameterType = ts.createFunctionTypeNode(undefined, [], ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword));
          }
        }

        const parameter: ts.ParameterDeclaration = ts.createParameter(
          undefined,
          undefined,
          undefined,
          `__${i++}`,
          undefined,
          parameterType,
          undefined,
        );

        assert(isDefinitiveParameterDeclaration(parameter), 'TODO: Document me');

        return parameter;
      });

    const signature: ts.MethodSignature = ts.createMethodSignature(
      undefined,
      parameters,
      returnType || ts.createKeywordTypeNode(ts.SyntaxKind.NullKeyword),
      '',
      undefined,
    );

    assert(isDefinitiveMethodSignature(signature), 'TODO: Document me');

    return signature;
  }


  export function createVariableDeclaration(variableIdentifier: ts.Identifier, initializer: ts.Expression): ts.VariableDeclaration {
    return ts.createVariableDeclaration(
      variableIdentifier,
      undefined,
      initializer,
    );
  }
}
