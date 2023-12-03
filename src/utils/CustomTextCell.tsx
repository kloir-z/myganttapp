// CustomDateCellTemplate.tsx
import * as React from "react";
import { CellTemplate, Compatible, Uncertain, UncertainCompatible, keyCodes, Cell } from "@silevis/reactgrid";
import { isAlphaNumericKey, isNavigationKey } from "@silevis/reactgrid";
import "./CustomTextCellTemplate.css";

export interface CustomTextCell extends Cell {
  type: 'customText';
  text: string;
  value: number;
}

export class CustomTextCellTemplate implements CellTemplate<CustomTextCell> {
  private wasEscKeyPressed = false;
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
        <div className="input-text__item">
          <div className="input-text__dummy js-dummy-input-text" data-placeholder=" "></div>
          <input
            type="text"
            className="input-text js-input-text"
            defaultValue={cell.text}
            ref={input => {
              if (input) {
                input.focus();
                const dummyElement = input.previousSibling as HTMLElement;
                if (dummyElement) {
                  dummyElement.textContent = cell.text;
                }
              }
            }}
            onChange={e => {
              const value = e.currentTarget.value;
              onCellChanged(this.getCompatibleCell({ ...cell, text: value }), false);
              
              const dummyElement = e.currentTarget.previousSibling as HTMLElement;
              if (dummyElement) {
                dummyElement.textContent = value;
              }
            }}
            onBlur={e => { onCellChanged(this.getCompatibleCell({ ...cell, text: e.currentTarget.value }), !this.wasEscKeyPressed); this.wasEscKeyPressed = false; }}
            onCopy={e => e.stopPropagation()}
            onCut={e => e.stopPropagation()}
            onPaste={e => e.stopPropagation()}
            onPointerDown={e => e.stopPropagation()}
            onKeyDown={e => {
              if (isAlphaNumericKey(e.keyCode) || (isNavigationKey(e.keyCode))) e.stopPropagation();
              if (e.keyCode === keyCodes.ESCAPE) this.wasEscKeyPressed = true;
            }}
          />
        </div>
      );
    }
    return <span>{cell.text}</span>;
  }
}