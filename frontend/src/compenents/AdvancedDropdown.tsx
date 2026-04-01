import { useState, type ReactNode, type ComponentType, type JSX } from 'react';

const AdvancedDropdown =
  <T extends {
    DropDownButton: JSX.Element,
    displayText: string,
    dropDownState: boolean
  } =
    {
      DropDownButton: JSX.Element,
      displayText: string
      dropDownState: boolean
    }>
    ({ children, displayText, TextWrapper, wrapperProps }:
      {
        children: ReactNode,
        displayText: string,
        TextWrapper?: ComponentType<T>,
        wrapperProps?: Omit<T, 'displayText' | 'DropDownButton' | 'dropDownState'>
      }) => {
    const [visibleState, setVisibleState] = useState<boolean>(false);

    const displayString = (visibleState ? '\u{23F7}' : '\u{23F5}').concat(displayText);

    if (TextWrapper === undefined) {
      return (
        <div className='advancedOptionsContainer'>
          <button type='button' className='hiddenButton' onClick={() => setVisibleState(!visibleState)} >
            {displayString}
          </button>
          {visibleState ? children : <></>}
        </div>
      );
    }

    const props: T = wrapperProps === undefined ?
      {
        DropDownButton: <ButtonGenerator onClick={() => setVisibleState(!visibleState)} />,
        displayText: displayString,
        dropDownState: visibleState
      } as T :
      {
        ...wrapperProps,
        DropDownButton: <ButtonGenerator onClick={() => setVisibleState(!visibleState)} />,
        displayText: displayString,
        dropDownState: visibleState
      } as T;

    return (
      <div className='advancedOptionsContainer'>
        <TextWrapper {...props} />
        {visibleState ? children : <></>}
      </div>
    );
  };

const ButtonGenerator = ({ onClick }: { onClick: () => void }) => {
  return (
    <button type='button' className='hiddenButton' onClick={onClick} />
  );
};

export default AdvancedDropdown;
