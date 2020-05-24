import * as ts from 'typescript';
import { Scope } from '../../scope/scope';
import { CreateMockMethod } from '../../mockFactoryCall/mockFactoryCall';
import { GetDescriptor } from '../descriptor';
import { GetNullDescriptor } from '../null/null';
import { GetMethodDescriptor } from './method';

export function GetMethodSignatureDescriptor(node: ts.MethodSignature, scope: Scope): ts.Expression {
  if (!scope.currentMockKey) {
    return CreateMockMethod(node, scope);
  }

  let returnType: ts.Expression;

  if (node.type) {
    returnType = GetDescriptor(node.type, scope);
  } else {
    returnType = GetNullDescriptor();
  }

  return GetMethodDescriptor(node.name, returnType);
}
