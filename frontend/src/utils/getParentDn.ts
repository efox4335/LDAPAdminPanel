const getParentDn = (dn: string): string => {
  const splitDn = dn.split(/[^,]*,(.*)/);

  if (splitDn.length === 1) {
    return splitDn[0];
  }

  return splitDn[1];
};

export default getParentDn;
