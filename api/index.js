const bootstrap = require('./lib/infrastructure/config/bootstrap');
const createServer = require('./lib/infrastructure/webserver/server');

// Start the server
const start = async () => {
  try {
    await bootstrap.init();

    const app = await createServer();

    const port = process.env.API_SERVER_PORT || 3000;

    await app.listen(port, () => {
      console.log(`Server running at: ${port}`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
