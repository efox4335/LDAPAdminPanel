import { useAppSelector as useSelector } from '../utils/reduxHooks';

import { selectOpenEntriesByClientId } from '../slices/client';
import SingleOpenEntry from './SingleOpenEntry';

const OpenEntries = ({ clientId }: { clientId: string }) => {
  const openEntries = useSelector(((state) => selectOpenEntriesByClientId(state, clientId)));

  return (
    <div className='openEntries'>
      <div className='openEntriesHeader'>
        <h4>Open entries</h4>
      </div>
      {openEntries.map((entry) => {
        return (
          <div key={entry.dn} className='openEntriesContainer'>
            <SingleOpenEntry clientId={clientId} entry={entry} />
          </div>
        );
      })}
    </div>
  );
};

export default OpenEntries;
