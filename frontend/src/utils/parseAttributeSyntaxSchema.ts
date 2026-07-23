import tokenizeLdapSchema from './tokenizeLdapSchema';
import type { attributeSyntaxSchema } from './types';
import detLdapSchemaListPart from './detLdapSchemaListPart';

type attributeTypeSchemaPart =
  'DETERMINENEXTPART' |
  'OID' |
  'DESCIND' |
  'EXTENSIONS' |
  'EXTVALUELIST' |
  'END';

const parseAttributeSyntaxSchema = (rawAttributeSchema: string): attributeSyntaxSchema => {
  const curSchema: attributeSyntaxSchema = {
    oid: '',
    description: undefined,
    extensions: undefined
  };

  const tokens = tokenizeLdapSchema(rawAttributeSchema);

  let curPart: attributeTypeSchemaPart = 'OID';

  for (const token of tokens) {
    if (curPart === 'END') {
      break;
    }

    switch (curPart) {
      case 'OID':
        if (token === '(') {
          break;
        } else {
          curSchema.oid = token;

          curPart = 'DETERMINENEXTPART';
        }

        break;
      case 'DETERMINENEXTPART':
        switch (token) {
          case 'DESC':
            curPart = 'DESCIND';
            break;
          case ')':
            curPart = 'END';
            break;
          default:
            if (token.startsWith('X-')) {
              if (curSchema.extensions === undefined) {
                curSchema.extensions = [];
              }

              curSchema.extensions.push({
                name: token,
                value: []
              });

              curPart = 'EXTENSIONS';
            } else {
              throw new Error(`unable to parse token ${token}`);
            }
            break;
        }
        break;
      case 'DESCIND':
        curSchema.description = token;

        curPart = 'DETERMINENEXTPART';

        break;
      case 'EXTENSIONS':
        if (curSchema.extensions === undefined) {
          throw new Error('curSchema extensions not defined after extension encountered');
        }

        if (token === '(') {
          curPart = 'EXTVALUELIST';
        } else {
          curSchema.extensions[curSchema.extensions.length - 1].value = [token];

          curPart = 'DETERMINENEXTPART';
        }

        break;
      case 'EXTVALUELIST':
        switch (detLdapSchemaListPart(token)) {
          case 'LISTDELIM':
            break;
          case 'LISTEND':
            curPart = 'DETERMINENEXTPART';

            break;
          case 'VALUE':
            if (curSchema.extensions !== undefined) {
              curSchema.extensions[curSchema.extensions.length - 1].value.push(token);
            } else {
              throw new Error('curSchema extensions not defined after extension encountered');
            }

            break;
        }

        break;
    }
  }

  return curSchema;
};

export default parseAttributeSyntaxSchema;
