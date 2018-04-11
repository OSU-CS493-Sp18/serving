var logger = require('./lib/logger');
var express = require('express');
var app = express();
var port = process.env.PORT || 8000;

var lodgings = require('./lodgings');

app.use(logger);

app.get('/', function (req, res, next) {
  res.status(200).send("Hello world!!\n");
});

app.get('/lodgings', function (req, res) {
  console.log("  -- req.query:", req.query);

  var page = parseInt(req.query.page) || 1;
  var numPerPage = 10;
  var lastPage = Math.ceil(lodgings.length / numPerPage);
  page = page < 1 ? 1 : page;
  page = page > lastPage ? lastPage : page;

  var start = (page - 1) * numPerPage;
  var end = start + numPerPage;
  var pageLodgings = lodgings.slice(start, end);

  res.status(200).json({
    lodgings: pageLodgings,
    pageNumber: page,
    totalPages: lastPage,
    pageSize: numPerPage,
    totalCount: lodgings.length
  });
});

app.get('/lodgings/:lodgingID', function (req, res, next) {
  console.log("  -- req.params:", req.params);
  res.status(200).end();
});

app.use('*', function (req, res, next) {
  res.status(404).json({
    err: "Path " + req.url + " does not exist"
  });
});

app.listen(port, function() {
  console.log("== Server is running on port", port);
});
