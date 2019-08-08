import { UpdateParentDimensionAction, UPDATE_PARENT_DIMENSION } from '../actions/chart_settings';
import { GlobalSettings } from '../chart_store';

export function chartSettingsReducer(state: GlobalSettings, action: UpdateParentDimensionAction): GlobalSettings {
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
