export const BUFFS = [
  { id: 'out_1', name: '量子过载', type: 'Output', tags: ['QUANTUM'], effect: { outputMult: 0.35 } },
  { id: 'out_2', name: '因果放大', type: 'Output', tags: ['CAUSAL'], effect: { outputMult: 0.3 } },
  { id: 'tempo_1', name: '回路加速', type: 'Tempo', tags: ['LOOP'], effect: { tempoMult: 0.2 } },
  { id: 'tempo_2', name: '熵压缩', type: 'Tempo', tags: ['ENTROPY'], effect: { tempoMult: 0.22 } },
  { id: 'special_1', name: '时间延展', type: 'Special', tags: ['LOOP'], effect: { timeBonus: 10 } },
  { id: 'special_2', name: '异常复制', type: 'Special', tags: ['QUANTUM', 'CAUSAL'], effect: { comboMult: 0.25 } }
];
