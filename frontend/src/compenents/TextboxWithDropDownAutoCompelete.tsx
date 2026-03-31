import { useState, type Dispatch, type SetStateAction, useRef } from 'react';

export type TextboxWithDropDownAutoCompeletePropsType = {
  dropdownStrings: string[],
  onAutoCompelete: (arg0: string) => void,
  value: string,
  onChange: Dispatch<SetStateAction<string>>
};

const TextboxWithDropDownAutoCompelete = (
  {
    dropdownStrings,
    onAutoCompelete,
    value,
    onChange
  }: TextboxWithDropDownAutoCompeletePropsType) => {
  const [curAutoCompeleteValues, setCurAutoCompeleteValues] = useState<string[]>(dropdownStrings);
  const [curSelectedVal, setCurSelectedVal] = useState<number>(0);

  const handelAutoCompelete = (val: string) => {
    if (curAutoCompeleteValues.length !== 0) {
      setCurSelectedVal(0);
      setCurAutoCompeleteValues([]);
      onAutoCompelete(val);
      onChange(val);
    }
  };

  const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);

  const nextHighlightedRef = useRef<HTMLButtonElement>(null);
  const prevHighlightedRef = useRef<HTMLButtonElement>(null);

  return (
    <span className='autoCompeleteDropDownContainer' onFocus={() => setDropDownVisible(true)} onBlur={() => setDropDownVisible(false)}>
      <input type='textbox' value={value} onChange={(event) => {
        const curVal = event.target.value;

        setCurAutoCompeleteValues(dropdownStrings.filter((val) => val.toLowerCase().includes(curVal.toLowerCase())));
        setCurSelectedVal(0);

        onChange(curVal);
      }} onKeyDown={(event) => {
        switch (event.key) {
          case 'Enter':
            event.preventDefault();

            handelAutoCompelete(curAutoCompeleteValues[curSelectedVal]);

            break;
          case 'ArrowDown':
            event.preventDefault();

            if (nextHighlightedRef !== null && nextHighlightedRef.current !== null) {
              nextHighlightedRef.current.scrollIntoView({ block: 'end' });
            }

            setCurSelectedVal(curSelectedVal + 1 === curAutoCompeleteValues.length ? curSelectedVal : curSelectedVal + 1);

            break;
          case 'ArrowUp':
            event.preventDefault();

            if (prevHighlightedRef !== null && prevHighlightedRef.current !== null) {
              prevHighlightedRef.current.scrollIntoView();
            }

            setCurSelectedVal(curSelectedVal === 0 ? 0 : curSelectedVal - 1);

            break;
        }
      }} />

      {(dropDownVisible) ?
        <div className='autoCompeleteDropDown'>
          {
            curAutoCompeleteValues.map((val, index) => {
              let curRef = undefined;

              if (curSelectedVal - 1 === index || (curSelectedVal === 0 && index === 0)) {
                curRef = prevHighlightedRef;
              }

              if (curSelectedVal + 1 === index || (curSelectedVal === dropdownStrings.length - 1 && index === dropdownStrings.length - 1)) {
                curRef = nextHighlightedRef;
              }

              return (
                <span key={val}>
                  <button
                    ref={curRef}
                    className={(index === curSelectedVal) ? 'highlightedAutoCompeleteDropDownButton' : 'autoCompeleteDropDownButton'}
                    type='button' onMouseDown={() => {
                      handelAutoCompelete(val);
                    }}>
                    {val}
                  </button>
                </span>
              );
            })
          }
        </div> : <></>}
    </span>
  );
};

export default TextboxWithDropDownAutoCompelete;
