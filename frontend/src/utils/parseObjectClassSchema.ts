import type { objectClassSchema } from './types';

const parseLdapObjectClassList = (curToken: string): 'VALUE' | 'LISTDELIM' | 'LISTEND' => {
  switch (curToken) {
    case '(':
      return 'LISTDELIM';
    case '$':
      return 'LISTDELIM';
    case ')':
      return 'LISTEND';
    default:
      return 'VALUE';
  }
};

type objectClassSchemaParts =
  'DETERMINENEXTPART' |
  'OID' |
  'NAMEIND' |
  'NAMELIST' |
  'DESCRIPTIONIND' |
  'DESCRIPTION' |
  'SUPERIORIND' |
  'SUPERIORLIST' |
  'REQIND' |
  'REQATTRIBUTELIST' |
  'OPTIND' |
  'OPTATTRIBUTELIST' |
  'END';

const parseObjectClassSchema = (rawObjectClassSchema: string): objectClassSchema => {
  const tokens: string[] = [];

  let curToken: string = '';

  let inQuote: boolean = false;

  for (let curCharIndex = 0; curCharIndex < rawObjectClassSchema.length; curCharIndex++) {
    const curChar = rawObjectClassSchema[curCharIndex];

    if (curChar === '\\') {
      curCharIndex++;

      continue;
    }

    if (curChar === ' ' && !inQuote) {
      if (curToken !== '') {
        tokens.push(curToken);
      }

      curToken = '';

      continue;
    }

    if (curChar === '\'') {
      if (inQuote) {
        tokens.push(curToken);

        curToken = '';

        inQuote = false;
      } else {
        inQuote = true;
      }

      continue;
    }

    if (curChar === '(' && !inQuote) {
      if (curToken !== '') {
        tokens.push(curToken);

        curToken = '';
      }

      tokens.push(curChar);

      continue;
    }

    if (curChar === ')' && !inQuote) {
      if (curToken !== '') {
        tokens.push(curToken);

        curToken = '';
      }

      tokens.push(curChar);

      continue;
    }

    if (curChar === '$' && !inQuote) {
      if (curToken !== '') {
        tokens.push(curToken);

        curToken = '';
      }

      tokens.push(curChar);

      continue;
    }

    curToken += curChar;
  }

  const curSchema: objectClassSchema = {
    oid: '',
    names: undefined,
    description: undefined,
    obsolete: false,
    superiorObjectClasses: undefined,
    type: 'INPARENT',
    reqAttributes: undefined,
    optAttributes: undefined
  };

  let curPart: objectClassSchemaParts = 'OID';

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
            curPart = 'DESCRIPTIONIND';
            break;
          case 'OBSOLETE':
            curSchema.obsolete = true;
            break;
          case 'SUP':
            curPart = 'SUPERIORIND';
            break;
          case 'ABSTRACT':
            curSchema.type = 'ABSTRACT';
            break;
          case 'STRUCTURAL':
            curSchema.type = 'STRUCTURAL';
            break;
          case 'AUXILIARY':
            curSchema.type = 'AUXILIARY';
            break;
          case 'MUST':
            curPart = 'REQIND';
            break;
          case 'MAY':
            curPart = 'OPTIND';
            break;
          case ')':
            curPart = 'END';
            break;
          default:
            throw new Error(`unable to parse token ${token}`);
            break;
        }
        break;
      case 'NAMEIND':
        if (token === '(') {
          curPart = 'NAMELIST';

          curSchema.names = [];
        } else {
          curPart = 'DETERMINENEXTPART';

          curSchema.names = [token];
        }

        break;
      case 'NAMELIST':
        switch (parseLdapObjectClassList(token)) {
          case 'LISTDELIM':
            break;
          case 'LISTEND':
            curPart = 'DETERMINENEXTPART';

            break;
          case 'VALUE':
            if (curSchema.names !== undefined) {
              curSchema.names.push(token);
            } else {
              throw new Error('curSchema name array not initialized');
            }

            break;
        }

        break;
      case 'DESCRIPTIONIND':
        curSchema.description = token;

        curPart = 'DETERMINENEXTPART';

        break;
      case 'SUPERIORIND':
        if (token === '(') {
          curSchema.superiorObjectClasses = [];

          curPart = 'SUPERIORLIST';
        } else {
          curSchema.superiorObjectClasses = [token];

          curPart = 'DETERMINENEXTPART';
        }

        break;
      case 'SUPERIORLIST':
        switch (parseLdapObjectClassList(token)) {
          case 'LISTDELIM':
            break;
          case 'LISTEND':
            curPart = 'DETERMINENEXTPART';

            break;
          case 'VALUE':
            if (curSchema.superiorObjectClasses !== undefined) {
              curSchema.superiorObjectClasses.push(token);
            } else {
              throw new Error('curSchema superior object classes array not initialized');
            }

            break;
        }

        break;
      case 'REQIND':
        if (token === '(') {
          curSchema.reqAttributes = [];

          curPart = 'REQATTRIBUTELIST';
        } else {
          curSchema.reqAttributes = [token];

          curPart = 'DETERMINENEXTPART';
        }

        break;
      case 'REQATTRIBUTELIST':
        switch (parseLdapObjectClassList(token)) {
          case 'LISTDELIM':
            break;
          case 'LISTEND':
            curPart = 'DETERMINENEXTPART';

            break;
          case 'VALUE':
            if (curSchema.reqAttributes !== undefined) {
              curSchema.reqAttributes.push(token);
            } else {
              throw new Error('curSchema required attributes array not initialized');
            }

            break;
        }

        break;

      case 'OPTIND':
        if (token === '(') {
          curSchema.optAttributes = [];

          curPart = 'OPTATTRIBUTELIST';
        } else {
          curSchema.optAttributes = [token];

          curPart = 'END';
        }

        break;
      case 'OPTATTRIBUTELIST':
        switch (parseLdapObjectClassList(token)) {
          case 'LISTDELIM':
            break;
          case 'LISTEND':
            curPart = 'END';

            break;
          case 'VALUE':
            if (curSchema.optAttributes !== undefined) {
              curSchema.optAttributes.push(token);
            } else {
              throw new Error('curShchema opterational attributes array not initialized');
            }

            break;
        }
    }
  }

  return curSchema;
};

export default parseObjectClassSchema;
