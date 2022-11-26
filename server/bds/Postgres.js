const { INTEGER } = require('sequelize');

class Postgres {
    constructor() {
         this.sequelize = require('sequelize');

        const DB_USER = 'postgres',
            DB_PASS = 'postgres',
            DB_NAME = 'unlu',
            DB_CONNECTION = {
                host: 'localhost',
                dialect: 'postgres',
                logging: false
            };
        this.postgres = new this.sequelize(DB_NAME,
            DB_USER,
            DB_PASS,
            DB_CONNECTION);
        this.version = 0;
    }

    getVersion(){
        return this.version;
    }

    setVersion(version){
        this.version = version;
    }

    async insert(query) {
        const model = await this.setModel(query);
        let row = {};
        query[3] = query[3].split('=');
        row[query[3][0]] = query[3][1];
        row['cod'] = Number(query[2]);
        await model.create(row);
        return;
    }

    async update(query) {
        const model = await this.setModel(query);
        let row = {};
        query[3] = query[3].split('=');
        row[query[3][0]] = query[3][1];
        const where = { cod: query[2] },
        obj = await model.findOne({ where });
        if (obj) {
            await obj.update(row);
        }
        return;
    }

    async delete(query) {
        const model = await this.setModel(query);
        const where = { cod: query[2] },
            obj = await model.findOne({ where });
        if (obj) {
            await obj.destroy();
        }
        return;
    }

    async select(query) {
        const model = await this.setModel(query);
        const where = {}, // TO-DO
            datos = await model.findAll({ where });
        return datos;
    }

    async setModel(query) {
        let schema = await this.postgres.getQueryInterface()
            .describeTable(query[1]);
        schema.id.autoIncrement = true;
        delete schema.id.defaultValue;
        const model = this.postgres.define(query[1], schema, {

            tableName: query[1],
            timestamps: false
        });

        return model;

    }

    async isConnected(){
    try{
       await this.postgres.query('Select 1',{raw:true  });//this.sequelize.QueryType.SELECT
        return true ; 
    }catch(err){
        return false;
    } 
    
    }



}

module.exports = Postgres;