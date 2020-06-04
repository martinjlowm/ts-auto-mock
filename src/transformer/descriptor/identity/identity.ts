import ts from 'typescript';
import { MockDefiner } from '../../mockDefiner/mockDefiner';
import { ModuleName } from '../../mockDefiner/modules/moduleName';
import { PrivateIdentifier } from '../../privateIdentifier/privateIdentifier';

export function GetIdentityDescriptor(parameter: ts.Expression, declaration: ts.ParameterDeclaration): ts.Expression {
  const declarationType: ts.TypeNode | undefined = declaration.type;

  if (!declarationType) {
    return parameter;
  }


  if ([
    (): boolean => !ts.isTypeReferenceNode(declarationType),
    (): boolean => !ts.isObjectLiteralExpression(declarationType),
    (): boolean => !ts.isUnionTypeNode(declarationType),
    (): boolean => !ts.isIntersectionTypeNode(declarationType),
  ].every((condition: () => boolean): boolean => condition())) {
    return parameter;
  }

  return ts.createCall(
    ts.createPropertyAccess(
      ts.createPropertyAccess(
        ts.createPropertyAccess(
          MockDefiner.instance.getCurrentModuleIdentifier(ModuleName.Extension),
          PrivateIdentifier('Marker'),
        ),
        ts.createIdentifier('instance')),
      ts.createIdentifier('override'),
    ),
    [],
    [parameter, ts.createStringLiteral(declarationType.getText())],
  );
}
