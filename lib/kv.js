var defines = require('node-oops').create
;

function KeyValue(k, v) {
	defines(this).enumerable
		.value('key', k)
		.value('value', v);
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
