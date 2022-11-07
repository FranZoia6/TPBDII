var net = require('net');

// ------------------------------------

const http = require('http'),
	fsp = require('fs').promises;

http.createServer(async function (req, res) {
	if (req.method == 'GET') {
		req.url = req.url.split('?').shift();
		if (req.url == '/') {
			req.url = '/index.html'
		}
		try {
			res.end(await fsp.readFile("www" + req.url));
		} catch (err) {
			res.end('Ups')
		}
		return;
	}

	if (req.method == 'POST') {
		var cmd = '';

		req.on('data', (chunk) => (cmd += chunk));
		req.on('end', () => {
			const client = new net.Socket();
			client.connect(1337, '127.0.0.1', function () {
				client.write(cmd);
			});

			client.on('data', function (data) {
				data = data.toString();
				res.write(data);

				if (data.indexOf('.') > -1) {
					res.end();
					client.destroy();
				}
			});

		});
		return;
	}

	res.end();
})
	.listen(8000);

// ------------------------------------