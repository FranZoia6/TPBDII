class Mongodb {
    constructor() {
        const { MongoClient, Collection } = require('mongodb');
        // or as an es module:
        // import { MongoClient } from 'mongodb'

        // Connection URL
        this.url = 'mongodb://localhost:27017';
        this.client = new MongoClient(this.url);

        // Database Name
        this.dbName = 'unlu';

        this.version = 0;

    }

    getVersion(){
        return this.version;
    }

    setVersion(version){
        this.version = version;
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
       // query[3] = query[3].split('=');
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

    async isConnected(){
        try{
            await this.client.connect();
            return true ; 
        }catch{
            return false;
        } 
    }

 async replicar(datos){
        await this.client.connect();  
        const db = this.client.db(this.dbName);
        const collection = db.collection('clientes')
       await db.collection('clientes').deleteMany({});
       for (var dato of datos){
          await collection.insertOne(dato.dataValues) ;

        }
        this.client.close();
        return;
    }
}


module.exports = Mongodb;