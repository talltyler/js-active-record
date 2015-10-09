'use strict';

class MemoryAdapter {
  constructor(){
    this.tables = {};
  }

  addIndex(klass, column){
    var name = klass.name;
    var table = this.tables[name];
    if(table){
      table.indexes[column] = {};
    }
  }

  create(instance,changes,props){
    var name = instance.constructor.name;
    if(!this.tables[name]){
      this.tables[name] = {indexes:{},records:[]};
    }
    var table = this.tables[name];
    var record = {};
    table.records.push(record);
    this.addIndex(instance,'id');
    changes.id = table.records.length;
    Object.assign(changes,props);
    this.update(instance,changes,record);
    return record;
  }

  update(instance,changes,record){
    var name = instance.constructor.name;
    var table = this.tables[name];
    if(!record && table.indexes.id && table.indexes.id[instance.id]){
      record = table.indexes.id[instance.id];
    }
    if(record && changes){
      Object.keys(changes).forEach(function(column){
        instance[column] = record[column] = changes[column];
        if(table.indexes[column]){
          table.indexes[column][changes[column]] = record;
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
