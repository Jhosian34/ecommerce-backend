const express = require('express')
const app = express();
const cors = require('cors')
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes")
const avatarRoutes = require("./routes/avatar.routes");
const orderRoutes = require("./routes/order.routes")

app.use(express.json ())

app.use(cors())

app.use("/uploads", express.static("uploads"))

app.use("/users", userRoutes);     

app.use("/products", productRoutes);

app.use("/avatars", avatarRoutes);

app.use("/orders", orderRoutes);

module.exports = app