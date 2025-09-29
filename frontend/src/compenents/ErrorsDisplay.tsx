import { useSelector } from 'react-redux';

import { selectErrors } from '../slices/error';
import SingleError from './SingleError';
import type { displayError } from '../utils/types';

const ErrorsDisplay = () => {
  const errors: displayError[] = useSelector(selectErrors);

  return (
    <>
      {errors.map((err) => {
        return (
          <div key={err.id}>
            <SingleError err={err} />
          </div>
        );
      })}
    </>
  );
};

export default ErrorsDisplay;
