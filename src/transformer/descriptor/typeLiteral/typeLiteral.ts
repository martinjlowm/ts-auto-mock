import * as ts from 'typescript';
import { CreateMockMethod } from '../../mockFactoryCall/mockFactoryCall';
import { Scope } from '../../scope/scope';
import { GetProperties } from '../properties/properties';

export function GetTypeLiteralDescriptor(node: ts.TypeLiteralNode, scope: Scope): ts.Expression {
  if (!scope.currentMockKey) {
    return CreateMockMethod(node, scope);
  }

  return GetProperties(node, scope);
}
