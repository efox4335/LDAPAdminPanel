import AutoExpandingList from './AutoExpandingList';
import DeleteButton from './DeleteButton';
import TextboxWithDropDownAutoCompelete from './TextboxWithDropDownAutoCompelete';

const AutoExpandingStringDisplayWithAutocomplete = ({
  data,
  setData,
  dropdownStrings,
  onAutoCompelete
}: {
  data: string[],
  setData: (arg0: string[]) => void,
  dropdownStrings: string[],
  onAutoCompelete: (arg0: string) => void
}) => {
  return (
    <AutoExpandingList<string, { dropdownStrings: string[], onAutoCompelete: (arg0: string) => void }>
      isBlankEntry={(val) => val === ''}
      newBlankEntry={() => ''}
      data={data}
      setData={setData}
      DataDisplay={Display}
      additionalDisplayProps={{ dropdownStrings: dropdownStrings, onAutoCompelete: onAutoCompelete }}
    />
  );
};

const Display = ({
  data,
  id,
  handleUpdate,
  additionalDisplayProps
}: {
  data: string,
  id: string,
  handleUpdate: (newData: string, delData: boolean, id: string) => void,
  additionalDisplayProps: {
    dropdownStrings: string[],
    onAutoCompelete: (arg0: string) => void
  }
}) => {
  return (
    <div>
      <TextboxWithDropDownAutoCompelete
        value={data}
        onChange={(val) => handleUpdate(val, false, id)}
        dropdownStrings={additionalDisplayProps.dropdownStrings}
        onAutoCompelete={additionalDisplayProps.onAutoCompelete}
      />
      <DeleteButton delFunction={() => handleUpdate(data, true, id)} />
    </div>
  );
};

export default AutoExpandingStringDisplayWithAutocomplete;
