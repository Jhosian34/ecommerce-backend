const User = require('../models/user.model');

async function uploadAvatar(req, res) {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).send({ message: "No se subió ninguna imagen" });
        }

        const relativePath = `/uploads/avatars/${req.file.filename}`;
        const fullUrl = `${req.protocol}://${req.get('host')}${relativePath}`;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { avatar: relativePath },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        return res.status(200).send({
            message: "Avatar actualizado correctamente",
            user: updatedUser,
            imageUrl: fullUrl
        });
    } catch (error) {
        console.error("Error al subir avatar:", error);
        return res.status(500).send({ message: "Error al subir avatar" });
    }
}

module.exports = { uploadAvatar };
