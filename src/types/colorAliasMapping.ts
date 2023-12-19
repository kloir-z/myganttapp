// colorAliasMapping.ts
export type ChartBarColor = 'lightblue' | 'blue' | 'purple' | 'pink' | 'red' | 'yellow' | 'green';

export type ColorAliasMapping = {
  [alias: string]: ChartBarColor;
};

export const colorAliasMapping: ColorAliasMapping = {
  user: 'blue',
  vendor: 'pink',
  team1: 'green',
  team2: 'red',
  // ... other mappings
};

export function convertAliasToChartBarColor(alias: string): ChartBarColor | undefined {
  return colorAliasMapping[alias];
}