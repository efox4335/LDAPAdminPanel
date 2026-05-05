import tokenizeLdapSchema from './tokenizeLdapSchema';
import type { attributeTypeSchema } from './types';
import detLdapSchemaListPart from './detLdapSchemaListPart';

type attributeTypeSchemaPart =
  'DETERMINENEXTPART' |
  'OID' |
  'NAMEIND' |
  'NAMELIST' |
  'DESCIND' |
  'SUPIND' |
  'EQUALITYIND' |
  'ORDERINGIND' |
  'SUBSTRIND' |
  'SYNTAXIND' |
  'USAGEIND' |
  'EXTENSIONS' |
  'EXTVALUELIST' |
  'END';

const parseAttributeTypeSchema = (rawAttributeSchema: string): attributeTypeSchema => {
  const curSchema: attributeTypeSchema = {
    oid: '',
    name: undefined,
    description: undefined,
    obsolete: false,
    superiorAttributeType: undefined,
    eqMatchingRule: undefined,
    ordMatchingRule: undefined,
    subStrMatchingRule: undefined,
    attributeSyntax: undefined,
    singleValue: false,
    collective: false,
    noUserMod: false,
    usage: undefined,
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
          case 'NAME':
            curPart = 'NAMEIND';
            break;
          case 'DESC':
            curPart = 'DESCIND';
            break;
          case 'OBSOLETE':
            curSchema.obsolete = true;
            break;
          case 'SUP':
            curPart = 'SUPIND';
            break;
          case 'EQUALITY':
            curPart = 'EQUALITYIND';
            break;
          case 'ORDERING':
            curPart = 'ORDERINGIND';
            break;
          case 'SUBSTR':
            curPart = 'SUBSTRIND';
            break;
          case 'SYNTAX':
            curPart = 'SYNTAXIND';
            break;
          case 'SINGLE-VALUE':
            curSchema.singleValue = true;
            break;
          case 'COLLECTIVE':
            curSchema.collective = true;
            break;
          case 'NO-USER-MODIFICATION':
            curSchema.noUserMod = true;
            break;
          case 'USAGE':
            curPart = 'USAGEIND';
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
      case 'NAMEIND':
        if (token === '(') {
          curPart = 'NAMELIST';

          curSchema.name = [];
        } else {
          curPart = 'DETERMINENEXTPART';

          curSchema.name = [token];
        }

        break;
      case 'NAMELIST':
        switch (detLdapSchemaListPart(token)) {
          case 'LISTDELIM':
            break;
          case 'LISTEND':
            curPart = 'DETERMINENEXTPART';

            break;
          case 'VALUE':
            if (curSchema.name !== undefined) {
              curSchema.name.push(token);
            } else {
              throw new Error('curSchema name array not initialized');
            }

            break;
        }

        break;
      case 'DESCIND':
        curSchema.description = token;

        curPart = 'DETERMINENEXTPART';

        break;
      case 'SUPIND':
        curSchema.superiorAttributeType = token;

        curPart = 'DETERMINENEXTPART';

        break;
      case 'EQUALITYIND':
        curSchema.eqMatchingRule = token;

        curPart = 'DETERMINENEXTPART';

        break;
      case 'ORDERINGIND':
        curSchema.ordMatchingRule = token;

        curPart = 'DETERMINENEXTPART';

        break;
      case 'SUBSTRIND':
        curSchema.subStrMatchingRule = token;

        curPart = 'DETERMINENEXTPART';

        break;
      case 'SYNTAXIND':
        if (token.includes('{')) {
          const splitToken = token.split(/{|}/);

          curSchema.attributeSyntax = {
            oid: splitToken[0],
            size: parseInt(splitToken[1])
          };
        } else {
          curSchema.attributeSyntax = {
            oid: token,
            size: undefined
          };
        }

        curPart = 'DETERMINENEXTPART';

        break;

      case 'USAGEIND':
        switch (token) {
          case 'userApplications':
            curSchema.usage = 'USERAPPLICATIONS';

            break;

          case 'directoryOperation':
            curSchema.usage = 'DIRECTORYOPERATION';

            break;
          case 'distributedOperation':
            curSchema.usage = 'DISTRIBUTEDOPERATION';

            break;
          case 'dSAOperation':
            curSchema.usage = 'DSAOPERATION';

            break;
          default:
            throw new Error(`unrecognized usage ${token} found`);
        }

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

export default parseAttributeTypeSchema;
