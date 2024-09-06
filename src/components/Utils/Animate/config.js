const common = ['initial', 'inherit'];
const config = {
  fillMode: ['none', 'forwards', 'backwards', 'both', ...common],
  playState: ['paused', 'running', ...common],
  direction: ['normal', 'reverse', 'alternate', 'alternate-reverse	', ...common],
  count: ['infinite', ...common]
};

export default config;
