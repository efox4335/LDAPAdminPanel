import type { objectClassSchema } from '../utils/types';

const SingleObjectClassSchemaDisplay = ({ schema }: { schema: objectClassSchema }) => {
  return (
    <table>
      <tbody>
        <tr className='headlessFirstTableRow'>
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
            {schema.names ? <div>
              {schema.names.map((name) => {
                return (<div key={name}>{name}</div>);
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
            {schema.obsolete.toString()}
          </td>
        </tr>
        <tr>
          <td>
            superior object classes
          </td>
          <td>
            {schema.superiorObjectClasses ? <div>
              {schema.superiorObjectClasses.map((supObjClass) => {
                return (
                  <div key={supObjClass}>
                    {supObjClass}
                  </div>
                );
              })}
            </div> : <></>}
          </td>
        </tr>
        <tr>
          <td>
            type
          </td>
          <td>
            {schema.type}
          </td>
        </tr>
        <tr>
          <td>
            required attributes
          </td>
          <td>
            {schema.reqAttributes ? <div>
              {schema.reqAttributes.map((attr) => {
                return (
                  <div key={attr}>{attr}</div>
                );
              })}
            </div> : <></>}
          </td>
        </tr>
        <tr>
          <td>
            optional attributes
          </td>
          <td>
            {schema.optAttributes ? <div>
              {schema.optAttributes.map((attr) => {
                return (
                  <div key={attr}>{attr}</div>
                );
              })}
            </div> : <></>}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default SingleObjectClassSchemaDisplay;
