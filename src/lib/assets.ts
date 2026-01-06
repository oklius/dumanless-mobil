const BASE_URL = 'https://dumanless.com';

export const ASSETS = {
  age01: `${BASE_URL}/illustrations/age-01.svg`,
  age02: `${BASE_URL}/illustrations/age-02.svg`,
  age03: `${BASE_URL}/illustrations/age-03.svg`,
  age04: `${BASE_URL}/illustrations/age-04.svg`,
  brain: `${BASE_URL}/illustrations/brain.svg`,
  alert: `${BASE_URL}/illustrations/alert.svg`,
  spark: `${BASE_URL}/illustrations/spark.svg`,
  healing: `${BASE_URL}/illustrations/healing.svg`,
  support: `${BASE_URL}/illustrations/support.svg`,
  trust: `${BASE_URL}/illustrations/trust.svg`,
  routine: `${BASE_URL}/illustrations/routine.svg`,
  trigger: `${BASE_URL}/illustrations/trigger.svg`,
  benefits: `${BASE_URL}/illustrations/benefits.svg`,
  package: `${BASE_URL}/illustrations/package.svg`,
  screen: `${BASE_URL}/illustrations/screen.svg`,
  calendar: `${BASE_URL}/illustrations/calendar.svg`,
};

export const AGE_IMAGES = [ASSETS.age01, ASSETS.age02, ASSETS.age03, ASSETS.age04];

export const STEP_IMAGES: Record<string, string> = {
  s5: ASSETS.brain,
  s11: ASSETS.alert,
  s18: ASSETS.spark,
  s24: ASSETS.healing,
  s25: ASSETS.healing,
  s28: ASSETS.support,
  s30: ASSETS.trust,
  s32: ASSETS.routine,
  s33: ASSETS.trigger,
  s34: ASSETS.benefits,
  s35: ASSETS.package,
  s36: ASSETS.screen,
  s37: ASSETS.calendar,
  s38: ASSETS.screen,
};
