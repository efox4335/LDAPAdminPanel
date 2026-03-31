import { useState, type JSX, type ReactNode } from 'react';

const AdvancedDropdown = ({ children, displayText, TextWrapper }:
  {
    children: ReactNode,
    displayText: string,
    TextWrapper?: ({ displayText }: { displayText: string }) => JSX.Element
  }) => {
  const [visibleState, setVisibleState] = useState<boolean>(false);

  const displayString = (visibleState ? '\u{23F7}' : '\u{23F5}').concat(displayText);
  return (
    <div className='advancedOptionsContainer'>
      <button type='button' className='hiddenButton' onClick={() => setVisibleState(!visibleState)}>
        {TextWrapper ? <>
          <TextWrapper displayText={displayString} />
        </> : <>
          {displayString}
        </>
        }
      </button>
      {visibleState ? children : <></>}
    </div>
  );
};

export default AdvancedDropdown;
