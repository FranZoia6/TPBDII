class Mongodb {
    constructor() {
        const { MongoClient } = require('mongodb');
        // or as an es module:
        // import { MongoClient } from 'mongodb'

        // Connection URL
        this.url = 'mongodb://localhost:27017';
        this.client = new MongoClient(this.url);

        // Database Name
        this.dbName = 'unlu';

    }

    async insert(query){
        query[4] = query[4].split('=');
        await this.client.connect();
        const db = this.client.db(this.dbName);
        const collection = db.collection('clientes');
        await collection.insertOne({ id: query[3], nombre:  query[4][1]});
        this.client.close();
        return;
    }

    async delete(query){
        await this.client.connect();
        const db = this.client.db(this.dbName);
        const collection = db.collection('clientes');
        await collection.deleteOne({id: query[3]});
        this.client.close();
        return;
    }

    async update(query){
        query[4] = query[4].split('=');
        await this.client.connect();
        const db = this.client.db(this.dbName);
        const collection = db.collection('clientes');
        await collection.updateOne({id: query[3]},{$set:{nombre: query[4][1]}});
        this.client.close();
        return;
    }

    async select(query){
        await this.client.connect();
        const db = this.client.db(this.dbName);
        const collection = db.collection('clientes');
        const result = await collection.find({}).toArray();
        this.client.close();
        return result;
    } 
}

module.exports = Mongodb;