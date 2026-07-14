import AutoExpandingList from './AutoExpandingList';
import DeleteButton from './DeleteButton';

const AutoExpandingStringDisplay = ({
  data,
  setData
}: {
  data: string[],
  setData: (arg0: string[]) => void,
}) => {
  return (
    <AutoExpandingList<string>
      isBlankEntry={(val) => val === ''}
      newBlankEntry={() => ''}
      data={data}
      setData={setData}
      DataDisplay={Display}
    />
  );
};

const Display = ({
  data,
  id,
  handleUpdate
}: {
  data: string,
  id: string,
  handleUpdate: (newData: string, delData: boolean, id: string) => void
}) => {
  return (
    <div>
      <input type='text' value={data} onChange={(val) => handleUpdate(val.target.value, false, id)} />
      <DeleteButton delFunction={() => handleUpdate(data, true, id)} />
    </div>
  );
};

export default AutoExpandingStringDisplay;
