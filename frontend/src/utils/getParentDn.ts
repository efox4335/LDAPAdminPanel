const getParentDn = (dn: string): string => {
  const splitDn = dn.split(/[^,]*,(.*)/);

  if (splitDn.length === 1) {
    return 'dse';
  }

  return splitDn[1];
};

export default getParentDn;
