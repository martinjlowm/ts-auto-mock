import * as ts from 'typescript';
import * as path from 'path';
import { GetDescriptor } from '../src/transformer/descriptor/descriptor';
import { GetTypeChecker, SetTypeChecker } from '../src/transformer/getTypeChecker';
import { MockDefiner } from '../src/transformer/mockDefiner/mockDefiner';

let mockDefiner: MockDefiner;

export function transformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
    SetTypeChecker(program.getTypeChecker());
    mockDefiner = new MockDefiner();

    return (context: ts.TransformationContext) => (file: ts.SourceFile) => {
        let sourceFile = visitNodeAndChildren(file, context);

        sourceFile = ts.updateSourceFileNode(sourceFile, [
            // ...mockDefiner.getImportsToAddInFile(sourceFile),
            ...mockDefiner.getExportsToAddInFile(sourceFile),
            ...sourceFile.statements
        ]);

        return sourceFile;
    };
}

function visitNodeAndChildren(node: ts.SourceFile, context: ts.TransformationContext): ts.SourceFile;
function visitNodeAndChildren(node: ts.Node, context: ts.TransformationContext): ts.Node;
function visitNodeAndChildren(node: ts.Node, context: ts.TransformationContext): ts.Node {
    return ts.visitEachChild(visitNode(node), childNode => visitNodeAndChildren(childNode, context), context);
}

function visitNode(node: ts.Node): ts.Node {
    if (!isKeysCallExpression(node)) {
        return node;
    }
    if (!node.typeArguments) {
        return ts.createArrayLiteral([]);
    }

    return ts.createCall(mockDefiner.generateFactoryIfNeeded(node.typeArguments[0] as ts.TypeReferenceNode), [], []);
}

const indexTs = path.join(__dirname, 'create-mock.ts');
function isKeysCallExpression(node: ts.Node): node is ts.CallExpression {
    if (node.kind !== ts.SyntaxKind.CallExpression) {
        return false;
    }

    const typeChecker = GetTypeChecker();
    const signature = typeChecker.getResolvedSignature(node as ts.CallExpression);
    if (typeof signature === 'undefined') {
        return false;
    }

    const { declaration } = signature;
    return !!declaration
        && (path.join(declaration.getSourceFile().fileName) === indexTs)
        && !!declaration['name']
        && (declaration['name'].getText() === 'createMock');
}