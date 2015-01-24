"use strict";

var path = require( "path" )
  , fs = require( "fs" )
  ;

exports.defaults = function() {
  return {
    hoganStatic: {
      partials: [],
      globals: {},
      contexts: {}
    }
  };
};

var _registerPartial = function( hS, partialPath ) {
  hS.fullPartialPaths.push( partialPath );
  var partialText = fs.readFileSync( partialPath ).toString();
  var partialName = path.basename( partialPath, ".html" );
  hS.registeredPartials[partialName] = partialText;
};

var _readPartials = function( mimosaConfig, errors ) {
  var hS = mimosaConfig.hoganStatic;
  hS.registeredPartials = {};
  hS.fullPartialPaths = [];

  var partials = hS.partials;
  for ( var i = 0; i < partials.length; i++ ) {
    var partPath = path.join( mimosaConfig.watch.sourceDir, partials[i] );
    var exists = fs.existsSync( partPath );
    if (exists) {
      var stat = fs.statSync( partPath );
      if (stat.isFile()) {
        _registerPartial( hS, partPath );
      } else {
        fs.readdirSync( partPath )
        .map( function( p ){ return path.join(partPath, p); })
        .forEach( function( p ){ _registerPartial( hS, p); } );
      }
    } else {
      errors.push("hoganStatic partial path does not exist, [[ " + partPath + " ]]");
    }
  }
};

exports.validate = function ( config, validators ) {
  var errors = []
    , hS = config.hoganStatic
    ;

  if ( validators.ifExistsIsObject( errors, "hoganStatic config", hS ) ) {
    if ( validators.ifExistsIsArrayOfStrings( errors, "hoganStatic.partials", hS.partials ) ) {
      _readPartials( config, errors );
    }

    var globalsValid = validators.ifExistsIsObject( errors, "hoganStatic.globals", hS.globals );
    var contextsValid = validators.ifExistsIsObject( errors, "hoganStatic.contexts", hS.contexts );
    if ( globalsValid && contextsValid ) {
      for ( var context in hS.contexts ) {
        // specific context valid?
        if ( validators.ifExistsIsObject( errors, "hoganStatic.contexts[" + context + "]", hS.contexts[context] ) ) {
          for ( var global in hS.globals ) {
            if ( hS.contexts[context][global] === undefined ) {
              hS.contexts[context][global] = hS.globals[global];
            }
            hS.contexts[context].pageName = context;
          }
        }
      }
    }
  }

  return errors;
};
