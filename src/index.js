const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");

async function main() {
  await app.listen(app.get("port"));
  console.log("Listening from port:", app.get("port"));
}

main();
