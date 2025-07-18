const express = require('express')
const app = express();
const cors = require('cors')
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes")


app.use(express.json ())

app.use(cors())

app.use([userRoutes, productRoutes ])

module.exports = app