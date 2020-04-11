// Function to calculate the date factor for infectionsByRequestedTime
const factorCalculator = (period, periodType) => {
  switch (periodType) {
    case 'days':
      // return parseInt((period / 3).toString(), 10);
      return Math.floor(period / 3);
    case 'weeks':
      // return parseInt(((period * 7) / 3).toString(), 10);
      return Math.floor((period * 7) / 3);
    case 'months':
      // return parseInt(((period * 30) / 3).toString(), 10);
      return Math.floor((period * 30) / 3);
    default:
      return 0;
  }
};


// eslint-disable-next-line no-restricted-properties
const powerCalc = (x, y) => Math.pow(x, y);

// Impact Estimator function
const impactEstimator = (data, severe) => {
  const currentlyInfected = severe ? data.reportedCases * 50
    : data.reportedCases * 10;
  const { periodType } = data;
  const period = data.timeToElapse;
  const infectionsByRequestedTime = currentlyInfected
    * powerCalc(2, factorCalculator(period, periodType));
  const severeCasesByRequestedTime = 0.15 * infectionsByRequestedTime;
  const availableBeds = 0.35 * data.totalHospitalBeds;
  const hospitalBedsByRequestedTime = parseInt((availableBeds - severeCasesByRequestedTime)
    .toFixed(0), 10);
  const casesForICUByRequestedTime = parseInt((0.05 * infectionsByRequestedTime)
    .toFixed(0), 10);
  const casesForVentilatorsByRequestedTime = parseInt((0.02 * infectionsByRequestedTime)
    .toFixed(0), 10);
  const dollarsInFlight = parseFloat((infectionsByRequestedTime * data.region.avgDailyIncomeInUSD
    * data.region.avgDailyIncomePopulation * data.timeToElapse)
    .toFixed(2));
  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};

const covid19ImpactEstimator = (data) => {
  const impact = impactEstimator(data, false);
  const severeImpact = impactEstimator(data, true);
  return {
    data,
    impact,
    severeImpact
  };
};

module.exports = covid19ImpactEstimator;
