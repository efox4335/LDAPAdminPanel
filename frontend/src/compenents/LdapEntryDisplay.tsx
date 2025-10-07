import type { ldapAttribute } from '../utils/types';

const LdapEntryDisplay = ({ attributes }: { attributes: ldapAttribute[] }) => {
  return (
    <ul>
      {attributes.map(({ name, values }) => {
        return (
          <li key={name}>
            {name}: {
              (typeof (values) === 'string') ?
                values :
                values.reduce((str, val, index) => {
                  if (index === values.length - 1) {
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
