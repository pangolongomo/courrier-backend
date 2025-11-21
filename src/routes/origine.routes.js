const router = require("express").Router();
const origineController = require("../controllers/origine.controller");

router.get("/", origineController.getOrigines);
router.post("/", origineController.createOrigine);

module.exports = router;
