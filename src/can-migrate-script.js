var kebabToCamel = function (kebab) {
  return kebab.replace(/-(.)/g, function (x, $1) {
    return $1.toUpperCase();
  });
};

var transformStacheExplicit = function (src) {
  src = src.replace(/\{\^\$([^}\n]+)\}=/g, function (x, $1) {
    return 'el:' + kebabToCamel($1) + ':to=';
  });
  src = src.replace(/\{\^([^}\n]+)\}=/g, function (x, $1) {
    return 'vm:' + kebabToCamel($1) + ':to=';
  });

  src = src.replace(/\{\(\$([^)\n]+)\)\}=/g, function (x, $1) {
    return 'el:' + kebabToCamel($1) + ':bind=';
  });
  src = src.replace(/\{\(([^)\n]+)\)\}=/g, function (x, $1) {
    return 'vm:' + kebabToCamel($1) + ':bind=';
  });

  src = src.replace(/\{\$([^}\n]+)\}=/g, function (x, $1) {
    return 'el:' + kebabToCamel($1) + ':from=';
  });
  src = src.replace(/\{([^}\n]+)\}=/g, function (x, $1) {
    return 'vm:' + kebabToCamel($1) + ':from=';
  });

  src = src.replace(/\(\$([^)\n]+)\)=/g, function (x, $1) {
    return 'on:el:' + kebabToCamel($1) + '=';
  });
  src = src.replace(/\(([^)\n]+)\)=/g, function (x, $1) {
    return 'on:vm:' + kebabToCamel($1) + '=';
  });

  return src;
};

var transformStacheContextIntuitive = function (src) {
  src = src.replace(/\{\^\$?([^}\n]+)\}=/g, function (x, $1) {
    return kebabToCamel($1) + ':to=';
  });
  src = src.replace(/\{\(\$?([^)\n]+)\)\}=/g, function (x, $1) {
    return kebabToCamel($1) + ':bind=';
  });
  src = src.replace(/\{\$?([^}\n]+)\}=/g, function (x, $1) {
    return kebabToCamel($1) + ':from=';
  });
  src = src.replace(/\(\$?([^)\n]+)\)=/g, function (x, $1) {
    return 'on:' + kebabToCamel($1) + '=';
  });

  return src;
};

var transformStache = function (src, useImplicitBindings) {
  return useImplicitBindings ?
    transformStacheContextIntuitive(src) :
    transformStacheExplicit(src);
};

var transformJs = function (src, useImplicitBindings) {
  //find call to stache with a template passed in
  //note: only catches the call if a string is passed in and maynot work well if it's not one full string
  return src.replace(/(\bstache\(\s*(['"`]))((?:[^\\\2]|\\[\s\S])*?)(\2\s*\))/g, function (fullStr, $1, quoteType, $3, $4) {
    return $1 + transformStache($3, useImplicitBindings) + $4;
  });
};

module.exports = function transformer({source, path}, useImplicitBindings) {
  const extension = path.slice(path.lastIndexOf('.') + 1);

  if (extension === 'js') {
    return transformJs(source, useImplicitBindings);
  } else if (extension === 'stache') {
    return transformStache(source, useImplicitBindings);
  }
}