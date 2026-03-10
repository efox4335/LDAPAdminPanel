import type { attributeTypeSchemaMap, objectClassSchemaMap } from './types';

const getAllAttributes = (
  schemas: objectClassSchemaMap,
  curSchemaIndex: number,
  visited: Record<string, boolean>
): {
  reqAttributes: string[],
  optAttributes: string[]
} => {
  if (visited[curSchemaIndex] === true) {
    return {
      reqAttributes: [],
      optAttributes: []
    };
  }

  visited[curSchemaIndex] = true;

  const curSchema = schemas.objectClassSchemas[curSchemaIndex];

  if (curSchema === undefined) {
    throw new Error(`invalid schema index ${curSchemaIndex}`);
  }

  const curReqAttributes = curSchema.reqAttributes ?
    curSchema.reqAttributes.concat([]) :
    [];

  const curOptAttributes = curSchema.optAttributes ?
    curSchema.optAttributes.concat([]) :
    [];

  if (curSchema.superiorObjectClasses === undefined) {
    return {
      reqAttributes: curReqAttributes,
      optAttributes: curOptAttributes
    };
  }

  curSchema.superiorObjectClasses.forEach((name) => {
    const supObjectClassIndex = schemas.nameMap[name];

    if (supObjectClassIndex === undefined) {
      throw new Error(`object class ${name} has no index`);
    }

    const {
      reqAttributes: supReqAttributes,
      optAttributes: supOptAttributes
    } = getAllAttributes(schemas, supObjectClassIndex, visited);

    curReqAttributes.push(...supReqAttributes);
    curOptAttributes.push(...supOptAttributes);
  });

  return {
    reqAttributes: curReqAttributes,
    optAttributes: curOptAttributes
  };
};

const addAttributes = (
  attributeTypeMap: attributeTypeSchemaMap,
  attributesToAdd: string[],
  alreadyAddedAttributes: Record<number, boolean>
): {
  addedAttributes: Record<number, boolean>,
  attributeArr: string[]
} => {
  const attributeArr: string[] = [];

  attributesToAdd.forEach((attribute) => {
    const attributeIndex = attributeTypeMap.nameMap[attribute];

    const alreadyAdded = alreadyAddedAttributes[attributeIndex];

    if (alreadyAdded === undefined) {
      alreadyAddedAttributes[attributeIndex] = true;

      if (attributeIndex === undefined) {
        attributeArr.push(attribute);

        return;
      }

      const attributeTypeSchema = attributeTypeMap.attributeTypes[attributeIndex];

      if (attributeTypeSchema === undefined) {
        throw new Error(`attempted to add attribute ${attribute} with no attribute syntax`);
      }

      if (attributeTypeSchema.oid === attribute) {
        if (attributeTypeSchema.name !== undefined && attributeTypeSchema.name.length > 0) {
          attributeArr.push(attributeTypeSchema.name[0]);
        } else {
          attributeArr.push(attribute);
        }
      } else {
        attributeArr.push(attribute);
      }
    }
  });

  return {
    addedAttributes: alreadyAddedAttributes,
    attributeArr: attributeArr
  };
};

const addInheritedAttributes = (objectClassMap: objectClassSchemaMap, attributeTypeMap: attributeTypeSchemaMap): objectClassSchemaMap => {
  objectClassMap.objectClassSchemas.forEach((schema, index) => {
    const attributes = getAllAttributes(objectClassMap, index, {});

    const {
      addedAttributes: addedAttributes,
      attributeArr: newReqAttributes
    } = addAttributes(attributeTypeMap, attributes.reqAttributes, {});

    const {
      attributeArr: newOptAttributes
    } = addAttributes(attributeTypeMap, attributes.optAttributes, addedAttributes);

    schema.reqAttributes = newReqAttributes;
    schema.optAttributes = newOptAttributes;
  });

  return objectClassMap;
};

export default addInheritedAttributes;
