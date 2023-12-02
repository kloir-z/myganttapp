// CustomDateCellTemplate.tsx
import * as React from "react";
import { CellTemplate, Compatible, Uncertain, UncertainCompatible, keyCodes, Cell } from "@silevis/reactgrid";

export interface CustomTextCell extends Cell {
  type: 'customText';
  text: string;
  value: number;
}

export class CustomTextCellTemplate implements CellTemplate<CustomTextCell> {
  getCompatibleCell(uncertainCell: Uncertain<CustomTextCell>): Compatible<CustomTextCell> {
    let text = uncertainCell.text || '';
    let value = text.length;
    return { ...uncertainCell, text, value };
  }

  handleKeyDown(
    cell: Compatible<CustomTextCell>,
    keyCode: number
  ): { cell: Compatible<CustomTextCell>; enableEditMode: boolean } {
    if (keyCode === keyCodes.ENTER || keyCode === keyCodes.POINTER) {
      return { cell, enableEditMode: true };
    }
    return { cell, enableEditMode: false };
  }

  update(cell: Compatible<CustomTextCell>, cellToMerge: UncertainCompatible<CustomTextCell>): Compatible<CustomTextCell> {
    return this.getCompatibleCell({ ...cell, text: cellToMerge.text });
  }

  render(
    cell: Compatible<CustomTextCell>,
    isInEditMode: boolean,
    onCellChanged: (cell: Compatible<CustomTextCell>, commit: boolean) => void
  ): React.ReactNode {
    if (isInEditMode) {
      return (
        <input
          type="text"
          defaultValue={cell.text}
          ref={input => input && input.focus()}
          onChange={e => {
            onCellChanged({ ...cell, text: e.target.value }, false);
          }}
          onBlur={e => {
            onCellChanged({ ...cell, text: e.target.value }, true);
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
    return <span>{cell.text}</span>;
  }
}