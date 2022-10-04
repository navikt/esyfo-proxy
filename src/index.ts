import express from 'express';
import cookieParser from 'cookie-parser';
import healhApi from './api/health';
import unleashApi from './api/unleash';
import ptoProxyApi from './api/ptoproxy';

const PORT = 3000;
const app = express();
app.use(cookieParser())

app.use(healhApi())
app.use(unleashApi())
app.use(ptoProxyApi());


const startServer = async () => {
  try {
    console.log(`Starting server...`);
    app.listen(PORT, () => {
      console.log('Server running at http://localhost:3000');
    });
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}

startServer();

