import type { Digit } from '@/types/number';

export const DigitText:Record<string,string> = {
  0: 'Zero',
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
} satisfies Record<Digit, string>;

export const DigitTextID:Record<string,string> = {
  Zero: 'Kosong',
  One: 'Satu',
  Two: 'Dua',
  Three: 'Tiga',
  Four: 'Empat',
  Five: 'Lima',
  Six: 'Enam',
  Seven: 'Tujuh',
  Eight: 'Delapan',
  Nine: 'Sembilan',
  '-': '-',
};
