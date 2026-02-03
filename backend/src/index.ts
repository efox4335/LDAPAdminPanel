import app from './app';
import writeToLog from './utils/logger';
import { initializeState } from './utils/state';

const main = async () => {
  await initializeState();

  const PORT = 3000;

  app.listen(PORT, () => {
    writeToLog(`backend up at port ${PORT}`);
  });
};

void main();
