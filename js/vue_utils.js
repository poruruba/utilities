var hashs = {};
var searchs = {};

function proc_load() {
  hashs = parse_url_vars(location.hash);
  searchs = parse_url_vars(location.search);
}

function parse_url_vars(param){
  if( param.length < 1 )
      return {};

  var hash = param;
  if( hash.slice(0, 1) == '#' || hash.slice(0, 1) == '?' )
      hash = hash.slice(1);
  var hashs  = hash.split('&');
  var vars = {};
  for( var i = 0 ; i < hashs.length ; i++ ){
      var array = hashs[i].split('=');
      vars[array[0]] = array[1];
  }

  return vars;
}

function vue_add_methods(options, funcs){
    for(var func in funcs){
        options.methods[func] = funcs[func];
    }
}
function vue_add_computed(options, funcs){
    for(var func in funcs){
        options.computed[func] = funcs[func];
    }
}
