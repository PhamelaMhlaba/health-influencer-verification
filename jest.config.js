export default {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "@swc/jest",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx", ".js", ".jsx"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};