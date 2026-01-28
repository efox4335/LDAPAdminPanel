import { useState, type ReactNode } from 'react';

const AdvancedDropdown = ({ children, displayText }: { children: ReactNode, displayText: string }) => {
  const [visibleState, setVisibleState] = useState<boolean>(false);

  return (
    <div className='advancedOptionsContainer'>
      <button type='button' className='hiddenButton' onClick={() => setVisibleState(!visibleState)}>
        {visibleState ? '\u{23F7}' : '\u{23F5}'}
        {displayText}</button>
      {visibleState ? children : <></>}
    </div>
  );
};

export default AdvancedDropdown;
