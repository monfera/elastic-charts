import { createSelector } from 'reselect';

export const getTooltipPositionSelector = createSelector(
  [],
  getTooltipPosition,
);

function getTooltipPosition(): { transform: string } {
  return { transform: '' };
}
