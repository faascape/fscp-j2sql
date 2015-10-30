
/*
 * Very simple javascript object to SQL mapper.
 * Given a javascript object, generate a string representing
 * sql command to insert, update or delete a line in database.
 * Each object property must have a table column with same name.
 * Managed type : Integer, Float, String, Date, Boolean, Object
 * For Object type mapped column name must be
 * containerProperty_containedProperty
 * Example : { col1:'myString', col2: { level2: 'another string' } }
 * 'another string' will be stored in column col2_level2
 */


/*
 * get a js date object and return a string formatted as
 * YYYY-MM-DD HH:MM:SS
 */

function formatDate(date) {
  var result = '';
  result = result+date.getFullYear()+'-';
  if(date.getMonth()+1 < 10) {
    result = result+'0';
  }
  result = result+(date.getMonth()+1);
  result = result+'-';
  if(date.getDate() < 10) {
    result = result+'0';
  }
  result = result+date.getDate();
  result = result+'T';
  if(date.getHours() < 10) {
    result = result+'0';
  }
  result = result+date.getHours()+':';
  if(date.getMinutes() < 10) {
    result = result +'0';
  }
  result = result+date.getMinutes()+':';
  if(date.getSeconds() < 10) {
    result = result+'0';
  }
  result = result+date.getSeconds();
  return result;
}


function isTypeDate(value) {
  return Object.prototype.toString.call(value) == '[object Date]';

}

/*
 * Given a javascript object, return a string containing all
 * properties name separated with comma.
 * Internal objects properties are named with the
 * containing property name as prefix
 * Example : { col1:'myString', col2: { level2: 'another string' } }
 * will return 'col1, col2_level2'
 */

function prop2String(obj, prefix) {
  if(prefix === undefined) {
    prefix = '';
  }
  var result = "";
  var prop;
  for(prop in obj) {
    if(result.length > 0 && result.substr(result.length-2) != ", ") {
      result = result+", ";
    }
    if(isTypeDate(obj[prop])) {
      result = result+prefix+prop;
    }
    else
      if(typeof obj[prop] == 'object') {
        result = result+prop2String(obj[prop], prop+"_");
      }
    else {
      if(obj[prop] !== undefined) {
        result = result+prefix+prop;
      }
    }
  }

if(result.substr(result.length-2) == ", ") {
  result = result.substr(0,result.length-2);
}

  return result;

}

/*
 * Given a javascript value, return a string representation
 * usable in sql command.
 * For a composed object, the return value is a string
 * representing a list of "name=value" for each property
 * of the object.
 */

function convert2SqlValue(value) {
  var result = '';
  if(typeof value  == 'string') {
    result = "'"+value.replace(/'/g, "''")+"'";
  }
  else
    if(isTypeDate(value)) {
      result = result+"'"+formatDate(value)+"'";
    }
  else
    if(value === null) {
      result = result + value;
    }
  else
    if(typeof value == 'object') {
      result = result + propEqValue2String(value);
    }
  else {		
    result = value;
  }
  return result;
}


/*
 * Given a javascript object, return a string
 * with a list of property=value separated with comma.
 * Value is formated to by compatible with sql.
 * For composed object property name is prefixed with
 * containing property.
 */


function propEqValue2String(obj, prefix) {
  prefix = prefix || '';
  var result= "";
  var prop;
  for(prop in obj) {
    if(result.length > 0 && result.substr(result.length-2) != ", ") {
      result = result+", ";
    }
    if(obj[prop] !== null && obj[prop] !== undefined && typeof obj[prop] == 'object' && !isTypeDate(obj[prop])) {
      result = result+propEqValue2String(obj[prop], prefix+prop+'_');
    }
    else {
      if(obj[prop] !== undefined) {
        result = result+prefix+prop+"=";
        result = result+convert2SqlValue(obj[prop]);
      }
    }
  }
  if(result.substr(result.length-2) == ", ") {
    result = result.substr(0,result.length-2);
  }

  return result;
}



/*
 * Given a javascript object, return a string representation
 * of all properties value separated with comma.
 */

function propValue2String(obj) {
  var result = "";
  var prop;
  for(prop in obj) {
    if(result.length > 0 && result.substr(result.length-2) != ", ") {
      result = result+", ";
    }
    if(isTypeDate(obj[prop])) {
      result = result+convert2SqlValue(obj[prop]);
    }
    else
      if(obj[prop] === null || obj[prop] === undefined) {
        // nothingToDo;
      }
      else
        if(typeof obj[prop] == 'object') {
          result = result+propValue2String(obj[prop]);
        }
        else {
          result =result+convert2SqlValue(obj[prop]);
        }
  }

  if(result.substr(result.length-2) == ", ") {
    result = result.substr(0,result.length-2);
  }

  return result;
}


/*
 * return an insert SQL command string for a given javascript object
 * table : name of sql table where to insert
 * obj : object containing values to be persisted
 */

exports.buildInsert = function(table, obj) {
  return  "insert into "+table+" ("+prop2String(obj)+") values("+propValue2String(obj)+");";
};

/* return an update SQL command string for a given javascript object
 * table : name of sql table where to update
 * obj : object containing values to be persisted
 * idname : name of property uniquely identifying the object in table
 */

exports.buildUpdate = function(table, obj, idName, idValue) {
  var criteriaName = '';
  var criteriaValue = '';
  if(!idValue) {
    criteriaName = idName || 'id';
    criteriaValue = convert2SqlValue(obj[criteriaName]);
    delete obj[criteriaName];
  }
  else {
    criteriaName = idName;
    criteriaValue = convert2SqlValue(idValue);
  }
  var request = "update "+table+" set "+propEqValue2String(obj);
  request = request + " where "+criteriaName+"="+criteriaValue+";";
  if(!idValue) {
    obj[criteriaName] = criteriaValue; 
  }
  return request;

};



/* return a delete SQL command string for a given javascript object
 * table : name of sql table where to delete
 * obj : object containing values to be deleted
 * idname : name of property uniquely identifying the object in table
 */


exports.buildDelete = function(table, obj, idname) {
  return  "delete from "+table+" where "+idname+"="+convert2SqlValue(obj[idname])+";";
};




/**************************************************************************************
 * select request generation
 * ************************************************************************************/


var Selector = exports.Selector = function(storeName) {
  this.storeName = storeName;
  this.fields = '*';
};


Selector.prototype.select = function(fields) {
  this.fields = fields;
  return this;
};


Selector.prototype.where = function(conditions) {
  this.conditions = conditions;
  return this;
};


Selector.prototype.values = function(values) {
  this.paramValues = values;
  return this;
};

Selector.prototype.group = function(group) {
  this.groupBy = group;
  return this;
};


Selector.prototype.order = function(order) {
  this.orderBy = order;
  return this;
};

Selector.prototype.limit = function(limit) {
  this.maxItem = limit;
  return this;
};


Selector.prototype.offset= function(index) {
  this.index = index;
  return this;
};



var buildSql = exports.buildSql = function(selector) {
  var sql = 'select '+selector.fields+
    ' from '+selector.storeName+' '+
    (selector.conditions && selector.conditions.length > 0 ? 'where '+selector.conditions.join(' and ')+' ':'')+
    (selector.groupBy ? 'group by '+selector.groupBy+' ' : '')+
    (selector.orderBy ? 'order by '+selector.orderBy+' ' : '')+
    (selector.maxItem ? 'limit '+selector.maxItem+' ' : '')+
    (selector.index ? 'offset '+selector.index+' ' : '');
  sql += ';';
  return sql;
};

Selector.prototype.buildSql = function() { 
  return buildSql(this);
};


