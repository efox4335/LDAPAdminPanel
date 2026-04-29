import { fetchCustomSearchEntries } from './query';
import parseAttributeTypeSchema from './parseAttributeTypeSchema';
import parseObjectClassSchema from './parseObjectClassSchema';
import addInheritedAttributes from './addInheritedAttributes';
import type { attributeTypeSchemaMap, objectClassSchemaMap } from './types';

const fetchSchemas = async (
  schemaDn: string,
  serverId: string
): Promise<{
  inheritedObjectClassMap: objectClassSchemaMap,
  originalObjectClassMap: objectClassSchemaMap,
  attributeTypeMap: attributeTypeSchemaMap
}> => {
  const searchRes = await fetchCustomSearchEntries(
    serverId,
    schemaDn,
    'base',
    'always',
    '(objectClass=subschema)',
    0,
    0,
    []
  );

  if (searchRes.length !== 1) {
    throw new Error('could not get schemas');
  }

  const schemas = searchRes[0].operationalEntry;

  const rawAttributeTypes = schemas['attributeTypes'];

  if (rawAttributeTypes === undefined || !Array.isArray(rawAttributeTypes)) {
    throw new Error('no attribute type schemas');
  }

  const rawObjectClassSchemas = schemas['objectClasses'];

  if (rawObjectClassSchemas === undefined || !Array.isArray(rawObjectClassSchemas)) {
    throw new Error('no object class schemas');
  }

  const attributeTypeMap: attributeTypeSchemaMap =
  {
    attributeTypes: [],
    nameMap: {}
  };

  for (const rawAttributeType of rawAttributeTypes) {
    attributeTypeMap.attributeTypes.push(parseAttributeTypeSchema(rawAttributeType));
  }

  attributeTypeMap.attributeTypes.forEach((attributeType, index) => {
    attributeTypeMap.nameMap[attributeType.oid] = index;

    if (attributeType.name !== undefined) {
      attributeType.name.forEach((name) => {
        attributeTypeMap.nameMap[name.toLowerCase()] = index;
      });
    }
  });

  const objectClassMap: objectClassSchemaMap = {
    objectClassSchemas: [],
    nameMap: {}
  };

  for (const rawObjectClassSchema of rawObjectClassSchemas) {
    objectClassMap.objectClassSchemas.push(parseObjectClassSchema(rawObjectClassSchema));
  }

  objectClassMap.objectClassSchemas.forEach((schema, index) => {
    objectClassMap.nameMap[schema.oid] = index;

    if (schema.names !== undefined) {
      schema.names.forEach((name) => {
        objectClassMap.nameMap[name.toLowerCase()] = index;
      });
    }
  });

  const inheritedObjectClassMap = addInheritedAttributes(structuredClone(objectClassMap), attributeTypeMap);

  return {
    attributeTypeMap: attributeTypeMap,
    inheritedObjectClassMap: inheritedObjectClassMap,
    originalObjectClassMap: objectClassMap
  };
};

export default fetchSchemas;
