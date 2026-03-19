import type { objectClassSchemaMap, objectClassSchema } from './types';

const getObjectClassFromNameMap = (map: objectClassSchemaMap, schemaName: string): objectClassSchema | undefined => {
  const curIndex = map.nameMap[schemaName.toLowerCase()];

  if (curIndex === undefined) {
    return undefined;
  }

  return map.objectClassSchemas[curIndex];
};

export default getObjectClassFromNameMap;
