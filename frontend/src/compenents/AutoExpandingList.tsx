import { type ComponentType, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { autoExpandingListContainer } from '../utils/types';

interface displayProps<T> {
  data: T,
  id: string,
  handleUpdate: (newData: T, delData: boolean, id: string) => void
};

interface displayPropsWithArg<T, K> extends displayProps<T> {
  additionalDisplayProps: K
}

const generateLocalData = <T,>(
  realData: T[],
  isBlankEntry: (arg0: T) => boolean,
  newBlankEntry: () => T
): { id: string, data: T }[] => {
  let dataCopy = realData.map((singleData) => { return { id: uuidv4(), data: singleData }; });

  if (dataCopy.length === 0 || !isBlankEntry(dataCopy[dataCopy.length - 1].data)) {
    dataCopy = [...dataCopy, { id: uuidv4(), data: newBlankEntry() }];
  }

  return dataCopy;
};

const AutoExpandingList = <T, K = undefined>({
  isBlankEntry,
  newBlankEntry,
  data,
  setData,
  DataDisplay,
  additionalDisplayProps,
}: {
  isBlankEntry: (arg0: T) => boolean,
  newBlankEntry: () => T,
  data: T[],
  setData: (arg0: T[]) => void,
  DataDisplay: ComponentType<displayPropsWithArg<T, K>>,
  additionalDisplayProps?: K,
}) => {
  const [localDataCopy, setLocalDataCopy] = useState<autoExpandingListContainer<T>[]>(
    generateLocalData(data, isBlankEntry, newBlankEntry)
  );

  useEffect(() => {
    let didParentUpdateData = false;

    data.forEach((val, index) => {
      if (!Object.is(val, localDataCopy[index].data)) {
        didParentUpdateData = true;
      }
    });

    if (data.length !== localDataCopy.length) {
      didParentUpdateData = true;
    }

    if (didParentUpdateData) {
      setLocalDataCopy(generateLocalData(data, isBlankEntry, newBlankEntry));
    }
  }, [data]);

  const handleUpdate = (newData: T, delData: boolean, id: string) => {
    let tempData = [...localDataCopy];

    if (delData) {
      tempData = tempData.filter((singleData) => singleData.id !== id);
    } else {
      tempData = tempData.map((singleData) => {
        if (singleData.id === id) {
          return {
            ...singleData,
            data: newData
          };
        }

        return singleData;
      });
    }

    if (tempData.length === 0 || !isBlankEntry(tempData[tempData.length - 1].data)) {
      tempData = [...tempData, { id: uuidv4(), data: newBlankEntry() }];
    }

    setLocalDataCopy(tempData);
    setData(tempData.map((data) => data.data));
  };

  return (
    <>
      {localDataCopy.map((singleData) => {
        const curDisplayProps = {
          additionalDisplayProps: additionalDisplayProps,
          data: singleData.data,
          id: singleData.id,
          handleUpdate: handleUpdate,
        } as displayPropsWithArg<T, K>;

        return (<DataDisplay key={singleData.id} {...curDisplayProps} />);
      })}
    </>
  );
};

export default AutoExpandingList;
