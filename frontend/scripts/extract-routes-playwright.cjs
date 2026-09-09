const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const appTsxPath = path.join(__dirname, '..', 'src', 'App.tsx');
const outputJsonPath = path.join(__dirname, '..', 'routes.json');

const content = fs.readFileSync(appTsxPath, 'utf-8');
const sourceFile = ts.createSourceFile('App.tsx', content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

const routes = new Set();
const pathStack = [];

function resolvePath(parts) {
  const cleanParts = parts.filter(Boolean).map(p => p.replace(/^\/+|\/+$/g, ''));
  return '/' + cleanParts.join('/');
}

function addRoute(routePath) {
  if (!routePath) return;
  // Exclude wildcard catch-alls and dynamic callback routes
  if (routePath.includes('*') || routePath.includes('callback')) {
    return;
  }
  routes.add(routePath);
}

function visit(node) {
  let pushedPath = null;

  if (ts.isJsxElement(node)) {
    const tagName = node.openingElement.tagName.getText(sourceFile);
    if (tagName === 'Route') {
      let routePath = null;
      let isIndex = false;
      for (const attr of node.openingElement.attributes.properties) {
        if (ts.isJsxAttribute(attr)) {
          const name = attr.name.getText(sourceFile);
          if (name === 'path' && attr.initializer && ts.isStringLiteral(attr.initializer)) {
            routePath = attr.initializer.text;
          } else if (name === 'index') {
            isIndex = true;
          }
        }
      }

      if (isIndex) {
        addRoute(resolvePath(pathStack));
      } else if (routePath) {
        const full = routePath.startsWith('/') ? routePath : resolvePath([...pathStack, routePath]);
        pushedPath = routePath;
        pathStack.push(routePath);
        addRoute(full);
      }
    }

    ts.forEachChild(node, visit);

    if (pushedPath !== null) {
      pathStack.pop();
    }
  } else if (ts.isJsxSelfClosingElement(node)) {
    const tagName = node.tagName.getText(sourceFile);
    if (tagName === 'Route') {
      let routePath = null;
      let isIndex = false;
      for (const attr of node.attributes.properties) {
        if (ts.isJsxAttribute(attr)) {
          const name = attr.name.getText(sourceFile);
          if (name === 'path' && attr.initializer && ts.isStringLiteral(attr.initializer)) {
            routePath = attr.initializer.text;
          } else if (name === 'index') {
            isIndex = true;
          }
        }
      }

      if (isIndex) {
        addRoute(resolvePath(pathStack));
      } else if (routePath) {
        const full = routePath.startsWith('/') ? routePath : resolvePath([...pathStack, routePath]);
        addRoute(full);
      }
    }
  } else {
    ts.forEachChild(node, visit);
  }
}

visit(sourceFile);

const routesArray = Array.from(routes);
fs.writeFileSync(outputJsonPath, JSON.stringify(routesArray, null, 2) + '\n');

console.log(`Successfully extracted ${routesArray.length} authoritative routes to routes.json`);
