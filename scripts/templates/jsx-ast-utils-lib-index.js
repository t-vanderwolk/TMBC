'use strict';

const eventHandlers = [
  'onCopy',
  'onCut',
  'onPaste',
  'onCompositionEnd',
  'onCompositionStart',
  'onCompositionUpdate',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onFocus',
  'onBlur',
  'onChange',
  'onInput',
  'onSubmit',
  'onClick',
  'onContextMenu',
  'onDblClick',
  'onDoubleClick',
  'onDrag',
  'onDragEnd',
  'onDragEnter',
  'onDragExit',
  'onDragLeave',
  'onDragOver',
  'onDragStart',
  'onDrop',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onSelect',
  'onTouchCancel',
  'onTouchEnd',
  'onTouchMove',
  'onTouchStart',
  'onScroll',
  'onWheel',
  'onAbort',
  'onCanPlay',
  'onCanPlayThrough',
  'onDurationChange',
  'onEmptied',
  'onEncrypted',
  'onEnded',
  'onError',
  'onLoadedData',
  'onLoadedMetadata',
  'onLoadStart',
  'onPause',
  'onPlay',
  'onPlaying',
  'onProgress',
  'onRateChange',
  'onSeeked',
  'onSeeking',
  'onStalled',
  'onSuspend',
  'onTimeUpdate',
  'onVolumeChange',
  'onWaiting',
  'onLoad',
  'onError',
  'onAnimationStart',
  'onAnimationEnd',
  'onAnimationIteration',
  'onTransitionEnd',
];

const eventHandlersByType = {
  clipboard: ['onCopy', 'onCut', 'onPaste'],
  composition: ['onCompositionEnd', 'onCompositionStart', 'onCompositionUpdate'],
  keyboard: ['onKeyDown', 'onKeyPress', 'onKeyUp'],
  focus: ['onFocus', 'onBlur'],
  form: ['onChange', 'onInput', 'onSubmit'],
  mouse: [
    'onClick',
    'onContextMenu',
    'onDblClick',
    'onDoubleClick',
    'onDrag',
    'onDragEnd',
    'onDragEnter',
    'onDragExit',
    'onDragLeave',
    'onDragOver',
    'onDragStart',
    'onDrop',
    'onMouseDown',
    'onMouseEnter',
    'onMouseLeave',
    'onMouseMove',
    'onMouseOut',
    'onMouseOver',
    'onMouseUp',
  ],
  selection: ['onSelect'],
  touch: ['onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart'],
  ui: ['onScroll'],
  wheel: ['onWheel'],
  media: [
    'onAbort',
    'onCanPlay',
    'onCanPlayThrough',
    'onDurationChange',
    'onEmptied',
    'onEncrypted',
    'onEnded',
    'onError',
    'onLoadedData',
    'onLoadedMetadata',
    'onLoadStart',
    'onPause',
    'onPlay',
    'onPlaying',
    'onProgress',
    'onRateChange',
    'onSeeked',
    'onSeeking',
    'onStalled',
    'onSuspend',
    'onTimeUpdate',
    'onVolumeChange',
    'onWaiting',
  ],
  image: ['onLoad', 'onError'],
  animation: ['onAnimationStart', 'onAnimationEnd', 'onAnimationIteration'],
  transition: ['onTransitionEnd'],
};

function normalizeName(value, ignoreCase = true) {
  if (!value || typeof value !== 'string') {
    return null;
  }
  return ignoreCase ? value.toLowerCase() : value;
}

function propName(node) {
  if (!node) {
    return null;
  }

  if (typeof node === 'string') {
    return node;
  }

  if (node && typeof node === 'object') {
    if ('name' in node && node.name && node.name !== node) {
      return propName(node.name);
    }
    if ('key' in node && node.key && node.key !== node) {
      return propName(node.key);
    }
  }

  switch (node.type) {
    case 'JSXIdentifier':
    case 'Identifier':
    case 'PrivateIdentifier':
      return node.name;
    case 'JSXNamespacedName': {
      const namespace = propName(node.namespace);
      const name = propName(node.name);
      if (namespace && name) {
        return `${namespace}:${name}`;
      }
      return null;
    }
    case 'JSXMemberExpression': {
      const object = propName(node.object);
      const property = propName(node.property);
      if (object && property) {
        return `${object}.${property}`;
      }
      return null;
    }
    case 'Literal':
    case 'StringLiteral':
    case 'NumericLiteral':
    case 'BooleanLiteral':
      return node.value;
    case 'TemplateLiteral':
      if (node.expressions.length === 0 && node.quasis.length === 1) {
        return node.quasis[0].value.cooked ?? node.quasis[0].value.raw;
      }
      return null;
    default:
      return null;
  }
}

