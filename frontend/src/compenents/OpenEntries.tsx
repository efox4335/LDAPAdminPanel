import { useAppSelector as useSelector } from '../utils/reduxHooks';

import { selectOpenEntriesByClientId } from '../slices/client';
import SingleOpenEntry from './SingleOpenEntry';

const OpenEntries = ({ clientId }: { clientId: string }) => {
  const openEntries = useSelector(((state) => selectOpenEntriesByClientId(state, clientId)));

  return (
    <div className='openEntriesContainer'>
      <h4 className='openEntriesHeader'>
        open entries
      </h4>
      <div className='userInteractionContainer'>
        {openEntries.map((entry) => {
          return (
            <div key={entry.dn} className='openEntryContainer'>
              <SingleOpenEntry clientId={clientId} entry={entry} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpenEntries;
