import { createServer } from "http";
import { parse } from "url";

const server = createServer(async (req, res) => {
  // Parse the request URL
  const parsedUrl = parse(req.url || "", true);

  // Replace Deno.env.get with process.env
  const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

  if (!ETHERSCAN_API_KEY) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "ETHERSCAN_API_KEY is not set" }));
    return;
  }

  // Example response
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Server is running" }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
