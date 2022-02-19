require("dotenv").config();

const jsonServer = require("json-server");
const cards = require("./cards.json");

const port = Number(process.env.API_PORT);

if (!Number.isInteger(port) || port <= 0) {
  process.stderr.write("API_PORT is missing or not a port number. Copy .env.example to .env and set it.\n");
  process.exit(1);
}

// json-server builds the REST routes (and permissive CORS) from this shape,
// so GET /cards serves the fixture array with no hand-written handler.
const server = jsonServer.create();
server.use(jsonServer.defaults());
server.use(jsonServer.router({ cards }));

server.listen(port, () => process.stdout.write(`card api listening on http://localhost:${port}/cards\n`));
