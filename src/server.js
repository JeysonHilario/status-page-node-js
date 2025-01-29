import * as http from "http";
import * as zabbix from "./services/get-data-api-zabbix.js";
import { fileURLToPath } from "url";
import fs from "fs"
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 2828;
const server = http.createServer(async (request, response) => {

  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Métodos permitidos
  response.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Cabeçalhos permitidos

  if(request.url === "/"){
    const filePath = path.join(__dirname,"../public/index.html");
    fs.readFile(filePath, (err, content) => {
      if (err) {
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.end("Erro ao carregar o arquivo index.html");
      } else {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(content);
      }
    });
    return;
  }
  if(request.url === "/status/borda"){

    let data = await zabbix.getAllData(
      zabbix.ID_BORDA,
      zabbix.bitsSentIsptec,
      zabbix.bitsReceivedIsptec,
      zabbix.pingGatewayIsptec,
      zabbix.bitsSentProxxima,
      zabbix.bitsReceivedProxxima,
      zabbix.pingGatewayProxxima);

    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(data));
    return;

  }
  const publicDir = path.join(__dirname, "../public");
  const filePath = path.join(publicDir, request.url);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Arquivo não encontrado");
    } else {
      // Determinar o tipo de conteúdo com base na extensão
      const extname = path.extname(filePath);
      let contentType = "text/plain";

      switch (extname) {
        case ".html":
          contentType = "text/html";
          break;
        case ".js":
          contentType = "application/javascript";
          break;
        case ".css":
          contentType = "text/css";
          break;
        case ".png":
          contentType = "image/png";
          break;
        case ".jpg":
          contentType = "image/jpeg";
          break;
        case ".gif":
          contentType = "image/gif";
          break;
        case ".svg":
          contentType = "image/svg+xml";
          break;
      }

      response.writeHead(200, { "Content-Type": contentType });
      response.end(content);
    }
  });
});

server.listen(port, () => console.log(`Servidor Iniciado em http://localhost:${port}`))
