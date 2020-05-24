import ts from 'typescript';

export interface MethodSignature extends ts.MethodSignature {
  parameters: ts.NodeArray<ParameterDeclaration>;
  type: ts.TypeNode;
}

export interface ParameterDeclaration extends ts.ParameterDeclaration {
  type: ts.TypeNode;
}
