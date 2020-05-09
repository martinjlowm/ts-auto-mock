import ts from 'typescript';
import { Scope } from '../../scope/scope';
import { PropertySignatureCache } from '../property/cache';
import { GetMethodDescriptor } from './method';

type functionAssignment = ts.ArrowFunction | ts.FunctionExpression;

export function GetFunctionAssignmentDescriptor(node: functionAssignment, scope: Scope): ts.Expression {
  const property: ts.PropertyName = PropertySignatureCache.instance.get();

  return GetMethodDescriptor(property, [node], scope);
}
