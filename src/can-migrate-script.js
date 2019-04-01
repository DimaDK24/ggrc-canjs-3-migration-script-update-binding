var kebabToCamel = function (kebab) {
  return kebab.replace(/-(.)/g, function (x, $1) {
    return $1.toUpperCase();
  });
};

const PROBABLY_NATIVE_TAGS = []

function isPropOfNativeElement(string, propPosition) {
  const NATIVE_ELEMENT_TAGS = ['input', 'textarea', 'select', 'p', 'div', 'span']
  const DEFINITELY_CUSTOM_TAGS = ['numberbox', 'spinner', 'dropdown', 'autocomplete',
  'datepicker', 'sort', 'permalink', 'shortlink', 'reminder']
  let localString = string.slice(0, propPosition)
  const indexOfClosestOpeningBracket = localString.lastIndexOf('<')
  localString = string.slice(indexOfClosestOpeningBracket + 1)
  const indexOfFirstSpace = localString.indexOf(' ')
  const tagName = localString.slice(0, indexOfFirstSpace).trim().toLowerCase()
  const probablyIsNative = !tagName.includes('-')
  // push tag if it's probably native and not included in NATIVE_ELEMENT_TAGS
  if (probablyIsNative && !PROBABLY_NATIVE_TAGS.includes(tagName)
    && !NATIVE_ELEMENT_TAGS.includes(tagName) && !DEFINITELY_CUSTOM_TAGS.includes(tagName)){
      PROBABLY_NATIVE_TAGS.push(tagName) 
    }
  return probablyIsNative && NATIVE_ELEMENT_TAGS.includes(tagName)
}

var _transformStache = function (src) {
  src = src.replace(/\{\^\$?([^}\n]+)\}=/g, function (x, $1) {
    return kebabToCamel($1) + ':to=';
  });
  src = src.replace(/\{\(\$?([^)\n]+)\)\}=/g, function (x, $1) {
    return kebabToCamel($1) + ':bind=';
  });
  src = src.replace(/\{\$?([^}\n]+)\}=/g, function (x, $1) {
    return kebabToCamel($1) + ':from=';
  });

  src = src.replace(/\(\$([^)\n]+)\)=/g, function (x, $1) {
    return 'on:el:' + kebabToCamel($1) + '=';
  });
  src = src.replace(/\(([^)\n]+)\)=/g, function (x, $1) {
    if (isPropOfNativeElement(src, offset)) return 'on:el:' + kebabToCamel($1) + '='
    return 'on:vm:' + kebabToCamel($1) + '=';
  });

  return src;
};

function removeCurliesInRightPart(src) {
  // regex tests and explanation: https://regex101.com/r/qQZfoq/latest
  return src.replace(/((?::to)|(?::from)|(?::bind))="\{([^{].*?[^}])\}"/g, (match, bindType, variableName) => {
    return `${bindType}="${variableName}"`
  })
}

var transformStache = function (src) {
  src = _transformStache(src);
  src = removeCurliesInRightPart(src)
  return src
};

var transformJs = function (src) {
  //find call to stache with a template passed in
  //note: only catches the call if a string is passed in and maynot work well if it's not one full string
  return src.replace(/(\bstache\(\s*(['"`]))((?:[^\\\2]|\\[\s\S])*?)(\2\s*\))/g, function (fullStr, $1, quoteType, $3, $4) {
    return $1 + transformStache($3) + $4;
  });
};

module.exports = {
  transformer: function transformer({ source, path }) {
    const extension = path.slice(path.lastIndexOf('.') + 1);
    if (extension === 'js') {
      return transformJs(source);
    } else if (extension === 'stache') {
      return transformStache(source);
    }
  },
  PROBABLY_NATIVE_TAGS,
  isPropOfNativeElement,
}