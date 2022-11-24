
document.querySelector('button')
    .addEventListener('click', function () {
        var cmd = [],
            operacion = document.getElementById('operacion').value;
        cmd.push(operacion);
        cmd.push(document.getElementById('tabla').value);
        cmd.push(document.getElementById('id').value);

        /*  if (operacion == 'DELETE' || operacion == 'UPDATE') {
              cmd.push(document.getElementById('id').value);							
          }*/

        if (operacion == 'INSERT' || operacion == 'UPDATE') {
            cmd.push('nombre=' + document.getElementById('nombre').value);
        }
        console.log(cmd);

        cmd = cmd.join(':');
        const req = new XMLHttpRequest();
        req.responseType = 'text';
        req.open('POST', '/api', true);

        req.onload = function () {
            console.log(req.responseText);
            console.log('req estado: ' + req.status.toString());
            console.log(req);
            var error = req.responseText.split(':');
            console.log(error);
            if (error[0] === 'ERROR') {
                alert(req.responseText);
            }
            if (req.status !== 200) {
                console.error(req.responseText);
                return;
            }

            var respuestas = req.responseText;
            respuestas = JSON.parse(respuestas.slice(0, respuestas.length - 1));
            const tabla = document.querySelector('table');
            var fila = "<tr><th>ID</th><th>Nombre</th><tr>";
            for (respuesta of respuestas) {
                fila += "<tr> <td>" + respuesta.id + "</td> <td>" + respuesta.nombre + "</td> </tr>";
            }
            tabla.innerHTML = fila;
        };

        req.send(cmd);
    })
