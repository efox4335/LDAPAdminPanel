const getAttributeValues = (values: string): string[] => {
  return values
    .split(/\s*,\s*/)
    .map((val) => {
      const startWhiteSpaceRemoved = val.replace(/^\s*/g, '');

      return startWhiteSpaceRemoved.replace(/\s*$/g, '');
    })
    .filter((val) => val !== '');
};

export default (getAttributeValues);
