const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const { startConnection } = require("./database");

async function main() {
  startConnection();
  await app.listen(app.get("port"));
  console.log("Listening from port:", app.get("port"));
}

main();
