import * as React from "react";
import { Cell } from "@silevis/reactgrid";
import { CellTemplate, Compatible, Uncertain, UncertainCompatible } from "@silevis/reactgrid";

export interface SeparatorCell extends Cell {
    type: 'separator';
    text?: string;
    value?: number;
}

export class SeparatorCellTemplate implements CellTemplate<SeparatorCell> {
    getCompatibleCell(uncertainCell: Uncertain<SeparatorCell>): Compatible<SeparatorCell> {
        const text = uncertainCell.text || "";
        const value = uncertainCell.value || 0;
        return { ...uncertainCell, text, value };
    }

    update(cell: Compatible<SeparatorCell>, cellToMerge: UncertainCompatible<SeparatorCell>): Compatible<SeparatorCell> {
        return this.getCompatibleCell({ ...cell, text: cellToMerge.text });
    }

    render(
        cell: Compatible<SeparatorCell>,
        isInEditMode: boolean,
        onCellChanged: (cell: Compatible<SeparatorCell>, commit: boolean) => void
    ): React.ReactNode {
        if (isInEditMode) {
            // 編集モードの場合、インプットボックスを表示
            return (
                <input
                    type="text"
                    defaultValue={cell.text}
                    onBlur={() => onCellChanged(cell, true)} // 編集をコミット
                    onChange={(e) => onCellChanged({ ...cell, text: e.target.value }, false)}
                    autoFocus
                />
            );
        }
        
        // 通常モードの場合、テキストを表示
        return <div className="rg-separator-cell">{cell.text}</div>;
    }
}
