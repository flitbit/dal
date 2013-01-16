var oops  = require('node-oops')
, dbc     = oops.dbc
, defines = oops.create
, url     = require('url');

function decodePointer (ptr) {
	dbc([typeof ptr === 'string', ptr.length, ptr[0] === '#'], "Not a valid URI fragment.")
	if (ptr.length === 1) return [];
	var skip = 1;
	if (ptr[1] === '/') {
		skip++;
	}
	var path = ptr.substring(skip).split('/')
	, i = 0
	, len = path.length;
	for(; i < len; i++) {
		path[i] = decodeURIComponent(path[i]).replace('~0', '~').replace('~1', '/');
	}
	return path;
}

function encodePointer (path) {
	path = path || [];
	dbc([Array.isArray(path)], "Path must be an array of segments.");
	var clone = path.slice(0)
	, i = 0
	, len = path.length
	for(; i < len; i++) {
		clone[i] = encodeURIComponent(clone[i].replace('~', '~0').replace('/', '~1'));
	}
	return (len) ? "#/".concat(clone.join('/')) : "#";
}

function JsonPointer(ptr) {
	if (Array.isArray(ptr)) {
		defines(this).enumerable
		.value('pointer', encodePointer(ptr))
		.value('path', ptr)
		;
	} else {
		defines(this).enumerable
		.value('pointer', ptr)
		.value('path', decodePointer(ptr))
		;
	}
}

function resolve(obj) {
	if (typeof obj !== 'undefined') {
		var path = this.path
		, it = obj
		, len = path.length
		, cursor = 0
		, step, p;
		if (len) {
			while(cursor < len) {
				step = path[cursor++];
				if (Array.isArray(it)) {
					if (isNaN(step)) {
						break;
					}
					p = parseInt(step);
					if (it.length > p) {
						it = it[p];
					} else {
						break;
					}
				} else {
					it = it[step];
					if (typeof it === 'undefined') {
						break;
					}
				}
			}
			if (cursor === len) {
				return it;
			}
		} else {
		 return it;
		}
	}
	// implicit return undefined, allows us to
	// differentiate null as a valid value.
}

function toString() {
	return this.pointer;
}

defines(JsonPointer).enumerable
.method(resolve)
.method(toString)
;

defines(module.exports).enumerable
	.value('JsonPointer', JsonPointer)
	.method(function create (ptr) { return new JsonPointer(ptr); })
	.method(decodePointer)
	.method(encodePointer)
	;
