var vows = require('vows'),
should   = require('should'),
util     = require('util'),
ptr = require('../lib/match/pointer')
;


vows.describe('JsonPointer')
.addBatch({
	'Given the IETF draft example': {
		topic: function() {
			return {
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
		},
		'and the pointer #': {
			topic: function(it) {
				this.data = it;
				return ptr.create("#");
			},
			'should resolve to the object itself': function (ptr) {
				var resolved = ptr.resolve(this.data);
				should.exist(resolved);
				resolved.should.eql(this.data);
			}
		},
		'and the pointer #/foo': {
			topic: function(it) {
				this.data = it;
				return ptr.create("#/foo");
			},
			'should resolve to the array ["bar", "baz"]': function (ptr) {
				var resolved = ptr.resolve(this.data);
				should.exist(resolved);
				resolved.should.eql(this.data.foo);
			}
		},
		'and the pointer #/foo/0': {
			topic: function(it) {
				this.data = it;
				return ptr.create("#/foo/0");
			},
			'should resolve to "bar"': function (ptr) {
				var resolved = ptr.resolve(this.data);
				should.exist(resolved);
				resolved.should.eql(this.data.foo[0]);
			}
		},
		'and the pointer #/': {
			topic: function(it) {
				this.data = it;
				return ptr.create("#/");
			},
			'should resolve to 0': function (ptr) {
				var resolved = ptr.resolve(this.data);
				should.exist(resolved);
				resolved.should.eql(this.data[""]);
			}
		},
		'and the pointer #/a~1b': {
			topic: function(it) {
				this.data = it;
				return ptr.create("#/a~1b");
			},
			'should resolve to 1': function (ptr) {
				var resolved = ptr.resolve(this.data);
				should.exist(resolved);
				resolved.should.eql(this.data["a/b"]);
			}
		},
		'and the pointer #/c%25d': {
			topic: function(it) {
				this.data = it;
				return ptr.create("#/c%25d");
			},
			'should resolve to 2': function (ptr) {
				var resolved = ptr.resolve(this.data);
				should.exist(resolved);
				resolved.should.eql(this.data["c%d"]);
			}
		},
		'and the pointer #/e%5Ef': {
			topic: function(it) {
				this.data = it;
				return ptr.create("#/e%5Ef");
			},
			'should resolve to 3': function (ptr) {
				var resolved = ptr.resolve(this.data);
				should.exist(resolved);
				resolved.should.eql(this.data["e^f"]);
			}
		},
		'and the pointer #/g%7Ch': {
			topic: function(it) {
				this.data = it;
				return ptr.create("#/g%7Ch");
			},
			'should resolve to 4': function (ptr) {
				var resolved = ptr.resolve(this.data);
				should.exist(resolved);
				resolved.should.eql(this.data["g|h"]);
			}
		},
		'and the pointer #/i%5Cj': {
			topic: function(it) {
				this.data = it;
				return ptr.create("#/i%5Cj");
			},
			'should resolve to 5': function (ptr) {
				var resolved = ptr.resolve(this.data);
				should.exist(resolved);
				resolved.should.eql(this.data["i\\j"]);
			}
		},
		'and the pointer #/k%22l': {
			topic: function(it) {
				this.data = it;
				return ptr.create("#/k%22l");
			},
			'should resolve to 6': function (ptr) {
				var resolved = ptr.resolve(this.data);
				should.exist(resolved);
				resolved.should.eql(this.data["k\"l"]);
			}
		},
		'and the pointer #/%20': {
			topic: function(it) {
				this.data = it;
				return ptr.create("#/%20");
			},
			'should resolve to 7': function (ptr) {
				var resolved = ptr.resolve(this.data);
				should.exist(resolved);
				resolved.should.eql(this.data[" "]);
			}
		},
		'and the pointer #/m~0n': {
			topic: function(it) {
				this.data = it;
				return ptr.create("#/m~0n");
			},
			'should resolve to 8': function (ptr) {
				var resolved = ptr.resolve(this.data);
				should.exist(resolved);
				resolved.should.eql(this.data["m~n"]);
			}
		}
	}
}).export(module);;