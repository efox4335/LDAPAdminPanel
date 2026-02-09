import { useSelector } from 'react-redux';

import { selectErrors } from '../slices/error';
import SingleError from './SingleError';
import type { displayError } from '../utils/types';

const ErrorsDisplay = () => {
  const errors: displayError[] = useSelector(selectErrors);

  return (
    <div className='errorsDisplay' style={{ zIndex: (errors.length > 0) ? 3 : 1 }}>
      {errors.map((err) => {
        return (
          <div key={err.id} className='singleError'>
            <SingleError err={err} />
          </div>
        );
      })}
    </div>
  );
};

export default ErrorsDisplay;
