const { ClientClosedError } = require('redis');

class Redis{
   constructor(){
    const redis = require('redis');
    this.client = redis.createClient();
    }
    //redis-commander


   async insert(query){
        await this.client.connect();   
        //query[4] = query[4].split('=');
        this.client.set(query[3], query[4][1]);
        this.client.quit();
        return;
    } 

    async select(query){
        await this.client.connect();   
        var datos = [];//await this.client.get(query[3]);
       
        for await (const key of this.client.scanIterator()){
            var dato = await this.client.get(key);
            datos.push({'nombre' : dato, 'id' : key });
        }
        this.client.quit();
        return datos;
    }

    async delete(query){
        await this.client.connect();   
        this.client.del(query[3]);
        this.client.quit();
        return;
    } 

    
}

module.exports = Redis;