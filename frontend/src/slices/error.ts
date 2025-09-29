import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { displayError } from '../utils/types';
import generateErrorMessage from '../utils/generateErrorMessage';

const initialState: displayError[] = [];

const errorSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    addError: {
      reducer: (state, action: PayloadAction<displayError>) => {
        state.push(action.payload);
      },
      prepare: (err: unknown) => {
        const disError: displayError = {
          id: nanoid(),
          message: generateErrorMessage(err),
          rawError: JSON.stringify(err, null, 2)
        };

        return { payload: disError };
      }
    },

    delError: (state, action: PayloadAction<string>) => {
      return state.filter((val) => val.id !== action.payload);
    }
  },
  selectors: {
    selectErrors: (sliceState) => {
      return sliceState;
    }
  }
});

export const { addError, delError } = errorSlice.actions;
export const { selectErrors } = errorSlice.selectors;

export default errorSlice.reducer;
