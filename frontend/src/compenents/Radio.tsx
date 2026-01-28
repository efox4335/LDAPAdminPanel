const Radio = <T extends string>({ elements, name, onChange, curSelected }: {
  elements: T[]
  name: string,
  onChange: (arg0: T) => void,
  curSelected: T
}) => {
  return (
    <>
      {elements.map((element) => {
        return (
          <label key={element}>
            <input
              type='radio'
              name={name}
              value={element}
              onChange={() => onChange(element)}
              checked={element === curSelected}
            />
            {element}
          </label>
        );
      })}
    </>
  );
};

export default Radio;
