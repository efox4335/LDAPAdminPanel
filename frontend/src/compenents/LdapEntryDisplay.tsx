import type { ldapAttribute } from '../utils/types';

const LdapEntryDisplay = ({ attributes }: { attributes: ldapAttribute[] }) => {
  return (
    <table>
      <thead>
        <tr>
          <th scope='row'>attribute</th>
          <th scope='row'>value</th>
        </tr>
      </thead>
      <tbody>
        {attributes.map(({ name, values }) => {
          return (
            <tr key={name}>
              <td>
                {name}
              </td>
              <td className='ldapAttributeValues'>
                {
                  (typeof (values) === 'string') ?
                    values :
                    values.reduce((str, val) => {

                      return `${str}\n${val}`;
                    })
                }
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default LdapEntryDisplay;
