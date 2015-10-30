# fscp-js2sql : a very basic javascript object attributes to sql column mapper

## Description

This is NOT an ORM, it's much simpler than that. This module just try to map attribute value to colum name and value.
It just generate sql string and is not related to any database specific dialect. We just use very basic constructs.

## Usage

### insert

``` javascript

var persister = require('fscp-js2sql');

var obj = {
	myString:'Hello';
	myFloat:31415,
	myInt:1,
	myDate:new Date()
};

var sql = persister.buildInsert('myTable', obj);

``` 


### update with fix id

``` javascript

var persister = require('fscp-js2sql');

var obj = {
	id:'ID1',
	myString:'Hello';
	myFloat:31415,
	myInt:1,
	myDate:new Date()
};

var sql = persister.buildUpdate('myTable', obj, 'id');

``` 

### update with updated id value

``` javascript

var persister = require('fscp-js2sql');

var obj = {
	id:'ID2',
	myString:'Hello';
	myFloat:31415,
	myInt:1,
	myDate:new Date()
};

var sql = persister.buildUpdate('myTable', obj, 'id', 'ID1');

``` 




## NOTE

Tests may break due to attributes ordering, have to use regexp to validate some tests results.