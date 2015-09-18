'use strict';

class MemoryAdapter {
  constructor(){
    this.tables = {};
  }

  create(instance){
    var name = instance.constructor.name;
    if(!this.tables[name]){
      this.tables[name] = {indexes:{id:{}},records:[]};
    }
    var table = this.tables[name];
    var record = {id:table.records.length};
    table.records.push(record);
    table.indexes.id[record.id] = record;
    instance.id = record.id;
    this.update(instance);
    return record;
  }

  createIndex(instance, name){
    var name = instance.constructor.name;
    var table = this.tables[name];
    table.indexes[name] = {};
    instance.id = record.id;
    this.update(instance);
    return record;
  }

  update(instance){
    var name = instance.constructor.name;
    var table = this.tables[name];
    var record = table.indexes.id[instance.id];
    Object.keys(instance.changes).forEach(function(column){
      record[column] = instance.changes[column];
      if(table.indexes[column]){
        table.indexes[column][instance.changes[column]] = record;
      }
    });
  }

  delete(instance){
    var name = instance.constructor.name;
    var table = this.tables[name];
    var record = table.indexes.id[instance.id];
    var index = table.records.indexOf(record);
    table.records.splice(index,1);
    table.indexes.id[instance.id] = null;
    delete table.indexes.id[instance.id];
  }

  find(instance,options){
    var name = instance.constructor.name;
    var table = this.tables[name];
    var offset = options.offset || 0;
    var limit = options.limit || table.records.length;
    var where = options.where;
    var results = [];
    main:
    for(let i=offset; i<limit; i++){
      let record = table.records[i];
      inner:
      for(let key in where){
        if(record[key] !== where[key]){
          continue main;
        }
      }
      results.push(record);
    }
    return results;
  }

}
module.exports = MemoryAdapter;
