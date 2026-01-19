import { useAppSelector as useSelector } from '../utils/reduxHooks';
import { v4 as uuid } from 'uuid';

import { selectOpenEntriesByClientId, addOpenEntry } from '../slices/client';
import { useAppDispatch as useDispatch } from '../utils/reduxHooks';
import SingleOpenEntry from './SingleOpenEntry';

const OpenEntries = ({ clientId }: { clientId: string }) => {
  const dispatch = useDispatch();

  const openEntries = useSelector(((state) => selectOpenEntriesByClientId(state, clientId)));

  return (
    <div className='openEntriesContainer'>
      <h4 className='openEntriesHeader'>
        <div>
          open entries
        </div>
        <button className='positiveButton' onClick={() => dispatch(addOpenEntry({ clientId: clientId, entry: { entryType: 'newEntry', initialAttributes: {}, id: uuid() } }))}>
          new entry
        </button>
      </h4>
      <div className='userInteractionContainer'>
        {openEntries.map((entry) => {
          const key = (entry.entryType === 'existingEntry') ? entry.entryDn : entry.id;

          return (
            <div key={key} className='openEntryContainer'>
              <SingleOpenEntry clientId={clientId} entry={entry} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpenEntries;
