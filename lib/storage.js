var oops = require('node-oops')
, defines = oops.create
, Hooked = require('hooked').Hooked
;

function Storage(options) {
	Storage.super_.call(this);
	defines(this).value('_producesKeys', (options && options.producesKeys));
}
oops.inherits(Storage, Hooked);

/**
 * Indicates whether the storage can produce keys for
 * newly stored items.
 */
function producesKeys() {
	return (this._producesKeys);
}

/**
 * Retrieves a stored item by `key`.
 *
 * @param key the item's key.
 * @param optional {function} callback
 */
function byKey(key, callback) {
	callback(new Error('not implemented'));
}

function match(spec, callback) {
	callback(new Error('not implemented'));
}

function mapred(spec, callback) {
	callback(new Error('not implemented'));
}

function lookup(spec, callback) {
	callback(new Error('not implemented'));
}

function store(item, callback) {
	callback(new Error('not implemented'));
}

function remove(key, callback) {
	callback(new Error('not implemented'));
}

function all(options, callback) {
	callback(new Error('not implemented'));
}

function count(callback) {
	callback(new Error('not implemented'));
}

defines(Storage).enumerable
	.property(producesKeys)
	;

defines(Storage).configurable.enumerable
	.method(all)
	.method(byKey)
	.method(lookup)
	.method(mapred)
	.method(match)
	.method(remove)
	.method(store)
	;

module.exports.Storage = Storage;
