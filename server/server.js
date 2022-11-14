// -----------------------------------------------
const net = require('net');
const fs = require('fs')
const { Console } = require('console');
const Postgres = require("./bds/Postgres");
const Redis = require("./bds/Redis");
const Firebird = require("./bds/Firebird");
const Mongodb = require("./bds/Mongodb")
const rethink = require("./bds/Rethink");
// -----------------------------------------------

// -----------------------------------------------

const server = net.createServer(function (socket) {
	socket.on('data', async function (query) {
		console.log('EJECUTAR QUERY: ' + query);
		query = query.toString().split(':');
		var today = new Date();
		fs.appendFileSync("log.txt",today.toLocaleString() + ' ' + query.toString() +"\n");

		switch (query[0]) {
			case 'POSTGRES':
				var pg = new Postgres();
				if (query[1] === 'INSERT') {
					pg.insert(query);
					socket.write('.');
					return;
				}

				if (query[1] === 'UPDATE') {
					pg.update(query);
					socket.write('.');
					return;
				}

				if (query[1] === 'DELETE') {
					pg.delete(query);
					socket.write('.');
					return;
				}

				if (query[1] === 'SELECT') {
					var datos = await pg.select(query);
					socket.write(JSON.stringify(datos));
					socket.write('.');
					return;
				}

				socket.write(query[1] + ' NO IMPLEMENTADO AUN.');
				break;
			case 'REDIS':
				var r = new Redis();
				if (query[1] === 'INSERT'){
					//console.log(query);
					await r.insert(query);
					socket.write('.');
					return;
				}
				if (query[1] === 'SELECT'){
					var datos = await r.select(query);
					socket.write(JSON.stringify(datos));
					socket.write('.');
					return;					
				}
				if( query[1] === 'UPDATE'){
					await r.insert(query);
					socket.write('.');
					return;
				}

				if(query[1] === 'DELETE'){
					await r.delete(query);
					socket.write('.')
					return;
				}

				break; 
			case 'FIREBIRD':
				 var firebird = new Firebird();
				
				if (query[1] === 'INSERT'){
					await firebird.insert(query);
					return;
				}

				if(query[1] === 'DELETE'){
					await firebird.delete(query);
					return;
				}

				if(query[1] === 'UPDATE'){
					await firebird.update(query);
					return;
				}

				if (query[1] === 'SELECT'){
					var datos = await firebird.select(query);
					console.log(datos);
					socket.write(JSON.stringify(datos));
					socket.write('.');
					return ;	
				}

				break;

			case 'MONGODB':
				var mongodb = new Mongodb;
				if (query[1] === 'INSERT'){
					mongodb.insert(query);
					socket.write('.');
					return
				}

				if(query[1] === 'DELETE'){
					mongodb.delete(query);
					socket.write('.');
					return
				}

				if (query[1] === 'UPDATE'){
					mongodb.update(query);
					socket.write('.');
					return
				}

				if (query[1] === 'SELECT'){
					var datos = await mongodb.select(query);
					console.log(datos);
					socket.write(JSON.stringify(datos));
					socket.write('.');
					return
				}
				break;
		/*
			case 'RETHINKDB':			
				if (query[1] === 'INSERT') {
					await rethink.insert(query);
					socket.write('.');
					return;
				}

				if (query[1] === 'UPDATE') {
					await rethink.update(query);
					socket.write('.');
					return;
				}
				
				if (query[1] === 'DELETE') {
					await rethink.delete(query);
					socket.write('.');
					return;
				}
				
				if (query[1] === 'SELECT') {
					var datos = await rethink.select(query);;
					socket.write('.');
					return datos;
				}
				
				socket.write(query[1] + ' NO IMPLEMENTADO AUN.');
				break;
			*/
			default:
				socket.write(query[0] + ' NO IMPLEMENTADO AUN.');
				break;
				console.log("No implementado")
		}
	});




	socket.on('close', function () {
		console.log('Connection closed');
	});

	socket.on('error', function () {
		console.log('Connection closed');
	});
});

server.listen(1337);
console.log("Escuchando")
// -----------------------------------------------