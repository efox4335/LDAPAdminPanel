import app from './app';
import writeToLog from './utils/logger';

const PORT = 3000;

app.listen(PORT, () => {
  writeToLog(`backend up at port ${PORT}`);
});
