const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

const port = 8000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();


// Load SSL cert and key
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "ssl", "../../backend/*.feiyangxie.com_private_key.key")),
  cert: fs.readFileSync(path.join(__dirname, "ssl", "../../backend/feiyangxie.com_ssl_certificate.cer")),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`✅ Server running at https://alicloud.feiyang.com:${port}`);
  });
});
