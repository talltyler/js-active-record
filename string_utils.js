module.exports = {
  toTitleCase: function(str){
    return str.replace(/\w\S*/g, function(txt){ return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
  },
  toSnakeCase: function(str){
    return str.replace(/\w\S*/g, function(txt){ return txt.charAt(0).toLowerCase() + txt.substr(1); });
  },
  toUnderscore: function(str){
     return str.replace(/([A-Z])/g, function(match){ return "_" + match.toLowerCase(); });
  }
};
