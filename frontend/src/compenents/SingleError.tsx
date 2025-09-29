import { useState } from 'react';
import { useDispatch } from 'react-redux';

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
        {displayRaw ? <>show</> : <>hide</>}
      </button>
      <button onClick={() => {
        dispatch(delError(err.id));
      }}>dismiss</button>
    </div>
  );
};

export default SingleError;
