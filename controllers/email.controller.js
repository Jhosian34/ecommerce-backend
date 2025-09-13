const resend = require('../utils/resendClient');


async function sendTestEmail(req, res) {
    try {
        console.log('Intentando enviar correo...');
        const response = await resend.emails.send({
            from: 'Facturación App <onboarding@resend.dev>', 
            to: 'jhosiansalazar@gmail.com',
            subject: 'Prueba de correo con Resend',
            html: '<h1>Hola!</h1><p>Este es un correo de prueba desde tu app.</p>'
        });

        console.log('Respuesta de Resend:', response);

        res.status(200).send({ message: 'Correo enviado con éxito' });
    } catch (error) {
        console.error('Error al enviar correo:', error);
        res.status(500).send({ message: 'Error al enviar correo', error });
    }
}


module.exports = {
    sendTestEmail
};