import ts from 'typescript';

function findNodes<T extends ts.Node>(node: ts.Node, kind: ts.SyntaxKind): T[] {
  const nodes: T[] = [];
  const helper = (child: ts.Node) => {
    if (child.kind === kind) {
      nodes.push(child as T);
    }
    ts.forEachChild(child, helper);
  };
  ts.forEachChild(node, helper);

  return nodes;
}

function hasImportDefined(
  rootNode: ts.SourceFile,
  moduleNamespace: string,
  moduleName: string
) {
  const imports = findNodes(rootNode, ts.SyntaxKind.ImportDeclaration).filter(
    (node: ts.ImportDeclaration) => {
      // console.log((node.moduleSpecifier as ts.StringLiteral).text);
      return (
        node.moduleSpecifier.kind == ts.SyntaxKind.StringLiteral &&
        (node.moduleSpecifier as ts.StringLiteral).text == moduleNamespace
      );
    }
  );

  if (imports.length > 0) {
    const alreadyPresent = imports
      .map((node: ts.ImportDeclaration) => {
        return node.importClause.namedBindings as ts.NamedImports;
      })
      .some(node => {
        return node.elements.some(element => {
          return element.name.text === moduleName;
        });
      });

    return alreadyPresent;
  }

  return false;
}

const createImportTransformer = (
  modules: Array<{ namespace: string; name: string }>
) => {
  return (context: ts.TransformationContext) => {
    return (rootNode: ts.SourceFile) => {
      function visit(node) {
        node = ts.visitEachChild(node, visit, context);

        if (node.kind === ts.SyntaxKind.SourceFile) {
          const newImports = modules.map(mod => {
            return ts.createImportDeclaration(
              undefined,
              undefined,
              ts.createImportClause(
                undefined,
                ts.createNamedImports([
                  ts.createImportSpecifier(
                    undefined,
                    ts.createIdentifier(mod.name)
                  )
                ])
              ),
              ts.createLiteral(mod.namespace)
            );
          });

          const copy = ts.getMutableClone(node);
          copy.statements = [...newImports, ...copy.statements];
          return copy;
        }

        if (ts.isArrayLiteralExpression(node)) {
          if (
            node.parent &&
            ts.isPropertyAssignment(node.parent) &&
            node.parent.name &&
            node.parent.name.getText() === 'imports'
          ) {
            return ts.createArrayLiteral(
              node.elements.concat(
                ...modules.map(mod => ts.createIdentifier(mod.name))
              ),
              true
            );
          }
        }

        return node;
      }

      return ts.visitNode(rootNode, visit);
    };
  };
};

export class TsUtils {
  parse(source: string): ts.SourceFile {
    return ts.createSourceFile(
      'main.ts',
      source,
      ts.ScriptTarget.ES2015,
      true,
      ts.ScriptKind.TS
    );
  }

  renderFile(source: ts.SourceFile): string {
    const printer = ts.createPrinter();
    return printer.printFile(source);
  }

  registerModules(
    source: ts.SourceFile,
    modules: Array<{ namespace: string; name: string }>
  ): ts.SourceFile {
    const newModules = modules.filter(mod => {
      return !hasImportDefined(source, mod.namespace, mod.name);
    });

    if (newModules.length > 0) {
      const result = ts.transform(source, [
        createImportTransformer(newModules)
      ]);
      return result.transformed[0];
    }

    return source;
  }

  showTree(node: ts.Node, indent: string = '    ') {
    console.log(indent + ts.SyntaxKind[node.kind]);

    if (node.getChildCount() === 0) {
      console.log(indent + '    Text: ' + node.getText());
    }

    for (let child of node.getChildren()) {
      this.showTree(child, indent + '    ');
    }
  }
}

export default TsUtils;
