// ChartBarContextMenu.tsx
import React, { useEffect, useRef } from 'react';

interface ChartBarContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
}

const ChartBarContextMenu: React.FC<ChartBarContextMenuProps> = ({ x, y, onClose, onDelete }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose(); // 外側をクリックしたときに閉じる
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={menuRef} style={{ position: 'fixed', top: y, left: x, zIndex: 1000, backgroundColor: 'white', border: '1px solid black' }}>
      <div onClick={onDelete} style={{ padding: '10px', cursor: 'pointer' }}>
        削除
      </div>
    </div>
  );
};

export default ChartBarContextMenu;
