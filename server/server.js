// -----------------------------------------------
const net = require('net');
const fs = require('fs')
const { Console } = require('console');
const Postgres = require("./bds/Postgres");
const Mongodb = require("./bds/Mongodb")
var master = new Postgres();// Aca declaramos a postgres como maestro
var esclavo = new Mongodb; // Aca declaramos a mongo como el esclavo  
// -----------------------------------------------


// -----------------------------------------------
const server = net.createServer(function (socket) {
	socket.on('data', async function (query) {
		console.log('EJECUTAR QUERY: ' + query);
		query = query.toString().split(':');
		var today = new Date();
		fs.appendFileSync("./Log/log.txt", today.toLocaleString() + ' ' + query.toString() + "\n");


		switch (query[0]) {
			case 'INSERT':
				var masterVersion = master.getVersion();
				var esclavoVersion = esclavo.getVersion();
				var validacionMaster = await master.isConnected();
				if (validacionMaster) {
					await master.insert(query);
					master.setVersion(masterVersion + 1)
					var validacionEsclavo = await esclavo.isConnected();
					if (validacionEsclavo) {
						esclavo.setVersion(esclavoVersion + 1)
						if (validacionEsclavo != esclavoVersion) {
							datos = await master.select(query);
							await esclavo.replicar(datos)

						} else {
							await esclavo.insert(query);
						}
					} else {
						socket.write('ERROR: No se pudo conectar con el Esclavo');

					}

				} else {
					socket.write('ERROR: No se pudo conectar con el maestro');

				}
				socket.write('.');
				break;


			case 'UPDATE':

				var validacionMaster = await master.isConnected();
				var masterVersion = master.getVersion();
				var esclavoVersion = esclavo.getVersion();
				if (validacionMaster) {
					await master.update(query);
					var validacionEsclavo = await esclavo.isConnected();
					if (validacionEsclavo) {
						esclavo.setVersion(esclavoVersion + 1)
						if (validacionEsclavo != esclavoVersion) {
							datos = await master.select(query);
							await esclavo.replicar(datos)
						} else {
							await esclavo.update(query);
						}

					} else {
						socket.write('ERROR: No se pudo conectar con el Esclavo');

					}

				} else {
					socket.write('ERROR: No se pudo conectar con el maestro');

				}
				socket.write('.');
				break;

			case 'DELETE':
				var validacionMaster = await master.isConnected();
				var masterVersion = master.getVersion();
				var validacionMaster = await master.isConnected();
				if (validacionMaster) {
					await master.delete(query);
					var validacionEsclavo = await esclavo.isConnected();
					if (validacionEsclavo) {
						esclavo.setVersion(esclavoVersion + 1)
						if (validacionEsclavo != esclavoVersion) {
							datos = await master.select(query);
							await esclavo.replicar(datos)
						} else {
							await esclavo.delete(query);
						}

					} else {
						socket.write('ERROR: No se pudo conectar con el Esclavo');

					}

				} else {
					socket.write('ERROR: No se pudo conectar con el maestro');

				}
				socket.write('.');
				break;

			case 'SELECT':
				var validacionEsclavo = await esclavo.isConnected();
				var validacionMaster = await master.isConnected();
				var masterVersion = master.getVersion();
				var validacionMaster = await master.isConnected();
				if (validacionEsclavo != esclavoVersion && validacionMaster) {
					datos = await master.select(query);
					await esclavo.replicar(datos)
				}
				if (validacionEsclavo) {
					var datos = await esclavo.select(query);
					socket.write(JSON.stringify(datos));
				}else{
					socket.write('ERROR: No se pudo conectar a la base de datos');
				}
				
				socket.write('.');
				break;

			default:
				socket.write('ERROR: ' + query[1] + ' NO IMPLEMENTADO AUN.');
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
console.log("Escuchando");
// -----------------------------------------------

