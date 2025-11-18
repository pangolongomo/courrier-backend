const { Router } = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const typeCourrierRoutes = require("./typeCourrier.routes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/type-courriers", typeCourrierRoutes);

module.exports = router;
