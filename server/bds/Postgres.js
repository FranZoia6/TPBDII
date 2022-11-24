class Postgres {
    constructor() {
        const sequelize = require('sequelize');

        const DB_USER = 'postgres',
            DB_PASS = 'postgres',
            DB_NAME = 'unlu',
            DB_CONNECTION = {
                host: 'localhost',
                dialect: 'postgres',
                logging: false
            };
        this.postgres = new sequelize(DB_NAME,
            DB_USER,
            DB_PASS,
            DB_CONNECTION);
    }

    async insert(query) {
        const model = await this.setModel(query);
        console.log(query);
        let row = {};
        query[4] = query[4].split('=');
        console.log(query);
        row[query[4][0]] = query[4][1];
        await model.create(row);
        console.log(model);
        return;
    }

    async update(query) {
        const model = await this.setModel(query);
        let row = {};
        query[4] = query[4].split('=');
        row[query[4][0]] = query[4][1];
        const where = { id: query[3] },
        obj = await model.findOne({ where });
        if (obj) {
            await obj.update(row);
        }
        return;
    }

    async delete(query) {
        const model = await this.setModel(query);
        const where = { id: query[3] },
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
            .describeTable(query[2]);
        schema.id.autoIncrement = true;
        delete schema.id.defaultValue;
        const model = this.postgres.define(query[2], schema, {
            tableName: query[2],
            timestamps: false
        });

        return model;

    }



}

module.exports = Postgres;