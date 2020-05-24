import * as ts from 'typescript';
import { TypescriptCreator } from '../../helper/creator';
import { MockDefiner } from '../../mockDefiner/mockDefiner';
import { ModuleName } from '../../mockDefiner/modules/moduleName';
import { TypescriptHelper } from '../helper/helper';

export function GetMethodDescriptor(propertyName: ts.PropertyName, returnValue: ts.Expression): ts.Expression {
  const propertyValueFunction: ts.ArrowFunction = TypescriptCreator.createArrowFunction(ts.createBlock(
    [ts.createReturn(returnValue)],
    true,
  ));

  return propertyValueFunction;
}
