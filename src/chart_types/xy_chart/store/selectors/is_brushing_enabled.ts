import { createSelector } from 'reselect';
import { isBrushAvailableSelector } from './is_brush_available';
import { computeCursorPositionSelector } from './compute_cursor_position';

export const isBrushingEnabledSelector = createSelector(
  [isBrushAvailableSelector, computeCursorPositionSelector],
  (isBrushAvailable, cursorPosition): boolean => {
    if (!isBrushAvailable) {
      return false;
    }

    const isBrushingEnabled = cursorPosition.x > -1 && cursorPosition.y > -1;
    if (isBrushingEnabled) {
      document.body.style.cursor = 'crosshair';
    } else {
      document.body.style.cursor = 'default';
    }
    return isBrushingEnabled;
  },
);
