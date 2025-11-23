const app = require("./app");
const seedRoles = require("./utils/seedRoles");
const seedStatutsCourrier = require("./utils/seedStatutsCourrier");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await seedRoles();
    await seedStatutsCourrier();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Erreur lors de l'initialisation :", err);
    process.exit(1);
  }
}

startServer();
