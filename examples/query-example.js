var expect = require('expect.js'),
util       = require('util'),
Query      = require('../lib/query').Query
;

var items = [
{n: "one", i: 1, pig: false, james: [2,9,6] },
{n: "two", i: 2, pig: true, james: "what"},
{n: "three", i: 3, pig: false, james: [0,4,8]},
];

var q = Query
.where(function (item, ptr, path) {
	var i = ptr('/i');
	return (ptr('/pig') === false && i > 2)
		|| i === 2;
})
.select({pig: '#/pig', num: '#/n', j: '#/james/2'});

q.from(items, function (err, res) {
	console.log(util.inspect(err || res, false, 99));
});
