var assert = require('assert');
var persister = require('../js2sql.js')

describe('check SQL generation', function(){
	
	describe('check insert', function() {
		
		describe('check int insert', function() {
			it('should generate correct insert statement', function() {
				var obj = {
					int_value:1
				};
				var sql = persister.buildInsert('test_table', obj);
				assert.equal(sql, "insert into test_table (int_value) values(1);");
			})
		});
		
		describe('check string insert', function() {
			it('should generate correct insert statement', function() {
				var obj = {
					string_value:"this is a string with a quote[']"
				};
				var sql = persister.buildInsert('test_table', obj);
				assert.equal(sql, "insert into test_table (string_value) values('this is a string with a quote['']');");
			})
		});

		
		describe('check date insert', function() {
			it('should generate correct insert statement', function() {
				var dt = new Date(2000, 11, 25, 1, 2, 3);
				var obj = {
					date_value:dt
				};
				var sql = persister.buildInsert('test_table', obj);
				assert.equal(sql, "insert into test_table (date_value) values('2000-12-25T01:02:03');");
			})
		});		

		
		describe('check float insert', function() {
			it('should generate correct insert statement', function() {
				var obj = {
					float_value:3.1415
				};
				var sql = persister.buildInsert('test_table', obj);
				assert.equal(sql, "insert into test_table (float_value) values(3.1415);");
			})
		});		
		
		
		describe('check insert all types', function() {
			it('should generate correct insert statement', function() {
				var dt = new Date(2000, 11, 25, 1, 2, 3);
				var obj = {
					int_value:1,
					date_value:dt,
					float_value:3.1415,
					string_value:"this is a string with a quote[']"					
				};
				var sql = persister.buildInsert('test_table', obj);
				assert.equal(sql, "insert into test_table (int_value, date_value, float_value, string_value) values(1, '2000-12-25T01:02:03', 3.1415, 'this is a string with a quote['']');");
			})
		});		
		
	})


	describe('check update', function() {
		
		describe('check int update', function() {
			it('should generate correct update statement', function() {
				var obj = {
					id:'ID1',
					int_value:1
				};
				var sql = persister.buildUpdate('test_table', obj, 'id');
				assert.equal(sql, "update test_table set int_value=1 where id='ID1';");
			})
		});
		
		describe('check string update', function() {
			it('should generate correct update statement', function() {
				var obj = {
					id:'ID1',
					string_value:"this is a string with a quote[']"
				};
				var sql = persister.buildUpdate('test_table', obj, 'id');
				assert.equal(sql, "update test_table set string_value='this is a string with a quote['']' where id='ID1';");
			})
		});

		
		describe('check date update', function() {
			it('should generate correct update statement', function() {
				var dt = new Date(2000, 11, 25, 1, 2, 3);
				var obj = {
					id:'ID1',
					date_value:dt
				};
				var sql = persister.buildUpdate('test_table', obj, 'id');
				assert.equal(sql, "update test_table set date_value='2000-12-25T01:02:03' where id='ID1';");
			})
		});		

		
		describe('check float update', function() {
			it('should generate correct update statement', function() {
				var obj = {
					id:'ID1',
					float_value:3.1415
				};
				var sql = persister.buildUpdate('test_table', obj, 'id');
				assert.equal(sql, "update test_table set float_value=3.1415 where id='ID1';");
			})
		});		
		
		
		describe('check update all types', function() {
			it('should generate correct update statement', function() {
				var dt = new Date(2000, 11, 25, 1, 2, 3);
				var obj = {
					id:'ID1',
					int_value:1,
					date_value:dt,
					float_value:3.1415,
					string_value:"this is a string with a quote[']"					
				};
				var sql = persister.buildUpdate('test_table', obj);
				assert.equal(sql, "update test_table set int_value=1, date_value='2000-12-25T01:02:03', float_value=3.1415, string_value='this is a string with a quote['']' where id='ID1';");
			})
		});		
		
		
		describe('check int update with updatable id', function() {
			it('should generate correct update statement', function() {
				var obj = {
					id:'ID2',
					int_value:1
				};
				var sql = persister.buildUpdate('test_table', obj, 'id', 'ID1');
				assert.equal(sql, "update test_table set id='ID2', int_value=1 where id='ID1';");
			})
		});
		
		
		
	})


	describe('check delete', function() {
		it('should generate the correct delete statement', function() {
			var obj = {
				id:'ID3'	
			};
			var sql = persister.buildDelete('test_table', obj, 'id');
			assert.equal(sql, "delete from test_table where id='ID3';");
		});	
	});

	
});