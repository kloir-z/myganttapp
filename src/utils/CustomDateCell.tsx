// CustomDateCellTemplate.tsx
import * as React from "react";
import { CellTemplate, Compatible, Uncertain, keyCodes, Cell } from "@silevis/reactgrid";
// import "./custom-date-cell-style.css"; // You may need to create this CSS file for custom styles

export interface CustomDateCell extends Cell {
  type: 'customDate';
  text: string;
  value: number;
}

export class CustomDateCellTemplate implements CellTemplate<CustomDateCell> {
  getCompatibleCell(uncertainCell: Uncertain<CustomDateCell>): Compatible<CustomDateCell> {
    const text = uncertainCell.text || '';
    const value = NaN; // 日付の数値表現がないため NaN を使用
    return { ...uncertainCell, text, value };
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

  render(
    cell: Compatible<CustomDateCell>,
    isInEditMode: boolean,
    onCellChanged: (cell: Compatible<CustomDateCell>, commit: boolean) => void
  ): React.ReactNode {
    if (isInEditMode) {
      // Render date input in edit mode
      return (
        <input
          type="date"
          defaultValue={cell.text}
          onChange={e => onCellChanged({ ...cell, text: e.target.value }, true)}
          autoFocus
        />
      );
    }
    // Render text when not in edit mode
    return <span>{cell.text}</span>;
  }
}
