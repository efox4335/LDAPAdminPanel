import type { newLdapAttributeValue } from './types';

const getAttributeValues = (values: newLdapAttributeValue[]): string[] => {
  const noEmptyValues: newLdapAttributeValue[] = values.filter((value) => value.value !== '');

  if (noEmptyValues.length === 0) {
    return [''];
  }

  return noEmptyValues.map((value) => value.value);
};

export default (getAttributeValues);
