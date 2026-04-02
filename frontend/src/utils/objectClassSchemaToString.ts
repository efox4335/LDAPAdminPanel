import type { objectClassSchema } from './types';

const createList = (listItems: string[], includeDollar: boolean): string => {
  let listString = '(';

  listItems.forEach((item, index) => {
    listString = listString.concat(` ${item}`);

    if (index + 1 < listItems.length && includeDollar) {
      listString = listString.concat(' $');
    }
  });

  return listString.concat(' )');
};

const objectClassSchemaToString = (schema: objectClassSchema): string => {
  let objectClassString = `( ${schema.oid}`;

  if (schema.names !== undefined) {
    objectClassString = objectClassString.concat(' NAME');

    if (schema.names.length === 1) {
      objectClassString = objectClassString.concat(` '${schema.names[0]}'`);
    } else {
      objectClassString = objectClassString.concat(` ${createList(schema.names.map((name) => '\''.concat(name).concat('\'')), false)}`);
    }
  }

  if (schema.description !== undefined) {
    objectClassString = objectClassString.concat(` DESC '${schema.description}'`);
  }

  if (schema.obsolete) {
    objectClassString = objectClassString.concat(' OBSOLETE');
  }

  if (schema.superiorObjectClasses !== undefined) {
    objectClassString = objectClassString.concat(' SUP');

    if (schema.superiorObjectClasses.length === 1) {
      objectClassString = objectClassString.concat(` ${schema.superiorObjectClasses[0]}`);
    } else {
      objectClassString = objectClassString.concat(` ${createList(schema.superiorObjectClasses, true)}`);
    }
  }

  if (schema.type !== 'INPARENT') {
    objectClassString = objectClassString.concat(` ${schema.type}`);
  }

  if (schema.reqAttributes !== undefined) {
    objectClassString = objectClassString.concat(' MUST');

    if (schema.reqAttributes.length === 1) {
      objectClassString = objectClassString.concat(` ${schema.reqAttributes[0]}`);
    } else {
      objectClassString = objectClassString.concat(` ${createList(schema.reqAttributes, true)}`);
    }
  }

  if (schema.optAttributes !== undefined) {
    objectClassString = objectClassString.concat(' MAY');

    if (schema.optAttributes.length === 1) {
      objectClassString = objectClassString.concat(` ${schema.optAttributes[0]}`);
    } else {
      objectClassString = objectClassString.concat(` ${createList(schema.optAttributes, true)}`);
    }
  }

  objectClassString = objectClassString.concat(' )');

  return objectClassString;
};

export default objectClassSchemaToString;
