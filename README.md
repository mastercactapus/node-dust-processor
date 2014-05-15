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
    dust: dust,          //your instance/version of dust to use
    baseDir: "./public"  //base directory to get templates from
});


//Node.js require integration for handling .dust files
dustp.nodeRequire(require);

//Browserify-middleware support
app.use("/", browserify("./public", {
    extensions: [".dust"],
    transform: [dustp.transform]
}));
```


##Options

