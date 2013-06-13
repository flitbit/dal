var oops = require('node-oops')
, dbc = oops.dbc
, defines = oops.create
;

function KeyValue(key, value) {
	dbc([typeof key !== 'undefined'], 'Invalid argument `key` at position zero (0); KeyValue with an undefined key is meaningless.')
	defines(this).enumerable
		.value('key', key)
		.value('value', value);
}

function hasKey() {
	return (typeof this.key !== 'undefined')
	&& this.key !== null;
}

defines(KeyValue).enumerable
	.property(hasKey);

module.exports.KeyValue = KeyValue;
module.exports.create = function(k,v) {
	return new KeyValue(k,v);
};
