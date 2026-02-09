import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { settingsStore, settingPath, settingValue } from '../utils/types';

const initialState: settingsStore = {
  isSettingsPanelOpen: false,
  settings: {},
  defaults: {}
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.settings = action.payload;
    },
    setDefaults: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.defaults = action.payload;
    },
    openSettingsPanel: (state) => {
      state.isSettingsPanelOpen = true;
    },
    closeSettingsPanel: (state) => {
      state.isSettingsPanelOpen = false;
    }
  },
  selectors: {
    selectSetting: (sliceState, settingPath: settingPath) => {
      let curSetting = sliceState.settings;

      const lastIndex = settingPath.path.length - 1;

      let curIndex = 0;

      for (const path of settingPath.path) {
        if (curIndex === lastIndex) {
          break;
        }

        const nextSetting = curSetting[path];

        if (typeof (nextSetting) !== 'object' || Array.isArray(nextSetting) || nextSetting === undefined) {
          return undefined;
        }

        curSetting = nextSetting as unknown as Record<string, unknown>;

        curIndex += 1;
      }

      return curSetting[settingPath.path[lastIndex]] as settingValue | undefined;
    },
    selectSettingDefault: (sliceState, defaultPath: settingPath) => {
      let curDefault = sliceState.defaults;

      const lastIndex = defaultPath.path.length - 1;

      let curIndex = 0;

      for (const path of defaultPath.path) {
        if (curIndex === lastIndex) {
          break;
        }

        const nextDefault = curDefault[path];

        if (typeof (nextDefault) !== 'object' || Array.isArray(nextDefault) || nextDefault === undefined) {
          return undefined;
        }

        curDefault = nextDefault as unknown as Record<string, unknown>;

        curIndex += 1;
      }

      return curDefault[defaultPath.path[lastIndex]] as settingValue | undefined;
    },
    selectSettingsPanelIsOpen: (sliceState) => {
      return sliceState.isSettingsPanelOpen;
    }
  }
});

export const { setSettings, setDefaults, openSettingsPanel, closeSettingsPanel } = settingsSlice.actions;
export const { selectSetting, selectSettingDefault, selectSettingsPanelIsOpen } = settingsSlice.selectors;

export default settingsSlice.reducer;
