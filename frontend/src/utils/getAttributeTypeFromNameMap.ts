import type { attributeTypeSchemaMap, attributeTypeSchema } from './types';

const getAttributeTypeFromNameMap = (map: attributeTypeSchemaMap, schemaName: string): attributeTypeSchema | undefined => {
  const curIndex = map.nameMap[schemaName.toLowerCase()];

  if (curIndex === undefined) {
    return undefined;
  }

  return map.attributeTypes[curIndex];
};

export default getAttributeTypeFromNameMap;
