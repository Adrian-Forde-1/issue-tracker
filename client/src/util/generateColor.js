const colorArray = [
  '#A020F0',
  '#CB410B',
  '#FFAA1D',
  '#891446',
  '#0989AC',
  '#a72608',
  '#3e1929',
  '#a71d31',
  '#619b8a',
  '#7fd8be',
  '#083d77',
  '#2d1e2f',
  '#e83f6f',
  '#2274a5',
  '#32936f',
];

export const generateColor = () => {
  var color = undefined;
  color = colorArray[Math.floor(Math.random() * colorArray.length - 1)];
  if (color === undefined) color = colorArray[2];
  return color;
};
