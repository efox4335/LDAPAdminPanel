import { useAppSelector as useSelector } from '../utils/reduxHooks';
import { v4 as uuid } from 'uuid';

import { selectOpenEntriesByServerId, addOpenEntry } from '../slices/server';
import { useAppDispatch as useDispatch } from '../utils/reduxHooks';
import SingleOpenEntry from './SingleOpenEntry';

const OpenEntries = ({ serverId }: { serverId: string }) => {
  const dispatch = useDispatch();

  const openEntries = useSelector(((state) => selectOpenEntriesByServerId(state, serverId)));

  return (
    <div className='openEntriesContainer'>
      <h4 className='openEntriesHeader'>
        <div>
          open entries
        </div>
        <button className='positiveButton' onClick={() => dispatch(addOpenEntry({ serverId: serverId, entry: { entryType: 'newEntry', initialAttributes: {}, id: uuid() } }))}>
          new entry
        </button>
      </h4>
      <div className='userInteractionContainer'>
        {openEntries.map((entry) => {
          const key = (entry.entryType === 'existingEntry') ? entry.entryDn : entry.id;

          return (
            <div key={key} className='openEntryContainer'>
              <SingleOpenEntry serverId={serverId} entry={entry} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpenEntries;
