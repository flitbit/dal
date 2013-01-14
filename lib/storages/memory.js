var oops  = require('node-oops')
, dbc     = oops.dbc
, defines = oops.create
, kv      = require('../kv')
, Storage = require('../storage').Storage
;

function MemoryStorage() {
  MemoryStorage.super_.call(this);
  defines(this).value('_items', {});
}
oops.inherits(MemoryStorage, Storage);

function byKey(key, callback) {
	var value = this._items[key];
	if (typeof value === 'undefined') {
		callback(null, { not_found: key });
	} else {
		callback(null, { ok: kv.create(key, value) });
  }
}

function lookup(spec, callback) {
  if (spec.key) {
    this.byKey(spec.key, callback);
  } else if (spec.match) {
    this.match(spec.match, callback);
  } else if (spec.mapred) {
    this.match(spec.mapred, callback);
  } else {
    callback(new Error('Storage engine does not comprehend the spec provided by the caller.'));
  }
}

function match(spec, callback) {
  callback(new Error('not implemented'));
}

function mapred(spec, callback) {
	callback(new Error('not implemented'));
}

function store(item, callback) {
  dbc([typeof item === 'object'], "item must be an object.");
  if (typeof item.key === 'undefined') {
    callback(new Error('Storage engine only supports storing items that have a key.'));
  }
  this._items[item.key] = item.value;
  callback(null, { ok: item });
}

function remove(key, callback) {
  dbc([typeof key !== 'undefined'], "key must be provided.");
  var removed = (typeof this._items[key] !== 'undefined');
  if (removed) {
    delete this._items[key];
    callback(null, { ok: key });
	} else {
		callback(null, { not_found: key });
  }
}

function all(options, callback) {
  if (options) {
    callback(new Error('Storage engine does not comprehend the options provided by the caller.'));
  } else {
		var items = this._items
		, result = []
		, keys = Object.keys(items)
		, k;
		for(k = 0; k < keys.length; k++) {
			result.push(kv.create(keys[k], items[keys[k]]));
		}
    callback(null, { ok: result });
  }
}

defines(MemoryStorage).configurable.enumerable
  .method(all)
  .method(byKey)
  .method(lookup)
  .method(mapred)
  .method(match)
  .method(remove)
  .method(store);

module.exports.MemoryStorage = MemoryStorage;
module.exports.create = function() {
	return new MemoryStorage();
};
