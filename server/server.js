// -----------------------------------------------
const net = require('net');
const fs = require('fs')
const { Console } = require('console');
const Postgres = require("./bds/Postgres");
const Redis = require("./bds/Redis");
const Firebird = require("./bds/Firebird");
const Mongodb = require("./bds/Mongodb")
const rethink = require("./bds/Rethink");// Implementar y probar rethink
var pg = new Postgres();
var r = new Redis();
var firebird = new Firebird();
var mongodb = new Mongodb;
// -----------------------------------------------

// -----------------------------------------------
//Conectar Servidor para poder tener concurrencia 
const server = net.createServer(function (socket) {
	socket.on('data', async function (query) {
		console.log('EJECUTAR QUERY: ' + query);
		query = query.toString().split(':');
		var today = new Date();
		fs.appendFileSync("./Log/log.txt",today.toLocaleString() + ' ' + query.toString() +"\n");


		switch (query[0]) {
				case 'INSERT':	
				try {
					await pg.insert(query);
					await mongodb.insert(query);
					await r.insert(query);
				} catch (error) {
					console.log(error)
					socket.write('ERROR: ' + error.toString());
					
				}
				//await firebird.insert(query);
					socket.write('.');
					break;

				case 'UPDATE':
					pg.update(query);
					await r.insert(query);
					await firebird.update(query);
					mongodb.update(query);
					socket.write('.');
					break;

				case 'DELETE':
					pg.delete(query);
					await r.delete(query);
					await firebird.delete(query);
					mongodb.delete(query);
					socket.write('.');
					break;
				
				case 'SELECT':
					var datos = await mongodb.select(query);
					socket.write(JSON.stringify(datos));
					socket.write('.');
					break;

			default:
				socket.write(query[1] + ' NO IMPLEMENTADO AUN.');
				break;
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