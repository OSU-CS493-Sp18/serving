console.log("Hello world!");

console.log("PORT:", process.env.PORT);

var fs = require('fs');
// fs.readFile();

var circle = require('./lib/circle');
var area = require('./lib/circle').area;
console.log("area(5):", circle.area(5));
console.log("circumference(5):", circle.circumference(5));

var figlet = require('figlet');

figlet("Hello world!", function(err, data) {
  if (!err) {
    console.log(data);
  }
});
