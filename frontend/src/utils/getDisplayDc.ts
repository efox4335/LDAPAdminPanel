const getDisplayDc = (parentDn: string, childDn: string): string => {
  //end of string needed because the childDn could contain the parent multiple times
  const regex = new RegExp(`${parentDn}$`);

  const splitStr = childDn.split(regex);
  return splitStr[0];
};

export default getDisplayDc;
