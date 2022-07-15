const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', client => {

    console.log('Cliente conectado');
    const [ valido, uid ] = comprobarJWT( client.handshake.headers['x-token'] );

    // Verificar autenticacion
    if( !valido ) { return client.disconnect(); };

    // Cliente autenticado
    usuarioConectado( uid );

    // Ingresar al usuario a una sala en particular
    // usando clienteId
    client.join( uid );

    // Escuchar del cliemte el mensaje-pesrsonal
    client.on('mensaje-personal', async ( payload ) => {
        await grabarMensaje( payload );

        io.to( payload.para ).emit( 'mensaje-personal', payload );
    });
    
    client.on('disconnect', () => {
        usuarioDesconectado( uid );
    });

    // client.on('mensaje', ( payload ) => {
    //     console.log('Mensaje', payload);

    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    // });


});
