// Function to calculate the date factor for infectionsByRequestedTime
const factorCalculator = (timeToElapse, periodType) => {
  switch (periodType) {
    case 'days':
      return Math.floor(timeToElapse / 3);
    case 'weeks':
      return Math.floor((timeToElapse * 7) / 3);
    case 'months':
      return Math.floor((timeToElapse * 30) / 3);
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
  const { periodType, totalHospitalBeds, timeToElapse } = data;
  const infectionsByRequestedTime = currentlyInfected
    * powerCalc(2, factorCalculator(timeToElapse, periodType));
  const severeCasesByRequestedTime = 0.15 * infectionsByRequestedTime;
  const availableBeds = 0.35 * totalHospitalBeds;
  const hospitalBedsByRequestedTime = parseInt((availableBeds - severeCasesByRequestedTime)
    .toFixed(0), 10);
  const casesForICUByRequestedTime = parseInt((0.05 * infectionsByRequestedTime)
    .toFixed(0), 10);
  const casesForVentilatorsByRequestedTime = parseInt((0.02 * infectionsByRequestedTime)
    .toFixed(0), 10);
  const dollarsInFlight = parseInt((infectionsByRequestedTime * data.region.avgDailyIncomeInUSD
    * data.region.avgDailyIncomePopulation * timeToElapse), 10);
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
