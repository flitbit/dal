var should   = require('should'),
util     = require('util'),
ptr = require('../lib/match/pointer')
;

// Test the data and JSON Pointers from the spec
// http://tools.ietf.org/html/draft-ietf-appsawg-json-pointer-07
var data = {
	"foo": ["bar", "baz"],
	"": 0,
	"a/b": 1,
	"c%d": 2,
	"e^f": 3,
	"g|h": 4,
	"i\\j": 5,
	"k\"l": 6,
	" ": 7,
	"m~n": 8
};

var p = ptr.create("#");
var resolved = p.resolve(data);
should.exist(resolved);
resolved.should.eql(data);
util.log("Resolved pointer `".concat(p.pointer,
	"` to path ", util.inspect(p.path, false, 2),
	" and value: ", util.inspect(resolved, false, 10)));

p = ptr.create("#/foo");
resolved = p.resolve(data);
should.exist(resolved);
resolved.should.eql(data.foo);
util.log("Resolved pointer `".concat(p.pointer,
	"` to path ", util.inspect(p.path, false, 2),
	" and value: ", util.inspect(resolved, false, 10)));


p = ptr.create("#/foo/0");
resolved = p.resolve(data);
should.exist(resolved);
resolved.should.eql(data.foo[0]);
util.log("Resolved pointer `".concat(p.pointer,
	"` to path ", util.inspect(p.path, false, 2),
	" and value: ", util.inspect(resolved, false, 10)));

p = ptr.create("#/");
resolved = p.resolve(data);
should.exist(resolved);
resolved.should.eql(data[""]);
util.log("Resolved pointer `".concat(p.pointer,
	"` to path ", util.inspect(p.path, false, 2),
	" and value: ", util.inspect(resolved, false, 10)));

p = ptr.create("#/a~1b");
resolved = p.resolve(data);
should.exist(resolved);
resolved.should.eql(data["a/b"]);
util.log("Resolved pointer `".concat(p.pointer,
	"` to path ", util.inspect(p.path, false, 2),
	" and value: ", util.inspect(resolved, false, 10)));

p = ptr.create("#/c%25d");
resolved = p.resolve(data);
should.exist(resolved);
resolved.should.eql(data["c%d"]);
util.log("Resolved pointer `".concat(p.pointer,
	"` to path ", util.inspect(p.path, false, 2),
	" and value: ", util.inspect(resolved, false, 10)));

p = ptr.create("#/e%5Ef");
resolved = p.resolve(data);
should.exist(resolved);
resolved.should.eql(data["e^f"]);
util.log("Resolved pointer `".concat(p.pointer,
	"` to path ", util.inspect(p.path, false, 2),
	" and value: ", util.inspect(resolved, false, 10)));

p = ptr.create("#/g%7Ch");
resolved = p.resolve(data);
should.exist(resolved);
resolved.should.eql(data["g|h"]);
util.log("Resolved pointer `".concat(p.pointer,
	"` to path ", util.inspect(p.path, false, 2),
	" and value: ", util.inspect(resolved, false, 10)));

p = ptr.create("#/i%5Cj");
resolved = p.resolve(data);
should.exist(resolved);
resolved.should.eql(data["i\\j"]);
util.log("Resolved pointer `".concat(p.pointer,
	"` to path ", util.inspect(p.path, false, 2),
	" and value: ", util.inspect(resolved, false, 10)));

p = ptr.create("#/k%22l");
resolved = p.resolve(data);
should.exist(resolved);
resolved.should.eql(data["k\"l"]);
util.log("Resolved pointer `".concat(p.pointer,
	"` to path ", util.inspect(p.path, false, 2),
	" and value: ", util.inspect(resolved, false, 10)));

p = ptr.create("#/%20");
resolved = p.resolve(data);
should.exist(resolved);
resolved.should.eql(data[" "]);
util.log("Resolved pointer `".concat(p.pointer,
	"` to path ", util.inspect(p.path, false, 2),
	" and value: ", util.inspect(resolved, false, 10)));

p = ptr.create("#/m~0n");
resolved = p.resolve(data);
should.exist(resolved);
resolved.should.eql(data["m~n"]);
util.log("Resolved pointer `".concat(p.pointer,
	"` to path ", util.inspect(p.path, false, 2),
	" and value: ", util.inspect(resolved, false, 10)));

