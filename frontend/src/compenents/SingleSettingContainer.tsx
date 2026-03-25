import type { ReactNode } from 'react';

const areEqual = <T,>(val1: T | undefined, val2: T | undefined): boolean => {
  if (val1 === undefined || val2 === undefined) {
    return true;
  }

  if (Array.isArray(val1) && Array.isArray(val2)) {
    if (val1.length !== val2.length) {
      return false;
    }

    let curIndex = 0;

    for (const val1ArrEle of val1) {
      if (val1ArrEle !== val2[curIndex]) {
        return false;
      }

      curIndex += 1;
    }

    return true;
  }

  return val1 === val2;
};

const SingleSettingContainer = <T,>({ children, name, curValue, setCurValue, curSetValue }: {
  children: ReactNode,
  name: string,
  curValue: T,
  setCurValue: (arg0: T) => void,
  curSetValue: T | undefined
}) => {
  if (curSetValue === undefined) {
    return (
      <tr>
        <td>
          {name}
        </td>
        <td>
          loading
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>
        {name}
        {(areEqual(curValue, curSetValue)) ? <></> : <>*</>}
      </td>
      <td>
        {children}
        {(areEqual(curValue, curSetValue)) ? <></> :
          <>
            <button type='button' className='negativeButton' onClick={() => setCurValue(curSetValue)}>
              reset
            </button>
          </>
        }
      </td>
    </tr>
  );
};

export default SingleSettingContainer;
