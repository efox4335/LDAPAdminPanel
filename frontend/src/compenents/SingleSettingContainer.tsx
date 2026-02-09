import type { ReactNode } from 'react';

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
        {(curValue === curSetValue) ? <></> : <>*</>}
      </td>
      <td>
        {children}
        {(curValue === curSetValue) ? <></> :
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
