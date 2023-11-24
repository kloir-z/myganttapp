// CustomDateCellTemplate.tsx
import * as React from "react";
import { CellTemplate, Compatible, Uncertain, UncertainCompatible, keyCodes, Cell } from "@silevis/reactgrid";

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
    text = this.standardizeLongDateFormat(text);
    shortDate = this.standardizeShortDateFormat(text);
    const value = NaN;
    return { ...uncertainCell, text, shortDate, value };
  }
  

  standardizeShortDateFormat(dateStr: string) {
    const yyyyMMddSlashRegex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
    const yyyyMMddHyphenRegex = /^\d{4}-\d{1,2}-\d{1,2}$/;
    const mmDdYyyyRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    const ddMmYyyyRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  
    let standardizedDate = dateStr;

    function removeLeadingZero(str: string) {
      return String(parseInt(str, 10));
    }
  
    if (yyyyMMddSlashRegex.test(dateStr)) {
      const [year, month, day] = dateStr.split('/');
      standardizedDate = `${removeLeadingZero(month)}/${removeLeadingZero(day)}`;
    } else if (yyyyMMddHyphenRegex.test(dateStr)) {
      const [year, month, day] = dateStr.split('-');
      standardizedDate = `${removeLeadingZero(month)}/${removeLeadingZero(day)}`;
    } else if (mmDdYyyyRegex.test(dateStr)) {
      const [month, day, year] = dateStr.split('/');
      standardizedDate = `${removeLeadingZero(month)}/${removeLeadingZero(day)}`;
    } else if (ddMmYyyyRegex.test(dateStr)) {
      const [day, month, year] = dateStr.split('/');
      standardizedDate = `${removeLeadingZero(month)}/${removeLeadingZero(day)}`;
    }
    return standardizedDate;
  }

  standardizeLongDateFormat(dateStr: string) {
    const yyyyMMddSlashRegex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
    const yyyyMMddHyphenRegex = /^\d{4}-\d{1,2}-\d{1,2}$/;
    const mmDdYyyyRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    const ddMmYyyyRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  
    let standardizedDate = dateStr;
  
    if (yyyyMMddSlashRegex.test(dateStr)) {
      const [year, month, day] = dateStr.split('/');
      standardizedDate = `${year}/${month}/${day}`;
    } else if (yyyyMMddHyphenRegex.test(dateStr)) {
      const [year, month, day] = dateStr.split('-');
      standardizedDate = `${year}/${month}/${day}`;
    } else if (mmDdYyyyRegex.test(dateStr)) {
      const [month, day, year] = dateStr.split('/');
      standardizedDate = `${year}/${month}/${day}`;
    } else if (ddMmYyyyRegex.test(dateStr)) {
      const [day, month, year] = dateStr.split('/');
      standardizedDate = `${year}/${month}/${day}`;
    }
    return standardizedDate;
  }

  formatToISO(dateStr: string) {
    const yyyyMMddRegex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
    if (yyyyMMddRegex.test(dateStr)) {
      return dateStr.replace(/\//g, '-');
    }
    // ...
    return dateStr;
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
      const formattedDate = this.formatToISO(cell.text);
      return (
        <input
          type="date"
          defaultValue={formattedDate}
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