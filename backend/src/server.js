require("dotenv").config();
const app = require("./app");
const { web3 } = require("./config/web3");

const PORT = process.env.PORT || 5000;

const listenWithRetry = (initialPort, maxAttempts = 10) => {
  const tryListen = (port, attempt) => {
    const server = app.listen(port, () => {
      console.log(`TrueLens backend running on port ${port}`);
    });

    server.on("error", (err) => {
      if (err && err.code === "EADDRINUSE" && attempt < maxAttempts) {
        console.warn(`Port ${port} in use, trying ${port + 1}...`);
        tryListen(port + 1, attempt + 1);
        return;
      }

      console.error("Server failed to start:", err);
      process.exit(1);
    });
  };

  tryListen(Number(initialPort), 1);
};

const start = async () => {
  try {
    const block = await web3.eth.getBlockNumber();
    console.log("Connected to Ganache. Block:", block);
  } catch (err) {
    console.warn("Warning: could not connect to Ganache:", err.message);
  }

  listenWithRetry(PORT);
};

start();
