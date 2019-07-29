import { UpsertSpecAction, RemoveSpecAction, UPSERT_SPEC, REMOVE_SPEC, SpecParsedAction } from '../actions/specs';
import { SpecList } from '../chart_store';

export function specsReducer(state: SpecList = {}, action: UpsertSpecAction | RemoveSpecAction | SpecParsedAction) {
  switch (action.type) {
    case UPSERT_SPEC:
      console.log('upsert spec', action.spec);
      return {
        ...state,
        [action.spec.id]: action.spec,
      };
    case REMOVE_SPEC:
      console.log('remove spec', action.id);
      const { [action.id]: specToRemove, ...rest } = state;
      return {
        ...rest,
      };
    default:
      return state;
  }
}
