const { Router } = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const typeCourrierRoutes = require("./typeCourrier.routes");
const courrierRoutes = require("./courrier.routes");
const reponseCourrierRoutes = require("./reponseCourrier.routes");
const roleRoutes = require("./role.routes");
const notificationRoutes = require("./notification.routes");
const annotationRoutes = require("./annotation.routes");
const origineRoutes = require("./origine.routes");
const courrierLuRoutes = require("./courrierLu.routes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/type-courriers", typeCourrierRoutes);
router.use("/courriers", courrierRoutes);
router.use("/reponses", reponseCourrierRoutes);
router.use("/roles", roleRoutes);
router.use("/notifications", notificationRoutes);
router.use("/annotations", annotationRoutes);
router.use("/origines", origineRoutes);
router.use("/courrier-lu", courrierLuRoutes);

module.exports = router;
