import tokenizeLdapSchema from './tokenizeLdapSchema';
import type { attributeTypeSchema } from './types';

const parseAttributeTypeSchema = (rawAttributeSchema: string): attributeTypeSchema => {
  const curSchema: attributeTypeSchema = {
    oid: '',
    name: undefined
  };

  const tokens = tokenizeLdapSchema(rawAttributeSchema);

  curSchema.oid = tokens[1];

  if (tokens[2] === 'NAME') {
    curSchema.name = [];

    if (tokens[3] === '(') {
      let curToken = 4;

      while (tokens[curToken] !== ')') {
        if (tokens[curToken] !== '$') {
          curSchema.name.push(tokens[curToken]);
        }

        curToken += 1;
      }
    } else {
      curSchema.name.push(tokens[3]);
    }
  };

  return curSchema;
};

export default parseAttributeTypeSchema;
