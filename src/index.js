const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");

async function main() {
  console.log(process.env);

  await app.listen(app.get("port"));
  console.log("Listening from port:", app.get("port"));
}

main();
