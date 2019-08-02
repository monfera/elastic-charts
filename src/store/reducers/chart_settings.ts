import { UpdateParentDimensionAction, UPDATE_PARENT_DIMENSION } from '../actions/chart_settings';
import { StoreSettings } from '../chart_store';

export function chartSettingsReducer(state: StoreSettings, action: UpdateParentDimensionAction): StoreSettings {
  switch (action.type) {
    case UPDATE_PARENT_DIMENSION:
      console.log('update parent dimensions', action.dimensions);
      return {
        ...state,
        parentDimensions: action.dimensions,
      };
    default:
      return state;
  }
}
