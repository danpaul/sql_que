var SqlQue = require('../index');

var dbCreds = {
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'twitter_stream_base',
        port:  8889
    }
}

var knex = require('knex')(dbCreds)

var sqlQue = new SqlQue({'knex': knex});

sqlQue.add([1,2,3,4], function(err){
    if( err ){ throw(err); }
    else{
        console.log('success enqueing');
        sqlQue.get({}, function(err, results){
            if( err ){
                throw(err);
            } else {
                console.log(results);
            }
        });
    }
})