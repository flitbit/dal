# dal [![Build Status](https://travis-ci.org/flitbit/dal.png)](http://travis-ci.org/flitbit/dal)

A javascript/nodejs module defining storage-engine agnostic data-access.

## Use

`dal` defines two primary abstractions, `Repo` and `Storage`.

+ `Repo` - a [_Repository_](http://martinfowler.com/eaaCatalog/repository.html); serves as an isolation layer between business logic and the backend storage engine.
+ `Storage` - adapter over a storage-engine's API; performs the actual IO in response to operations on the `Repo`.

