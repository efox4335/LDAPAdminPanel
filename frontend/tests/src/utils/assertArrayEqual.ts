const assertArrayEqual = <T>(
  arrOne: T[] | undefined,
  arrTwoArg: T[] | undefined,
  eleToString: (arg: T) => string,
  cmpFuncArg?: (arg0: T, arg1: T) => boolean
) => {
  let arrTwo = arrTwoArg;

  let cmpFunc;

  if (cmpFuncArg) {
    cmpFunc = cmpFuncArg;
  } else {
    cmpFunc = (eleOne: T, eleTwo: T) => eleOne === eleTwo;
  }

  if (arrOne === undefined) {
    if (arrTwo !== undefined) {
      throw new Error('array one was undefined but two was not');
    }
  } else {
    if (arrTwo === undefined) {
      throw new Error('array one was defined but array two was not');
    }

    if (arrOne.length !== arrTwo.length) {
      throw new Error(`array one had length of ${arrOne.length} but array two had length of ${arrTwo.length}`);
    }

    for (const arrOneEle of arrOne) {
      const found = arrTwo.findIndex((arrTwoEle) => {
        return cmpFunc(arrOneEle, arrTwoEle);
      });

      if (found === -1) {
        throw new Error(`array one element ${eleToString(arrOneEle)} not found in array two`);
      }

      let firstFound = false;

      arrTwo = arrTwo.filter((ele) => {
        if (!firstFound && cmpFunc(arrOneEle, ele)) {
          firstFound = true;

          return false;
        }

        return true;
      });
    }
  }
};

export default assertArrayEqual;
