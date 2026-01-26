export type Reservoir = {
  name: string;
  fullDepth: number; // in feet
  currentLevel: number; // in feet
  todayInflow: number; // CU secs
  todayOutflow: number; // CU secs
};

export const reservoirs: Reservoir[] = [
  { name: "Mettur", fullDepth: 120, currentLevel: 119.6, todayInflow: 13862, todayOutflow: 15946 },
  { name: "Krishna Raja Sagar", fullDepth: 124.8, currentLevel: 124.4, todayInflow: 13739, todayOutflow: 11864 },
  { name: "Kabini", fullDepth: 65, currentLevel: 64.38, todayInflow: 3789, todayOutflow: 4567 },
  { name: "Harangi", fullDepth: 129, currentLevel: 128.71, todayInflow: 2446, todayOutflow: 2500 },
  { name: "Hemavathy", fullDepth: 117, currentLevel: 116.62, todayInflow: 5558, todayOutflow: 6900 },
  { name: "Bhavanisagar", fullDepth: 105, currentLevel: 100.67, todayInflow: 2145, todayOutflow: 3150 },
  { name: "Amaravathi", fullDepth: 90, currentLevel: 88.16, todayInflow: 626, todayOutflow: 592 },
  { name: "Periyar", fullDepth: 152, currentLevel: 133.8, todayInflow: 1021, todayOutflow: 1000 },
  { name: "Vaigai", fullDepth: 71, currentLevel: 68.83, todayInflow: 1114, todayOutflow: 669 },
  { name: "Papanasam", fullDepth: 143, currentLevel: 97.2, todayInflow: 283, todayOutflow: 1350 },
  { name: "Manimuthar", fullDepth: 118, currentLevel: 92.38, todayInflow: 79, todayOutflow: 145 },
  { name: "Pechiparai", fullDepth: 48, currentLevel: 39.82, todayInflow: 403, todayOutflow: 762 },
  { name: "Perunchani", fullDepth: 77, currentLevel: 59.3, todayInflow: 120, todayOutflow: 385 },
  { name: "Krishnagiri", fullDepth: 52, currentLevel: 50.15, todayInflow: 1697, todayOutflow: 2195 },
  { name: "Sathanur", fullDepth: 119, currentLevel: 113.45, todayInflow: 357, todayOutflow: 0 },
  { name: "Sholayar", fullDepth: 160, currentLevel: 160.23, todayInflow: 669, todayOutflow: 481 },
  { name: "Parambikulam", fullDepth: 72, currentLevel: 71.77, todayInflow: 1123, todayOutflow: 980 },
  { name: "Aliyar", fullDepth: 120, currentLevel: 119.3, todayInflow: 311, todayOutflow: 305 },
  { name: "Thirumurthy", fullDepth: 60, currentLevel: 51.89, todayInflow: 929, todayOutflow: 1109 }
];
