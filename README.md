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
var Promise = require("bluebird");
var dustp = require("dust-processor").create({
    dust: dust,                                     //REQUIRED - instance of dust to use for compiling/rendering
    baseDir: "./public",                            //REQUIRED - the base directory for templates (also used for naming)
    Promise: Promise,                               //instance of Promise to use for rendering
    define: false,                                  //for middleware/builds, wraps in a define block (requirejs)
    promiselib: "bluebird",                         //promise library to require from built files
    dustlib: "dustjs-linkedin/dist/dust-core.js"    //dust library to require from built files
});


//Node.js require integration for handling .dust files
dustp.nodeRequire(require);

//Browserify-middleware support
app.use("/", browserify("./public", {
    extensions: [".dust"],
    transform: [dustp.transform]
}));

