/* tslint:disable:no-console */
var rimraf = require("rimraf");

rimraf("documentation", function(err) {
    if (err) console.log(err);
    console.log("Successfully deleted a directory");
});
