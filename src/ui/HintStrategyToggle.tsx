import React from 'react';

export const HintStrategyToggle = ({
  value,
  onChange
}: {
  value: 'A' | 'B';
  onChange: (v: 'A' | 'B') => void;
}) => (
  <div>
    <span>提示策略: </span>
    <button disabled={value === 'A'} onClick={() => onChange('A')}>
      A 保守
    </button>
    <button disabled={value === 'B'} onClick={() => onChange('B')}>
      B 直接
    </button>
  </div>
);
