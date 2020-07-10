const bootstrap = require('./infrastructure/config/bootstrap');
const environment = require('./infrastructure/config/environment');
const createServer = require('./infrastructure/webserver/server');

// Start the server
const start = async () => {
  try {
    await bootstrap.init();

    const server = await createServer();

    const { port } = environment.server;

    await server.listen(port, () => {
      console.log(`Server running at: ${port}`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
