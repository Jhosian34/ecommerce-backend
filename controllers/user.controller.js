const User = require('../models/user.model')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require("jsonwebtoken")
const secret = process.env.JWT_SECRET
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const crypto = require('crypto');

async function getUsers(req, res) {
    try {
        const users = await User.find().select("-password -__v");
        return res.status(200).send({
            message: "Usuarios obtenidos correctamente",
            users: users
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('Error al obtener los usuarios');
    }
}

async function createUsers(req, res) {

    try {

        const user = new User(req.body);

        if (user.password) {

            const hashedPassword = bcrypt.hashSync(user.password, saltRounds)

            user.password = hashedPassword
        }
        const userSaved = await user.save();
        return res.status(201).send(userSaved);

    } catch (error) {

        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send({ message: "Datos enviados no son correctos" })
        }
        return res.status(500).send("El usuario no se ha podido crear");
    }
}

async function getUserById(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("name email role");

        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        return res.status(200).send({
            message: "Usuario encontrado correctamente",
            user,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            message: "Error al obtener el usuario",
            error: error.message,
        });
    }
}

async function deleteUserById(req, res) {

    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Error al eliminar el usuario" });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        return res.status(200).send({
            message: "Usuario eliminado correctamente",
            user: deletedUser
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({
            message: "Error al eliminar el usuario",
            error: error.message
        });
    }
}

async function updateUserById(req, res) {
    try {
        const { id } = req.params;

        if (req.user.id === id) {
            return res.status(403).send({ message: "No tienes permiso para actualizar este usuario" })
        }
        const dataToUpdate = req.body;
        dataToUpdate.password = undefined;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "ID inválido" });
        }

        const updatedUser = await User.findByIdAndUpdate(id, dataToUpdate, {
            new: true,
            runValidators: true
        });



        if (!updatedUser) {
            return res.status(400).send({ message: "Usuario no encontrado" });
        }


        return res.status(200).send({
            message: "Usuario actualizado correctamente",
            user: updatedUser
        });
    }
    catch (error) {
        console.error(error);

        if (error instanceof mongoose.Error.ValidationError) {
            const mensajes = Object.values(error.errors).map(err => err.message);
            return res.status(400).send({
                message: 'Datos inválidos',
                errors: mensajes
            });
        }

        return res.status(500).send({
            message: "Error al actualizar el usuario",
            error: error.message
        });
    }
}

async function loginUser(req, res) {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Email y contraseña son obligatorios" });
        }
        const user = await User.findOne({ email: email.toLowerCase() })

        if (!user) {
            return res.status(400).send({ message: "Usuario o contraseña incorrectos" });
        }
        if (!user.password || typeof user.password !== 'string') {
            return res.status(500).send({ message: "Error interno: contraseña no encontrada" });
        }
        const isValidPassword = bcrypt.compareSync(password, user.password)

        if (!isValidPassword) {
            return res.status(401).send({ mensaje: "Correo o contraseña incorrectos." });
        }
        user.password = undefined

        const token = jwt.sign(
            { _id: user._id, email: user.email, role: user.role },
            secret,
            { expiresIn: "1h" }
        );
        return res.status(200).send({
            message: "Inicio de sesión exitoso",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            },
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ message: "Error al iniciar sesión" });
    }

}
async function requestPasswordReset(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ message: "Email es obligatorio" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        return res.status(400).send({ message: "Usuario no encontrado" });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiration = Date.now() + 3600000;

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiration;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    try {
        await resend.emails.send({
            from: 'Soporte <onboarding@resend.dev>',
            to: user.email,
            subject: 'Restablece tu contraseña',
            html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="${resetLink}">${resetLink}</a>`
        });

        return res.status(200).send({
            message: "Correo enviado para restablecer la contraseña",
            token,
            resetLink

        });
    } catch (error) {
        console.error('Error al enviar correo:', error);
        return res.status(500).send({ message: 'Error al enviar el correo' });
    }
}

async function verifyResetToken(req, res) {
    const { token } = req.params;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).send({ message: "Token inválido o expirado" });
    }

    res.status(200).send({ message: "Token válido" });
}

async function resetPassword(req, res) {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).send({ message: "Token y nueva contraseña son obligatorios" });
    }

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).send({ message: "Token inválido o expirado" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    try {
        await resend.emails.send({
            from: 'Soporte <noreply@djsoluciones.net>',
            to: user.email,
            subject: 'Tu contraseña ha sido cambiada',
            html: `<p>Hola ${user.name || 'usuario'},</p>
                <p>Tu contraseña ha sido restablecida exitosamente.</p>
                <p>Si no realizaste este cambio, por favor contáctanos de inmediato.</p>`
        });
    } catch (error) {
        console.error('Error enviando email de confirmación:', error);
    }

    res.status(200).send({ message: "Contraseña restablecida exitosamente" });
}

async function registerUser(req, res) {
    try {

        console.log('req.body:', req.body);
        console.log('req.file:', req.file);
        const data = req.body;

        const user = new User({
            name: data.name,
            email: data.email,
            password: data.password,
            fecha_nacimiento: data.fecha_nacimiento,
            province: data.province,
            comment: data.comment,
            avatar: req.file ? `/uploads/users/${req.file.filename}` : null
        });

        if (user.password) {
            const hashedPassword = bcrypt.hashSync(user.password, saltRounds);
            user.password = hashedPassword;
        }

        const savedUser = await user.save();
        savedUser.password = undefined;

        return res.status(201).send({
            message: 'Usuario registrado correctamente',
            user: savedUser
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);

        if (error.code === 11000 && error.keyPattern?.email) {
            return res.status(400).send({ message: 'El email ya está registrado' });
        }

        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).send({ message: "Datos inválidos" });
        }

        return res.status(500).send({ message: 'Error interno al registrar usuario' });
    }
}

async function getCurrentUser(req, res) {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({ message: "No se pudo obtener el ID del usuario" });
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json({
            message: 'Usuario autenticado obtenido correctamente',
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener el usuario" });
    }
}

module.exports = {
    getUsers,
    createUsers,
    getUserById,
    deleteUserById,
    updateUserById,
    loginUser,
    registerUser,
    getCurrentUser,
    requestPasswordReset,
    verifyResetToken,
    resetPassword,
}