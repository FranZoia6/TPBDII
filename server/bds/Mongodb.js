class Mongodb {
    constructor() {
        const { MongoClient } = require('mongodb');
        // or as an es module:
        // import { MongoClient } from 'mongodb'

        // Connection URL
        this.url = 'mongodb://localhost:27016';//7
        this.client = new MongoClient(this.url);

        // Database Name
        this.dbName = 'unlu';

    }

    async insert(query){
        //query[4] = query[4].split('=');
        await this.client.connect();
        const db = this.client.db(this.dbName);
        const collection = db.collection(query[1]);
        await collection.insertOne({ id: query[2], nombre:  query[3][1]});
        this.client.close();
        return;
    }

    async delete(query){
        await this.client.connect();
        const db = this.client.db(this.dbName);
        const collection = db.collection(query[1]);
        await collection.deleteOne({id: query[2]});
        this.client.close();
        return;
    }

    async update(query){
        query[3] = query[3].split('=');
        await this.client.connect();
        const db = this.client.db(this.dbName);
        const collection = db.collection(query[1]);
        await collection.updateOne({id: query[2]},{$set:{nombre: query[3][1]}});
        this.client.close();
        return;
    }

    async select(query){
        await this.client.connect();
        const db = this.client.db(this.dbName);
        const collection = db.collection(query[1]);
        const result = await collection.find({}).toArray();
        this.client.close();
        return result;
    } 
}

module.exports = Mongodb;