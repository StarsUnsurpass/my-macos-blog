import React, { useEffect, useState } from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
}

export default function ContextMenu({ x, y, visible, onClose }: ContextMenuProps) {
  if (!visible) return null;

  return (
    <div
      className="macos-v2-context-menu"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="macos-v2-context-menu-item"
        onClick={() => {
          window.location.reload();
          onClose();
        }}
      >
        Refresh
      </div>
    </div>
  );
}
