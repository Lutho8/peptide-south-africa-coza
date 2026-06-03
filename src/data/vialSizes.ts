// Vial-size catalog sourced from the latest supplier price sheet.
// Applied to existing peptide entries at runtime so we don't have to mutate
// large data files.
export const VIAL_SIZES_MG: Record<string, number[]> = {
  retatrutide: [5, 10, 15, 20, 30, 50, 60],
  tirzepatide: [5, 10, 15, 20, 30, 40, 45, 60, 100],
  semaglutide: [2, 5, 10, 15, 20, 30],
  bpc157: [2, 5, 10, 20],
  tesamorelin: [2, 5, 10, 20],
  ipamorelin: [2, 5, 10],
  sermorelin: [2, 5, 10],
  selank: [5, 10, 30],
  epitalon: [10, 40, 50],
  dsip: [2, 5, 10, 15],
  oxytocin: [2, 5, 10],
  aod9604: [2, 5, 10],
  cagrilintide: [5, 10, 20],
  mazdutide: [5, 10],
  nad: [100, 500, 1000],
  ss31: [10, 50],
  tb500: [2, 5, 10, 20],
  motsc: [10, 40],
  ghkcu: [50, 100],
  hexarelin: [2, 5],
  ta1: [2, 5, 10],
  ghrp2: [5, 10],
  ghrp6: [5, 10],
  cjc1295: [2, 5, 10],
  cjc1295dac: [2, 5],
  semax: [5, 10, 30],
  kisspeptin: [5, 10],
  pt141: [10],
  melanotan2: [5, 10],
  melanotan1: [10],
  ll37: [5],
  humanin: [10],
  p21: [10],
  kpv: [10],
  vip: [5, 10],
  snap8: [10],
  cerebrolysin: [60],
  hcg: [2000, 5000, 10000],
  igf1lr3: [0.1, 1],
  '5amino1mq': [5, 10, 50],
};

export function getVialSizesFor(peptideId: string): number[] | undefined {
  return VIAL_SIZES_MG[peptideId];
}
