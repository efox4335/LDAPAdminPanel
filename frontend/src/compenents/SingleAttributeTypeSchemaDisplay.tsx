import type { attributeTypeSchema } from '../utils/types';

const SingleAttributeTypeSchemaDisplay = ({ schema }: { schema: attributeTypeSchema }) => {
  return (
    <table>
      <tbody>
        <tr className='headlessFirstTableRow'>
          <td>
            schema type
          </td>
          <td>
            attribute type
          </td>
        </tr>
        <tr>
          <td>
            oid
          </td>
          <td>
            {schema.oid}
          </td>
        </tr>
        <tr>
          <td>
            names
          </td>
          <td>
            {(schema.name !== undefined) ? <div>
              {schema.name.map((name) => {
                return (
                  <div>
                    {name}
                  </div>
                );
              })}
            </div> : <></>}
          </td>
        </tr>
        <tr>
          <td>
            description
          </td>
          <td>
            {schema.description ?? ''}
          </td>
        </tr>
        <tr>
          <td>
            obsolete
          </td>
          <td>
            {schema.obsolete ? 'true' : 'false'}
          </td>
        </tr>
        <tr>
          <td>
            superior attribute type
          </td>
          <td>
            {schema.superiorAttributeType ?? ''}
          </td>
        </tr>
        <tr>
          <td>
            equality matching rule
          </td>
          <td>
            {schema.eqMatchingRule ?? ''}
          </td>
        </tr>
        <tr>
          <td>
            ordering matching rule
          </td>
          <td>
            {schema.ordMatchingRule ?? ''}
          </td>
        </tr>
        <tr>
          <td>
            substring matching rule
          </td>
          <td>
            {schema.subStrMatchingRule ?? ''}
          </td>
        </tr>
        <tr>
          <td>
            attribute syntax
          </td>
          <td>
            {(schema.attributeSyntax !== undefined) ? <div>
              <div>
                syntax oid {schema.attributeSyntax.oid}
              </div>
              <div>
                size {(schema.attributeSyntax.size ?? '').toString()}
              </div>
            </div> : <></>}
          </td>
        </tr>
        <tr>
          <td>
            single value
          </td>
          <td>
            {schema.singleValue ? 'true' : 'false'}
          </td>
        </tr>
        <tr>
          <td>
            collective
          </td>
          <td>
            {schema.collective ? 'true' : 'false'}
          </td>
        </tr>
        <tr>
          <td>
            no user modification
          </td>
          <td>
            {schema.noUserMod ? 'true' : 'false'}
          </td>
        </tr>
        <tr>
          <td>
            usage
          </td>
          <td>
            {schema.usage ?? ''}
          </td>
        </tr>
        <tr>
          <td>
            extensions
          </td>
          <td>
            {(schema.extensions !== undefined) ? <div>
              {schema.extensions.map((extension) => {
                return (
                  <div>
                    <div>
                      name: {extension.name}
                    </div>
                    <div>
                      values: {extension.value.map((value) => {
                        return (
                          <div>
                            {value}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div> : <></>}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default SingleAttributeTypeSchemaDisplay;