function getNodeName(node) {
  if (!node) {
    return null;
  }
  if ('name' in node && node.name) {
    return propName(node.name);
  }
  if ('key' in node && node.key) {
    return propName(node.key);
  }
  return propName(node);
}

function getAttributeName(attribute) {
  if (!attribute) {
    return null;
  }
  if (attribute.type === 'JSXAttribute') {
    return propName(attribute.name);
  }
  return getNodeName(attribute);
}

function getProp(props, name, options = {}) {
  if (!Array.isArray(props) || !name) {
    return null;
  }

  const { ignoreCase = true } = options;
  const normalizedTarget = normalizeName(name, ignoreCase);

  for (const attribute of props) {
    if (!attribute) {
      continue;
    }

    if (attribute.type === 'JSXSpreadAttribute' || attribute.type === 'SpreadElement') {
      continue;
    }

    const attributeName = getAttributeName(attribute);
    if (!attributeName) {
      continue;
    }

    const normalizedAttribute = normalizeName(attributeName, ignoreCase);

    if (normalizedAttribute === normalizedTarget) {
      return attribute;
    }
  }

  return null;
}

function hasProp(props, name, options) {
  return Boolean(getProp(props, name, options));
}

function ensureArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (value == null) {
    return [];
  }
  return [value];
}

function hasAnyProp(props, names, options) {
  return ensureArray(names).some((name) => hasProp(props, name, options));
}

function hasEveryProp(props, names, options) {
  const list = ensureArray(names);
  if (list.length === 0) {
    return false;
  }
  return list.every((name) => hasProp(props, name, options));
}

function getPropValue(attribute) {
  if (!attribute) {
    return undefined;
  }

  if (attribute.type === 'Property' || attribute.type === 'PropertyDefinition') {
    return attribute.value;
  }

  if (!('value' in attribute)) {
    return undefined;
  }

  const { value } = attribute;
  if (value === null || value === undefined) {
    return true;
  }
  if (
    value.type === 'Literal'
    || value.type === 'StringLiteral'
    || value.type === 'NumericLiteral'
    || value.type === 'BooleanLiteral'
  ) {
    return value.value;
  }
  if (value.type === 'JSXExpressionContainer') {
    return value.expression;
  }
  return value;
}

function getLiteralPropValue(attribute) {
  const value = getPropValue(attribute);
  if (value === undefined) {
    return undefined;
  }
  if (value === true || typeof value !== 'object') {
    return value;
  }
  if (
    value.type === 'Literal'
    || value.type === 'StringLiteral'
    || value.type === 'NumericLiteral'
    || value.type === 'BooleanLiteral'
  ) {
    return value.value;
  }
  if (value.type === 'TemplateLiteral' && value.expressions.length === 0) {
    return value.quasis[0]?.value?.cooked ?? value.quasis[0]?.value?.raw;
  }
  return undefined;
}

function elementType(node) {
  if (!node) {
    return null;
  }

  if (node.type === 'JSXElement') {
    return elementType(node.openingElement);
  }

  if (node.type === 'JSXOpeningElement' || node.type === 'JSXClosingElement') {
    return propName(node.name);
  }

  if (node.openingElement) {
    return elementType(node.openingElement);
  }

  if (node.callee) {
    return propName(node.callee);
  }

  if (node.name) {
    return propName(node.name);
  }

  return null;
}

module.exports = {
  elementType,
  eventHandlers,
  eventHandlersByType,
  getLiteralPropValue,
  getProp,
  getPropValue,
  hasProp,
  hasAnyProp,
  hasEveryProp,
  propName,
};
