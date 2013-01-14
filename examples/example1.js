var repo = require('../lib/repo')
, kv     = require('../lib/kv')
, should = require('should')
, util   = require('util');

var it = new repo.Repo({ name: 'whatsit' });

function select(key) {
	it.lookup({ key: key }, function (err, res) {
		console.log('lookup: ' + util.inspect(err || res, false, 10));
	});
}

function remove(key) {
	it.remove(key, function (err, res) {
		console.log('remove: ' + util.inspect(err || res, false, 10));
	});
}

function store(key, then) {
	it.store(kv.create(key, { what: ['is', 'the', key] }),
	function(err, res) {
		console.log('store: ' + util.inspect(err || res, false, 10));
		if (then) { then(); }
	});
}

it.should.have.property('singular').eql('whatsit');
it.should.have.property('plural').eql('whatsits');
it.should.have.property('name').eql(it.plural);

select('example');
store('example', function() {
	select('example');
	remove('example');
	select('example');
	remove('example');
	var i;
	for(i = 0; i < 10; i++) {
		store('example_'.concat(i));
	}
	it.all(null, function(err, res) {
		console.log('all: ' + util.inspect(err || res, false, 10));
	});
});

