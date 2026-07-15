export function saltSuggestedText(config) {
  if (config.retain === "first") return `Enter the 0–${config.low}% pellet`;
  if (config.retain === "supernatant") return `Remain soluble above ${config.high}% saturation`;
  return `Enter the ${config.low}–${config.high}% pellet`;
}

export function predictionConfigSnapshot(method, config, text, source) {
  const dependent = method === "salt"
    ? { lowerSaturation: config.low, upperSaturation: config.high, retainedFraction: config.retain }
    : method === "iex"
      ? { exchanger: config.exchanger, pH: config.pH, gradientEnd: config.gradient, fractionSize: config.fraction }
      : method === "sec"
        ? { sampleLoad: config.load, fractionSize: config.fraction }
        : {};
  return { method, ...dependent, predictionText: text, textSource: source };
}

export function retainedSaltFractionIndex(retain) {
  return retain === "first" ? 0 : retain === "supernatant" ? 2 : 1;
}
