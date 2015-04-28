var DEFAULT_TABLE_NAME = 'sql_que';
var DEFAULT_DIRECTION = 'asc';

var SCHEMA = function(table){
    table.increments()
    table.text('que')
}

module.exports = function(options){
    var self = this;

    self.init = function(){
        self.knex = options.knex;
        self.tableName = options.tableName ?
            options.tableName : DEFAULT_TABLE_NAME;
        self.initDB();
    }

    self.add = function(toQue, callbackIn){
        self.knex(self.tableName)
            .insert({que: JSON.stringify(toQue)})
            .then(function(){ callbackIn(); })
            .catch(callbackIn)
    }

    // options include: direction (asc/desc), defaults to asc (last in)
    // returns null if que is empty else the que items
    self.get = function(optionsIn, callbackIn){
        var options = optionsIn ? optionsIn : {};
        var direction = options.direction ? options.direction : 'asc';
        var returnValue = null;


        self.knex.transaction(function(trx){

            self.knex(self.tableName)
                .select(['id', 'que'])
                .orderBy('id', direction)
                .limit(1)
                .transacting(trx)
                .then(function(rows) {
                    if( rows.length === 0 ){
                        return;
                    }
                    returnValue = JSON.parse(rows[0]['que']);
                    return self.knex(self.tableName)
                               .where('id', '=', rows[0]['id'])
                               .delete()
                               .transacting(trx);
                })
                .then(trx.commit)
                .catch(trx.rollback)
            })
            .then(function() {
                callbackIn(null, returnValue);
            })
            .catch(callbackIn);
    }

    self.initDB = function(){

        // check if table exists
        self.knex.schema.hasTable(self.tableName)
            .then(function(exists) {
                if( !exists ){
                    // create the table
                    self.knex.schema.createTable(self.tableName, SCHEMA)
                        .then(function(){})
                        .catch(function(err){ throw(err); })

                }
            })
            .catch(function(err){ throw(err); })
    }

    self.init()
}