import { useState } from 'react';
import { useAppDispatch as useDispatch } from '../utils/reduxHooks';

import type { displayError } from '../utils/types';
import { delError } from '../slices/error';

const SingleError = ({ err }: { err: displayError }) => {
  const [displayRaw, setDisplayRaw] = useState<boolean>(false);

  const dispatch = useDispatch();

  return (
    <div>
      message: {err.message}
      {displayRaw ? <>raw: {err.rawError}</> : <></>}
      <button onClick={() => displayRaw ? setDisplayRaw(false) : setDisplayRaw(true)}>
        {displayRaw ? <>hide</> : <>show</>}
      </button>
      <button onClick={() => {
        dispatch(delError(err.id));
      }}>dismiss</button>
    </div>
  );
};

export default SingleError;
