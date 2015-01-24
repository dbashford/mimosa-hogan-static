"use strict";

var path = require( "path" )
  , hogan = require("hogan.js")
  , moduleConfig = require( "./config" )
  ;

var _compile = function( mimosaConfig, options, next ) {
  if ( options.files && options.files.length ) {
    var hS = mimosaConfig.hoganStatic;
    for ( var i = 0; i < options.files.length; i++ ) {
      var file = options.files[i];

      // only compile if file not registered as a partial
      if ( hS.fullPartialPaths.indexOf( file.inputFileName ) === -1) {
        var template = hogan.compile( file.inputFileText.toString() );
        var basename = path.basename( file.inputFileName, ".html" );
        var context = hS.contexts[basename];

        // Add file name as "true" to context for page
        if ( context.pageName && context.pageName === basename ) {
          context[basename] = true;
        }

        // render template passing in partials
        file.outputFileText = template.render(
          context,
          hS.registeredPartials
        );
      } else {
        // don't want to write the partial
        // mimosa won't write anything if there is no output text
        file.outputFileText = null;
      }
    }
  }
  next();
};

var registration = function (config, register) {
  register(
    ["add", "update", "buildFile"],
    "afterCompile",
    _compile,
    ["html", "htm"]
  );
};

module.exports = {
  registration: registration,
  defaults: moduleConfig.defaults,
  validate: moduleConfig.validate
};
