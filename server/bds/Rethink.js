class Rethink {
    constructor(){
         this.r = require('rethinkdb'),
			this.r.connect({ db: 'unlu' });

    }

    async insert(query){
        let row = {};
        query[3] = query[3].split('=');
        row[query[3][0]] = query[3][1];
    
        this.r.table(query[2])
         .insert(row)
         .run(await conn, function(result) {
         });
        return;
    }

    async update(query){
        let row = {};
        query[4] = query[4].split('=');
        row[query[4][0]] = query[4][1];

        this.r.table(query[2])
         .get(query[3])
         .update(row)
         .run(await conn, function(result) { });
        return;

    }

	async delete(query){
		this.r.table(query[2])
		.get(query[3])
		.delete()
		.run(await conn, function(result) {});
	   return;
	}

	async select(query){
		this.r.table(query[2])
		.run(await conn, async function(err, datos) {
			   datos = await datos.toArray();	
		});
	   return JSON.stringify(row);
	}
}

module.exports = Rethink;


/*	
			case 'RETHINKDB':			
				if (query[1] === 'INSERT') {
					let row = {};
					query[3] = query[3].split('=');
					row[query[3][0]] = query[3][1];

					r.table(query[2])
					 .insert(row)
					 .run(await conn, function(result) {
						 socket.write('.');
					 });
					return;
				}

				if (query[1] === 'UPDATE') {
					let row = {};
					query[4] = query[4].split('=');
					row[query[4][0]] = query[4][1];

					r.table(query[2])
					 .get(query[3])
					 .update(row)
					 .run(await conn, function(result) {
						 socket.write('.');
					 });
					return;
				}
				
				if (query[1] === 'DELETE') {
					r.table(query[2])
					 .get(query[3])
					 .delete()
					 .run(await conn, function(result) {
						 socket.write('.');
					 });
					return;
				}
				
				if (query[1] === 'SELECT') {
					r.table(query[2])
					 .run(await conn, async function(err, datos) {
							datos = await datos.toArray();
						 
							for (const row of datos) {
								socket.write(JSON.stringify(row));						
							}
							
							socket.write('.');							
					 });
					return;
				}
				
				socket.write(query[1] + ' NO IMPLEMENTADO AUN.');
				break;*/