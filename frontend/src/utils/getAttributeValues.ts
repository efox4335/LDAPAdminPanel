const getAttributeValues = (values: string): string[] => {
  return values.split(/\s*,\s*/).filter((val) => val !== '');
};

export default (getAttributeValues);
