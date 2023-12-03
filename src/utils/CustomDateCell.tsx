// CustomDateCellTemplate.tsx
import * as React from "react";
import { CellTemplate, Compatible, Uncertain, UncertainCompatible, keyCodes, Cell } from "@silevis/reactgrid";
import { standardizeLongDateFormat, standardizeShortDateFormat } from "./wbsHelpers";

export interface CustomDateCell extends Cell {
  type: 'customDate';
  text: string;
  shortDate: string; 
  value: number;
}

export class CustomDateCellTemplate implements CellTemplate<CustomDateCell> {
  getCompatibleCell(uncertainCell: Uncertain<CustomDateCell>): Compatible<CustomDateCell> {
    let text = uncertainCell.text || '';
    let shortDate = ''
    text = standardizeLongDateFormat(text);
    shortDate = standardizeShortDateFormat(text);
    const value = NaN;
    return { ...uncertainCell, text, shortDate, value };
  }

  handleKeyDown(
    cell: Compatible<CustomDateCell>,
    keyCode: number
  ): { cell: Compatible<CustomDateCell>; enableEditMode: boolean } {
    if (keyCode === keyCodes.ENTER || keyCode === keyCodes.POINTER) {
      return { cell, enableEditMode: true };
    }
    return { cell, enableEditMode: false };
  }

  update(cell: Compatible<CustomDateCell>, cellToMerge: UncertainCompatible<CustomDateCell>): Compatible<CustomDateCell> {
    return this.getCompatibleCell({ ...cell, text: cellToMerge.text });
  }

  render(
    cell: Compatible<CustomDateCell>,
    isInEditMode: boolean,
    onCellChanged: (cell: Compatible<CustomDateCell>, commit: boolean) => void
  ): React.ReactNode {
    if (isInEditMode) {
      return (
        <input
          type="date"
          defaultValue={cell.text}
          ref={input => input && input.focus()}
          onChange={e => {
            onCellChanged({ ...cell, text: e.target.value, value: NaN }, false);
          }}
          onBlur={e => {
            onCellChanged({ ...cell, text: e.target.value, value: NaN }, true);
          }}
          onCopy={e => e.stopPropagation()}
          onCut={e => e.stopPropagation()}
          onPaste={e => e.stopPropagation()}
          onPointerDown={e => e.stopPropagation()}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === "Escape") {
              e.stopPropagation();
              onCellChanged({ ...cell, text: e.currentTarget.value }, true);
            }
          }}
        />
      );
    }
    return <span>{cell.shortDate}</span>;
  }  
}