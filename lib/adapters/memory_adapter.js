'use strict';

class MemoryAdapter {
  constructor(){
    this.tables = {};
  }

  addIndex(instance, column){
    var name = instance.constructor.name;
    var table = this.tables[name];
    if(table){
      table.indexes[column] = {};
    }
  }

  create(instance,props){
    var name = instance.constructor.name;
    if(!this.tables[name]){
      this.tables[name] = {indexes:{},records:[]};
    }
    var table = this.tables[name];
    var record = {};
    table.records.push(record);
    this.addIndex(instance,'id');
    instance.changes.id = table.records.length;
    Object.assign(instance.changes,props);
    this.update(instance,record);
    return record;
  }

  update(instance,record){

    var name = instance.constructor.name;
    var table = this.tables[name];
    if(!record && table.indexes.id && table.indexes.id[instance.id]){
      record = table.indexes.id[instance.id];
    }
    if(record && instance.changes){
      Object.keys(instance.changes).forEach(function(column){
        instance[column] = record[column] = instance.changes[column];
        if(table.indexes[column]){
          table.indexes[column][instance.changes[column]] = record;
        }
      });
    }
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

  find(className,options){
    var table = this.tables[className];
    var offset = options.offset || 0;
    var limit = options.limit || table.records.length;
    var results = [];
    main:
    for(let i=offset; i<limit+offset; i++){
      let record = table.records[i];
      for(let key in options){
        if(record[key] && record[key] !== options[key]){
          continue main;
        }
      }
      results.push(record);
    }
    return results;
  }

}
module.exports = MemoryAdapter;
