import * as ts from 'typescript';
import { TypescriptCreator } from '../../helper/creator';
import { Scope } from '../../scope/scope';
import { TypeChecker } from '../../typeChecker/typeChecker';
import { TypescriptHelper } from '../helper/helper';
import { GetMockPropertiesFromDeclarations } from '../mock/mockProperties';
import { GetTypeQueryDescriptorFromDeclaration } from '../typeQuery/typeQuery';

type ExternalSource = ts.SourceFile | ts.ModuleDeclaration;

export function GetModuleDescriptor(node: ts.NamedDeclaration, scope: Scope): ts.Expression {
  const typeChecker: ts.TypeChecker = TypeChecker();

  const symbolAlias: ts.Symbol = typeChecker.getSymbolAtLocation(node.name);
  const symbol: ts.Symbol = typeChecker.getAliasedSymbol(symbolAlias);
  const externalModuleDeclaration: ts.NamedDeclaration = symbol.declarations[0];

  if (isExternalSource(externalModuleDeclaration)) {
    return GetPropertiesFromSourceFileOrModuleDeclarationDescriptor(externalModuleDeclaration, symbol, scope);
  }

  return GetTypeQueryDescriptorFromDeclaration(externalModuleDeclaration, scope);
}

function isExternalSource(declaration: ts.Node): declaration is ExternalSource {
  return ts.isSourceFile(declaration) || ts.isModuleDeclaration(declaration);
}

function GetPropertiesFromSourceFileOrModuleDeclarationDescriptor(sourceFile: ExternalSource, symbol: ts.Symbol, scope: Scope): ts.Expression {
  return GetMockPropertiesFromDeclarations(GetPropertiesFromSourceFileOrModuleDeclaration(symbol, scope), [], scope);
}

export function GetPropertiesFromSourceFileOrModuleDeclaration(symbol: ts.Symbol, scope: Scope): ts.PropertySignature[] {
  const typeChecker: ts.TypeChecker = TypeChecker();
  const moduleExports: ts.Symbol[] = typeChecker.getExportsOfModule(symbol);

  return moduleExports.map((prop: ts.Symbol): ts.PropertySignature => {
    const originalSymbol: ts.Symbol = TypescriptHelper.GetAliasedSymbolSafe(prop);
    const originalDeclaration: ts.NamedDeclaration = originalSymbol.declarations[0];
    const declaration: ts.Declaration = prop.declarations[0];

    if (ts.isExportAssignment(declaration)) {
      return TypescriptCreator.createPropertySignature('default', ts.createTypeQueryNode(originalDeclaration.name as ts.Identifier));
    }

    if (ts.isExportSpecifier(declaration) && ts.isSourceFile(originalDeclaration)) {
      const exportSpecifierSymbol: ts.Symbol = typeChecker.getSymbolAtLocation(declaration.name);
      const exportSpecifierAliasSymbol: ts.Symbol = typeChecker.getAliasedSymbol(exportSpecifierSymbol);
      const exportSpecifierProperties: ts.PropertySignature[] = GetPropertiesFromSourceFileOrModuleDeclaration(exportSpecifierAliasSymbol, scope);
      const propertyType: ts.TypeNode = ts.createTypeLiteralNode(exportSpecifierProperties);

      return TypescriptCreator.createPropertySignature(declaration.name, propertyType);
    }

    return TypescriptCreator.createPropertySignature(originalDeclaration.name as ts.Identifier, ts.createTypeQueryNode(originalDeclaration.name as ts.Identifier));
  });
}
