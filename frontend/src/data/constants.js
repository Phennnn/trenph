export const lineColors = {
  "LRT-1": "#FFC107", // Yellow
  "LRT-2": "#00A651", // Green
  "MRT-3": "#0072BC", // Blue
  "PNR": "#8A2BE2",   // Violet
};

export const interchanges = {
  "LRT-1": {
    "Doroteo Jose": { line: "LRT-2", station: "Recto" },
    "Blumentritt": { line: "PNR", station: "Blumentritt" },
    "EDSA": { line: "MRT-3", station: "Taft Avenue" },
  },
  "LRT-2": {
    "Recto": { line: "LRT-1", station: "Doroteo Jose" },
    "Cubao": { line: "MRT-3", station: "Cubao" },
  },
  "MRT-3": {
    "Taft Avenue": { line: "LRT-1", station: "EDSA" },
    "Cubao": { line: "LRT-2", station: "Cubao" },
  },
  "PNR": {
    "Blumentritt": { line: "LRT-1", station: "Blumentritt" },
  },
};

// Fare matrix based on the number of stations traveled.
// [Regular Fare, Discounted Fare]
export const fareMatrix = {
  1: [13, 10], 2: [13, 10], 3: [15, 12], 4: [15, 12], 5: [18, 14],
  6: [18, 14], 7: [20, 16], 8: [20, 16], 9: [20, 16], 10: [30, 24],
  11: [30, 24], 12: [30, 24], 13: [30, 24], 14: [30, 24], 15: [30, 24],
  16: [30, 24], 17: [30, 24], 18: [30, 24], 19: [30, 24],
};

// Operating hours for each train line.
export const operatingHours = {
  "LRT-1": "4:30 AM - 10:15 PM",
  "LRT-2": "5:00 AM - 9:30 PM",
  "MRT-3": "4:40 AM - 10:10 PM",
  "PNR": "5:30 AM - 7:30 PM",
};

// List of stations with PWD (Persons with Disabilities) friendly facilities.
export const pwdFriendlyStations = {
  "LRT-1": ["Fernando Poe Jr.", "EDSA", "Monumento"],
  "LRT-2": ["Recto", "Cubao"],
  "MRT-3": ["North Avenue", "Taft Avenue"],
  "PNR": ["Tutuban"],
};
