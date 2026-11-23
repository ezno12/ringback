export const FEE = 99;
export const WEEKS_PER_MONTH = 4.33;

/** Landing-page calculator: jobs won back per month = calls per week × 4.33 × share won back. */
export function estimate(callsPerWeek: number, jobValue: number, sharePct: number) {
  const jobs = callsPerWeek * WEEKS_PER_MONTH * (sharePct / 100);
  const revenue = jobs * jobValue;
  return { jobs, revenue, net: revenue - FEE };
}
