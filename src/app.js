const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");
const setupSwagger = require("./utils/swagger");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", routes);
setupSwagger(app);

app.get("/", (req, res) => res.json({ ok: true, service: "courrier-backend" }));

module.exports = app;
