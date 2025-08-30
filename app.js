const express = require('express')
const app = express();
const cors = require('cors')
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes")
const avatarRoutes = require("./routes/avatar.routes");
const orderRoutes = require("./routes/order.routes")

app.use(express.json())

const corsOptions = {
    origin: ['https://front-djsoluciones.netlify.app', 'http://localhost:5173'],
    credentials: true
};

app.use(cors(corsOptions))

app.use("/uploads", express.static("uploads"))

app.use("/users", userRoutes);

app.use("/products", productRoutes);

app.use("/avatars", avatarRoutes);

app.use("/orders", orderRoutes);

module.exports = app