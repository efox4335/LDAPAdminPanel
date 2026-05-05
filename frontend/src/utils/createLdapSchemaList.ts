const createLdapSchemaList = (listItems: string[], includeDollar: boolean): string => {
  let listString = '(';

  listItems.forEach((item, index) => {
    listString = listString.concat(` ${item}`);

    if (index + 1 < listItems.length && includeDollar) {
      listString = listString.concat(' $');
    }
  });

  return listString.concat(' )');
};

export default createLdapSchemaList;
