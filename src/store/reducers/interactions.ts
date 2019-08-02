import { CursorPositionChangeAction, ON_CURSOR_POSITION_CHANGE } from '../actions/cursor';
import { InteractionsStore } from '../chart_store';

export function interactionsReducer(state: InteractionsStore, action: CursorPositionChangeAction): InteractionsStore {
  switch (action.type) {
    case ON_CURSOR_POSITION_CHANGE:
      const { x, y } = action;
      console.log('update cursor', action);
      return {
        ...state,
        rawCursorPosition: {
          x,
          y,
        },
      };
    default:
      return state;
  }
}
