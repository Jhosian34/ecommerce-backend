require('dotenv').config()
const mongoose = require('mongoose')

const app = require("./app")

const PORT = 3000;


mongoose.connect(process.env.MONGO_URI)
.then(() =>{
    console.log("conexion base de datos")

    app.listen(PORT, ()=>{
    console.log(`el server esta corriendo en el puerto ${PORT}`)
})

})
.catch(error =>{
    console.error("error al conectar base de datos", error)
})

