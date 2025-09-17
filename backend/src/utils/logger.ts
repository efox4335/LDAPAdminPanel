import fs from 'node:fs';

import { enableLogs, logOutputFile } from './state';

//handels inserting timestamp
const writeToLog = (inputLog: string) => {
  if (!enableLogs) {
    return;
  }

  const curTime = new Date(Date.now());

  const output: string = `[${curTime.toISOString()}] ${inputLog}`;

  if (logOutputFile === 'stdout') {
    console.log(output);
  } else {
    //TODO: notify the fronted on failed log write
    fs.writeFile(logOutputFile, `${output}\n`, (error) => {
      if (error) {
        console.log('important log write error', error);
      }
    });
  }
};

export default writeToLog;
