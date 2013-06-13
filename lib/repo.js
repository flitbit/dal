var oops   = require('node-oops')
, defines  = oops.create
, dbc      = oops.dbc
, Hooked   = require('hooked').Hooked
, memory   = require('./memory')
, KeyValue = require('./kv').KeyValue
, inflect  = require('inflection');

function Repo(options) {
	dbc([options, typeof options.name === 'string', options.name.length],
		"options must have a name member.");
	Repo.super_.call(this, { unhooked: ['key', 'sanitize'] });
	var _storage = options.storage || memory.create();

	defines(this).property('storage'
		, function() {
			if (!_storage) {
				throw new Error('Storage has not been specified for \''.concat(this.name, '\'.'));
			}
			return _storage;
		}
		, function (value) {
			_storage = value;
		});

	defines(this).enumerable
		.value('plural', inflect.pluralize(options.name))
		.value('singular', inflect.singularize(options.name))
		;

	if (options.key) {
		// options defines the key...
		var key = options.key;
		if (typeof k === 'string' && key) {
			// the key will be a property of the item being stored...
			defines(this).enumerable.method(function calculateKey(v) {
				var k = v[key];
				if (typeof k === 'undefined' && !this.storage.producesKeys) {
					throw new Error('Item does not contain a key; it must have a member named \''.concat(key, '\' to be used by the repo.'));
				}
				return k;
			});
		}
		else if (typeof key === 'function') {
			// the key will be calculated based on the supplied function...
			defines(this).enumerable.method(function calculateKey(v) {
				var k = key(v);
				if (typeof k === 'undefined' && !this.storage.producesKeys) {
					throw new Error('A key must be provided in order to store the item.');
				}
				return k;
			});
		}
	}
}
oops.inherits(Repo, Hooked);

function calculateKey(v) {
	if (!this.storage.producesKeys) {
		throw new Error('A key must be provided in order to store the item.');
	}
}

function sanitize(data) {
	return data;
}

function validate(data, next) {
	next(null, data);
}

function lookup(spec, callback) {
	this.storage.lookup(spec, callback);
}

function store(item, callback) {
	dbc(typeof item === 'object', "item must be an object.");
	var key, that = this, storage = this.storage;
	if (item instanceof KeyValue) {
		this.validate(item.value, function(err, unused) {
			if (err) {
				if (callback) { callback(err); }
				return;
			}
			if (item.hasKey) {
				storage.store(item, callback);
			} else {
				// try to calculate a key...
				key = that.calculateKey(item.value);
				if (typeof key !== 'undefined') {
					item = new KeyValue(key, item.value);
				}
				storage.store(item, callback);
			}
		});
	} else {
		this.validate(item, function(err, unused) {
			if (err) {
				if (callback) { callback(err); }
				return;
			}
			key = that.calculateKey(item);
			storage.store(new KeyValue(key, item), callback);
		});
	}
}

function remove(key, callback) {
	this.storage.remove(key, callback);
}

function all(options, callback) {
	this.storage.all(options, callback);
}

function count(callback) {
	this.storage.count(callback);
}

function getName() {
	return this.plural;
}

defines(Repo).enumerable
	.property('name', getName)
	;

defines(Repo).configurable.enumerable
	.method(sanitize)
	.method(calculateKey)
	.method(all)
	.method(lookup)
	.method(remove)
	.method(store)
	.method(validate)
	;

module.exports.Repo = Repo;
module.exports.create = function(options) {
	return new Repo(options);
};
