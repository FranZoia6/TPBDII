class Firebird {
    constructor() {
        this.firebird = require('node-firebird');
        this.options = {};
        this.options.host = '127.0.0.1';
        this.options.port = 3050;
        this.options.database = 'C:\\Users\\Fran Zoia\\Desktop\\UNLu\\Base de datos II\\UNLU.fdb';
        this.options.user = 'sysdba';
        this.options.password = 'masterkey';
        this.options.lowercase_keys = false; // set to true to lowercase keys
        this.options.role = null;            // default
        this.options.pageSize = 4096;        // default when creating database
        this.options.pageSize = 4096;        // default when creating database
        this.options.retryConnectionInterval = 1000; // reconnect interval in case of connection drop
        this.options.blobAsText = false; // set to true to get blob as text, only affects blob subtype 1



    }

    async insert(query) {
        query[4] = query[4].split('=');
        this.firebird.attach(this.options, function (err, db) {

            if (err)
                throw err;
            db.query("INSERT INTO " + query[2] +  " (ID, NOMBRE) VALUES("+ query[3]  +"  , '" + query[4][1] + "')", function (err, result) {
                if (err)
                    throw err;
                db.detach();
            });
        });
    }
    async delete(query){
        this.firebird.attach(this.options, function (err, db) {
            if (err)
                throw err;
            db.query("DELETE FROM " + query[2] +  " WHERE ID = " + query[3] , function (err, result) {
                if (err)
                    throw err;
                db.detach();
            });
        });
    }
    async select(query)
    {
        var pool = firebird.pool(5, this.options);
        pool.get(function(err, db) {
        db.query('SELECT * FROM TABLE'+ query[2], function(err, result) {
                // IMPORTANT: release the pool connection
                db.detach();
                console.log(result);
            });
        });
   }
}

module.exports = Firebird;