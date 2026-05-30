type ProgressBarConfig = {
  barColors: Record<string, string>;
  shadowBlur: number;
};

const progressBarConfig = (): ProgressBarConfig => ({
  barColors: {
    0: '#2563eb',
  },
  shadowBlur: 5,
});

export default progressBarConfig;
