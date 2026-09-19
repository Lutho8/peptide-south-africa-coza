import { describe, expect, it } from 'vitest';
import { pageText } from '../pdfText';

describe('pageText', () => {
  it('reconstructs lab rows by y position and x order', () => {
    const items = [
      { str: 'mmol/L', transform: [1, 0, 0, 1, 420, 700] },
      { str: '3.5 - 5.5', transform: [1, 0, 0, 1, 280, 700] },
      { str: '6,2 ▲', transform: [1, 0, 0, 1, 190, 700] },
      { str: 'Glukose', transform: [1, 0, 0, 1, 40, 700] },
      { str: 'mIU/L', transform: [1, 0, 0, 1, 420, 680] },
      { str: '0.4 - 4.0', transform: [1, 0, 0, 1, 280, 680] },
      { str: '2,1', transform: [1, 0, 0, 1, 190, 680] },
      { str: 'TSH basal', transform: [1, 0, 0, 1, 40, 680] },
    ];

    expect(pageText(items)).toBe(
      'Glukose 6,2 ▲ 3.5 - 5.5 mmol/L\nTSH basal 2,1 0.4 - 4.0 mIU/L'
    );
  });

  it('ignores non-text PDF items', () => {
    expect(pageText([{ transform: [1, 0, 0, 1, 0, 0] }, null, { str: '' }])).toBe('');
  });
});

