#Dust Processor
This module is a set of tools to integrate and make easier the use of dust templates.

##Installation
Same as any node module

```bash
npm install dust-processor
```


##Usage
```javascript

var dust = require("dustjs-linkedin");
var dustp = require("dust-processor").create({dust: dust, baseDir: "./public"});


//Node.js require integration for handling .dust files
dustp.nodeRequire(require);

//Browserify-middleware support
app.use("/", browserify("./public", {
    extensions: [".dust"],
    transform: [dustp.transform]
}));
```


##Options

+ `dust` (required, Object) ... Dust is passed in to prevent multiple instances, as well as version conflicts
+ `baseDir` (required, String) ... this is the directory templates are named relative to
+ `Promise` (optional, Constructor) ... uses bluebird by default, this is used as the constructor for render calls (when using promises instead of callbacks)
+ `promiselib` (optional, String, `bluebird`) ... the string to `require` to make promises available when generating modules for the browser
+ `dustlib` (optional, String, `dustjs-linkedin/dist/dust-core.js`) ... the string to `require` to get the dust-core library in the browser
+ `define` (optional, Boolean, `false`) ... controls wrapping modules in a `define()` wrapper for requirejs
+ `renderStyle` (Optional, Enum, `hybrid`) Controls the generated api for the browser
    + `promise` ... Use the promise api exclusively
    + `callback` ... Use the callback api exclusively
    + `hybrid` ... Select promise or callback depending on if a callback was passed or not
