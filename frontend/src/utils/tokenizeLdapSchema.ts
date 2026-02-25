const tokenizeLdapSchema = (rawSchema: string): string[] => {
  const tokens: string[] = [];

  let curToken: string = '';

  let inQuote: boolean = false;

  for (let curCharIndex = 0; curCharIndex < rawSchema.length; curCharIndex++) {
    const curChar = rawSchema[curCharIndex];

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

  return tokens;
};

export default tokenizeLdapSchema;
