import type { ldapEntry } from '../utils/types';

const LdapEntryDisplay = ({ entry }: { entry: ldapEntry }) => {
  return (
    <ul>
      {Object.entries(entry).filter(([_key, value]) => {
        return (!Array.isArray(value) || value.length > 0);
      }).map(([key, value]) => {
        return (
          <li key={key}>
            {key} : {
              (typeof (value) === 'string') ?
                value :
                value.reduce((str, val, index) => {
                  if (index === value.length - 1) {
                    return `${str} ${val}]`;
                  }

                  return `${str}${val}, `;
                }, '[')
            }
          </li>
        );
      })}
    </ul>
  );
};

export default LdapEntryDisplay;
