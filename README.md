mimosa-eslint
===========

## Overview

This is a ESLint module for the Mimosa build tool. It will perform static code analysis on your JavaScript code.

For more information regarding Mimosa, see http://mimosa.io.
For more information regarding Hogan, see http://twitter.github.io/hogan.js/.

## Usage

Add `'hogan-static'` to your list of modules.  That's all!  Mimosa will install the module for you when you start `mimosa watch` or `mimosa build`.

## Functionality

During `mimosa watch` and `mimosa build` this module will use [Hogan](http://twitter.github.io/hogan.js/) to compile any `.html` or `.htm` files that it comes across.

This module provides the ability to provide custom config/setup/variables for each of your Hogan templates and includes support for using partials.

## Default Config

```javascript
hoganStatic: {
  partials: [],
  globals: {},
  contexts: {}
}
```

#### `partials` array of strings
A list of paths to partials.  You can include the path to a directory and all of the immediate contents of that directory will be read in and considered partials. Partials are loaded for compiling other hogan templtes, but partials are NOT written to the output directories.

#### `globals` object
The properties of the `globals` object are provided to all templates.

#### `contexts` object
An object of contexts(variables) for each hogan template.  The contexts object should have keys that are the names of the files without extension or path.  So `/assets/html/footer.html` would have a `footer` property in the `contexts` object.  The values of the `footer` property are provided to the `footer.html` when it is compiled. By default, a `pageName` property is added to all contexts and it equals the name of the page being compiled, ex: `footer`. Also added by default is a `boolean` property, set to `true`, that equals the file name minus and extension and folder path.  So for a `/assets/html/footer.html` file, a `footer:true` is added to the `footer` context object.

## Example Config

The following is a snippet of the configuration from the [Mimosa web site](https://github.com/dbashford/mimosa.io/tree/gh-pages) build.

```javascript
partials:["html/partials"],
globals: {
  version: "3.0.0"
},
contexts: {
  about: {
    title:"FAQ/Tips - Mimosa",
    desc:"Common questions and issues.",
    header:"FAQ & Mimosa Tips",
    lead:"Questions answered & tricks discussed"
  },
  commands: {
    title:"Commands - Mimosa",
    desc:"At the command line is where Mimosa's magic happens.",
    header:"Commands",
    lead:"Interact with your project via the command line"
  }
}  
```

* Note that `partials` above is a folder.
* Note that `version` is passed in as a global property so that every page has access to it.
* The `contexts` config assumes there is a file named `about.html` and a file named `commands.html`
