var oops        = require('node-oops')
, dbc           = oops.dbc
, defines       = oops.create
, JsonPointer   = require('json-ptr')
, JsonPath      = require('json-path')
;

function Query() {
}

function where(predicate) {
	dbc([typeof predicate === 'function'], "predicate must be a function");
	defines(this).value('predicate', predicate);
	return this;
}

function makeSelector(sel) {
	var keys = Object.keys(sel)
	, pointers = []
	, i = -1
	, len = keys.length
	, v;
	while(++i < len) {
		v = sel[keys[i]];
		if (typeof v === 'string' && v && v[0] === '#') {
			pointers.push(JsonPointer.create(v));
		} else {
			pointers.push(v);
		}
	}
	return function(it) {
		var res = {}
		, i = -1
		, p
		;
		while(++i < len) {
			p = pointers[i];
			if (p instanceof JsonPointer) {
				res[keys[i]] = p.get(it);
			} else {
				res[keys[i]] = p;
			}
		}
		return res;
	};
}

function select(selector) {
 	if (selector) {
		defines(this).value('selector', makeSelector(selector));
	}
	return this;
}

function applyFilter(source, filter) {
	var res = []
	, i = -1
	, len = source.length
	, it;
	var sel = function(p) {
		var pp = JsonPointer.create(p)
		return pp.get(it);
	}
	while(++i < len) {
		it = source[i];
		if (filter(it, sel)) {
			res.push(it);
		}
	}
	return res;
}

function applyFilterAndSelector(source, filter, selector) {
	var res = []
	, i = -1
	, len = source.length
	, it;
	var sel = function(p) {
		var pp = JsonPointer.create(p)
		return pp.get(it);
	}
	while(++i < len) {
		it = source[i];
		if (filter(it, sel)) {
			res.push(selector(it));
		}
	}
	return res;
}

function applySelector(source, selector) {
	var res = []
	, i = -1
	, len = source.length
	;
	while(++i < len) {
		res.push(selector(source[i]));
	}
	return res;
}

function from(source, callback) {
	try {
		source = (Array.isArray(source)) ? source : [source];
		var res;
		if (this.selector) {
			if (this.predicate) {
				res = applyFilterAndSelector(source, this.predicate, this.selector);
			}	else {
				res = applySelector(source, this.selector);
			}
		} else {
			if (this.predicate) {
				res = applyFilter(source, this.predicate);
			}	else {
				res = source.slice(0);
			}
		}
		callback(null, res);
	} catch(err) {
		callback(err);
	}
}

defines(Query).enumerable
.method(where)
.method(select)
.method(from)
;

defines(Query, true).enumerable
.method(function where(predicate) {
	var res = new Query();
	if (typeof predicate !== 'undefined') {
		res.where(predicate);
	}
	return res;
})
;

module.exports.Query = Query;