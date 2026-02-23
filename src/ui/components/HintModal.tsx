import React from 'react';

export const HintModal = ({ text, onClose }: { text: string; onClose: () => void }) => (
  <div style={{ border: '1px solid #ccc', padding: 12, margin: '8px 0' }}>
    <strong>提示</strong>
    <p>{text}</p>
    <button onClick={onClose}>关闭</button>
  </div>
);
