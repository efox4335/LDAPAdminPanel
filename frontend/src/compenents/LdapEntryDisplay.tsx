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
              <td>
                <ul className='ldapAttributeValues'>
                  {
                    (typeof (values) === 'string') ?
                      <li>{values}</li> :
                      values.map((value) => {
                        return (
                          <li>{value}</li>
                        );
                      })

                  }
                </ul>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default LdapEntryDisplay;
