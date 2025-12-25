const app = require("./app");
const seedRoles = require("./utils/seedRoles");
const seedStatutsCourrier = require("./utils/seedStatutsCourrier");
const seedTypeCourrier = require("./utils/seedTypeCourrier");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await seedRoles();
    await seedStatutsCourrier();
    await seedTypeCourrier();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Erreur lors de l'initialisation :", err);
    process.exit(1);
  }
}

startServer();
