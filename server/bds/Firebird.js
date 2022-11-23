class Firebird {
    constructor() {
        this.firebird = require('node-firebird');
        this.options = {};
        this.options.host = '127.0.0.1';
        this.options.port = 3050;
        this.options.database = 'C:\\Users\\Fran Zoia\\Desktop\\UNLu\\Base de datos II\\UNLU.fdb';
        this.options.user = 'sysdba';
        this.options.password = 'masterkey';
        this.options.lowercase_keys = true; // set to true to lowercase keys
        this.options.role = null;            // default
        this.options.pageSize = 4096;        // default when creating database
        this.options.pageSize = 4096;        // default when creating database
        this.options.retryConnectionInterval = 1000; // reconnect interval in case of connection drop
        this.options.blobAsText = false; // set to true to get blob as text, only affects blob subtype 1
    }

    async insert(query) {
        //query[4] = query[4].split('=');
        this.firebird.attach(this.options, function (err, db) {
            if (err) {
                console.error(err);
                throw err;
            }
            db.transaction(Firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
                if (err) {
                    throw err;
                }
                transaction.query("INSERT INTO " + query[2] + " (ID, NOMBRE) VALUES(" + query[3] + "  , '" + query[4][1] + "')", function (err, result) {
                    if (err){
                        transaction.rollback();
                        throw err;
                    }
                    transaction.commit();
                    });
                db.detach();
            });
        });
    }
    async delete(query) {
        this.firebird.attach(this.options, function (err, db) {
            if (err)
                throw err;
            db.query("DELETE FROM " + query[2] + " WHERE ID = " + query[3], function (err, result) {
                if (err)
                    throw err;
                db.detach();
            });
        });
    }

    async update(query) {
        query[4] = query[4].split('=');
        this.firebird.attach(this.options, function (err, db) {
            if (err)
                throw err;
            db.query("UPDATE " + query[2] + " SET " + query[4][0] + " = '" + query[4][1] + "' WHERE ID = " + query[3], function (err, result) {
                if (err)
                    throw err;
                db.detach();
            });
        });
    }

    async attach() {
        const self = this;
        return new Promise(function (res, rej) {
            self.firebird.attach(self.options, function (err, db) {
                if (err) {
                    return rej(err);
                }

                res(db);
            })
        })
    }

    async query(db, query) {
        return new Promise(function (res, rej) {
            db.query(query, function (err, result) {
                if (err) {
                    return rej(err);
                }

                res(result);
            });
        })
    }

    async select(query) {
        const db = await this.attach(),
            _query = 'SELECT * FROM ' + query[2],
            result = await this.query(db, _query);

        for (var row of result) {
            row.nombre = row.nombre.toString();

        }

        db.detach();

        return result;
    }
}

module.exports = Firebird;