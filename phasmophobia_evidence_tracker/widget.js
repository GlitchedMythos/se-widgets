const version = "4.1.0 (Progression)";

// Order is important here:
// EMF-5 | Freezing | Spirit Box | Writing | Orbs | Fingerprints | DOTS
// 1 is true
// 0 is false

const BANSHEE =     "0000111",
      DEMON =       "0101010",
      DEOGEN =      "0011001",
      GORYO =       "1000011",
      HANTU =       "0100110",
      JINN =        "1100010",
      MARE =        "0011100",
      MIMIC =       "0110010",
      MOROII =      "0111000",
      MYLING =      "1001010",
      OBAKE =       "1000110",
      ONI =         "1100001",
      ONRYO =       "0110100",
      PHANTOM =     "0010011",
      POLTERGEIST = "0011010",
      RAIJU =       "1000101",
      REVENANT =    "0101100",
      SHADE =       "1101000",
      SPIRIT =      "1011000",
      TWINS =       "1110000",
      WRAITH =      "1010001",
      YOKAI =       "0010101",
      YUREI =       "0100101";

const EVIDENCE = {
  emf: "emf",
  freez: "freezing",
  temp: "freezing",
  box: "spiritBox",
  spirit: "spiritBox",
  book: "writing",
  writ: "Writing",
  orbs: "Orbs",
  fing: "fingerprints",
  hand: "fingerprints",
  dots: "dots",
}

const POSSESSIONS = {}

//object used to store sighting keys
const SIGHTINGS = {}

const OPTIONAL_OBJECTIVES = {
  ca: "Candle",
  can: "Candle",
  candle: "Candle",
  cr: "Crucifix",
  crucifix: "Crucifix",
  em: "EMF",
  emf: "EMF",
  es: "Escape",
  escape: "Escape",
  ev: "Event",
  event: "Event",
  hu: "Smudge(Hunt)",
  hunt: "Smudge(Hunt)",
  mo: "Motion",
  motion: "Motion",
  ph: "Photo",
  photo: "Photo",
  re: "Repel",
  repel: "Repel",
  sa: "Salt",
  salt: "Salt",
  san: "<25% Sanity",
  sanity: "<25% Sanity",
  sm: "Smudge",
  smudge: "Smudge",
};

const LOCATIONS = {
  ta: "Tanglewood",
  tangle: "Tanglewood",
  tanglewood: "Tanglewood",
  wi: "Willow",
  will: "Willow",
  willow: "Willow",
  ed: "Edgefield",
  edge: "Edgefield",
  edgefield: "Edgefield",
  ri: "Ridgeview",
  ridge: "Ridgeview",
  ridgeview: "Ridgeview",
  gr: "Grafton",
  grafton: "Grafton",
  bl: "Bleasdale",
  bleasdale: "Bleasdale",
  hi: "High School",
  hs: "High School",
  high: "High School",
  school: "High School",
  brown: "High School",
  brownstone: "High School",
  pr: "Prison",
  prison: "Prison",
  as: "Sunny Valley",
  asylum: "Sunny Valley",
  su: "Sunny Valley",
  sunny: "Sunny Valley",
  ma: "Maple Lodge",
  maple: "Maple Lodge",
  camp: "Maple Lodge",
  campsite: "Maple Lodge",
};

const DIFFICULTY = {
  a: "Amateur",
  am: "Amateur",
  amateur: "Amateur",
  i: "Intermediate",
  int: "Intermediate",
  intermediate: "Intermediate",
  p: "Professional",
  pro: "Professional",
  professional: "Professional",
  n: "Nightmare",
  ni: "Nightmare",
  night: "Nightmare",
  nightmare: "Nightmare",
};

// Constants for displaying evidence on the widget
const EVIDENCE_OFF = 0,
      EVIDENCE_ON = 1,
      EVIDENCE_IMPOSSIBLE = 2,
      EVIDENCE_COMPLETE_IMPOSSIBLE = 3,
      EVIDENCE_NEGATIVE = 4;

const EVIDENCE_NAMES_IN_DOM = [
  "emf",
  "spiritBox",
  "fingerprints",
  "orbs",
  "writing",
  "freezing",
  "dots"
];

const COUNTER_1 = 1,
      COUNTER_2 = 2;

// Permission levels for commands
const PERMISSION_GLITCHED = 0,
      PERMISSION_BROADCASTER = 1,
      PERMISSION_MOD = 2,
      PERMISSION_VIP = 3;

// TODO: Move all widget and user state to here
let userState = {
  channelName: "",
  conclusionString: "",
  counter: 0,
  counter2: 0,
  cursedPossessions: {
    none: true,
    doll: false,
    mirror: false,
    music: false,
    ouija: false,
    summoning: false,
    tarot: false,
  },
  evidence: {
    emf: EVIDENCE_OFF,
    spiritBox: EVIDENCE_OFF,
    fingerprints: EVIDENCE_OFF,
    orbs: EVIDENCE_OFF,
    writing: EVIDENCE_OFF,
    freezing: EVIDENCE_OFF,
    dots: EVIDENCE_OFF
  },
  evidenceDisplay: {
    emf: EVIDENCE_OFF,
    spiritBox: EVIDENCE_OFF,
    fingerprints: EVIDENCE_OFF,
    orbs: EVIDENCE_OFF,
    writing: EVIDENCE_OFF,
    freezing: EVIDENCE_OFF,
    dots: EVIDENCE_OFF
  },
  ghostName: "",
  location: {
    locationName: "",
    locationDiff: "",
  },
  optionalObjectives: [
    // Object Format:
    // {
    //   text: objective,
    //   strike: true/false
    // }
  ],
  sightings: {
    bone: false,
    slenderman: false,
    water: false,
  },
};

let config = {};

const runCommandWithPermission = (permission, data, command, commandArgs) => {
  if (hasPermission(permission, getUserLevelFromData(data))) {
    command(...commandArgs);
  }
  updateDashboardDOM(userState);
};

const getUserLevelFromData = (data) => {
  let level = 999;
  let badges = data.badges;
  let badgeLevel = 999;

  for (let i = 0; i < badges.length; i++) {
    if (data.displayName.toLowerCase() === "glitchedmythos") {
      badgeLevel = PERMISSION_GLITCHED;
    } else if (badges[i].type === "broadcaster") {
      badgeLevel = PERMISSION_BROADCASTER;
    } else if (badges[i].type === "moderator") {
      badgeLevel = PERMISSION_MOD;
    } else if (badges[i].type === "vip") {
      badgeLevel = PERMISSION_VIP;
    }
  }

  level = badgeLevel < level ? badgeLevel : level;

  return level;
};

// If user level is equal to or less than permission level, then they have permission
const hasPermission = (permission, userLevel) => {
  return userLevel <= permission;
};

// For commands where VIP's are allowed to help
const modOrVIPPermission = (configuration) => {
  return configuration.allowVIPS ? PERMISSION_VIP : PERMISSION_MOD;
};

window.addEventListener("onWidgetLoad", function (obj) {
  // Field data from Stream Elements from the overlay settings the user set
  userState.channelName = obj["detail"]["channel"]["username"];
  const fieldData = obj.detail.fieldData;
  // setting up the POSSESSIONS
  {
    ['none', 'doll', 'mirror', 'music', 'summoning', 'tarot', 'ouija'].forEach(v => {
      let keys = fieldData[v + "PossessionCommand"]
      keys.split(',').forEach(key => {
        POSSESSIONS[key.trim()] = v
      })
    })
  }
  // setting up the SIGHTINGS

  {
    ['boner', 'slenderman', 'water'].forEach(v => {
      let keys = fieldData[v + "SightingCommand"]
      keys.split(',').forEach(key => {
        SIGHTINGS[key.trim()] = v
      })
    })
  }

  // Sets up all the commands for the widget
  config.commands = {
    [fieldData["resetCommand"]]: (data) => {
      runCommandWithPermission(modOrVIPPermission(config), data, _resetGhost, [
        data.text,
        userState,
      ]);
    },
    [fieldData["nameCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setGhostName,
        [data.text, userState]
      );
    },
    [fieldData["firstnameCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setGhostFirstName,
        [data.text, userState]
      );
    },
    [fieldData["surnameCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setGhostSurName,
        [data.text, userState]
      );
    },
    [fieldData["locationNameCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setLocationName,
        [data.text, userState]
      );
    },
    [fieldData["locationDiffCommand"]]: (data) => {
      runCommandWithPermission(modOrVIPPermission(config), data, _setDiffName, [
        data.text,
        userState,
      ]);
    },
    [fieldData["possessionCommand"]]: (data) => {
      runCommandWithPermission(modOrVIPPermission(config), data, _togglePossession,
      [data.text, userState]);
    },
    [fieldData["sightingCommand"]]: (data) => {
      runCommandWithPermission(modOrVIPPermission(config), data, _toggleSighting,
        [data.text, userState]);
    },
    [fieldData["emfCommand"]]: (data) => {
      runCommandWithPermission(modOrVIPPermission(config), data, _toggleEMF, [
        data.text,
        userState,
        config,
      ]);
    },
    [fieldData["spiritBoxCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleSpiritBox,
        [data.text, userState, config]
      );
    },
    [fieldData["fingerprintsCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleFingerprints,
        [data.text, userState, config]
      );
    },
    [fieldData["orbsCommand"]]: (data) => {
      runCommandWithPermission(modOrVIPPermission(config), data, _toggleOrbs, [
        data.text,
        userState,
        config,
      ]);
    },
    [fieldData["writingCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleWriting,
        [data.text, userState, config]
      );
    },
    [fieldData["freezingCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleFreezing,
        [data.text, userState, config]
      );
    },
    [fieldData["dotsCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleDots,
        [data.text, userState, config]
      );
    },
    [`${fieldData["emfCommand"]}x`]: (data) => {
      runCommandWithPermission(modOrVIPPermission(config), data, _setEMFNegative, [
        userState,
        config,
      ]);
    },
    [`${fieldData["spiritBoxCommand"]}x`]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setSpiritBoxNegative,
        [userState, config]
      );
    },
    [`${fieldData["fingerprintsCommand"]}x`]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setFingerprintsNegative,
        [userState, config]
      );
    },
    [`${fieldData["orbsCommand"]}x`]: (data) => {
      runCommandWithPermission(modOrVIPPermission(config), data, _setOrbsNegative, [
        userState,
        config,
      ]);
    },
    [`${fieldData["writingCommand"]}x`]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setWritingNegative,
        [userState, config]
      );
    },
    [`${fieldData["freezingCommand"]}x`]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setFreezingNegative,
        [userState, config]
      );
    },
    [`${fieldData["dotsCommand"]}x`]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setDotsNegative,
        [userState, config]
      );
    },
    [fieldData["optionalObjectivesCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setOptionalObjectives,
        [data.text, userState]
      );
    },
    [fieldData["toggleOptObjOneCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleOptionalObjective,
        [0, userState] // The position in array
      );
    },
    [fieldData["toggleOptObjTwoCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleOptionalObjective,
        [1, userState] // The position in array
      );
    },
    [fieldData["toggleOptObjThreeCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleOptionalObjective,
        [2, userState] // The position in array
      );
    },
    [fieldData["vipToggleOnCommand"]]: (data) => {
      runCommandWithPermission(PERMISSION_MOD, data, _toggleVIPAccessibility, [
        true,
      ]);
    },
    [fieldData["vipToggleOffCommand"]]: (data) => {
      runCommandWithPermission(PERMISSION_MOD, data, _toggleVIPAccessibility, [
        false,
      ]);
    },
    [fieldData["setCounterNameCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setCounterName,
        [COUNTER_1, data.text]
      );
    },
    [fieldData["setCounterNumberCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setCounterNumber,
        [COUNTER_1, data.text]
      );
    },
    [fieldData["incrementCounterCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _incrementCounter,
        [COUNTER_1]
      );
    },
    [fieldData["decrementCounterCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _decrementCounter,
        [COUNTER_1]
      );
    },
    [fieldData["setCounter2NameCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setCounterName,
        [COUNTER_2, data.text]
      );
    },
    [fieldData["setCounter2NumberCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setCounterNumber,
        [COUNTER_2, data.text]
      );
    },
    [fieldData["incrementCounter2Command"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _incrementCounter,
        [COUNTER_2]
      );
    },
    [fieldData["decrementCounter2Command"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _decrementCounter,
        [COUNTER_2]
      );
    },
    "!glitchedmythos": (data) => {
      runCommandWithPermission(PERMISSION_GLITCHED, data, _glitchedMythos, [
        data.text,
      ]);
    },
  };

  // Configuration based on user choices
  config.allowVIPS = fieldData["allowVIPS"] === "yes" ? true : false;
  config.conclusionStrings = {
    zeroEvidenceConclusionString: fieldData["zeroEvidenceConclusionString"]
      ? fieldData["zeroEvidenceConclusionString"]
      : "Waiting for Evidence",
    oneEvidenceConclusionString: fieldData["oneEvidenceConclusionString"]
      ? fieldData["oneEvidenceConclusionString"]
      : "Not sure yet...",
    tooMuchEvidence: fieldData["impossibleConclusionString"]
      ? fieldData["impossibleConclusionString"]
      : "Too Much Evidence",
  };

  config.ghosts = [
    {
      type: "Banshee",
      conclusion: createGhostConclusionString(
        fieldData["bansheeString"],
        "Banshee"
      ),
      evidence: BANSHEE,
    },
    {
      type: "Demon",
      conclusion: createGhostConclusionString(
        fieldData["demonString"],
        "Demon"
      ),
      evidence: DEMON,
    },
    {
      type: "Deogen",
      conclusion: createGhostConclusionString(
        fieldData["deogenString"],
        "Deogen"
      ),
      evidence: DEOGEN,
    },
    {
      type: "Goryo",
      conclusion: createGhostConclusionString(
        fieldData["goryoString"],
        "Goryo"
      ),
      evidence: GORYO,
    },
    {
      type: "Hantu",
      conclusion: createGhostConclusionString(
        fieldData["hantuString"],
        "Hantu"
      ),
      evidence: HANTU,
    },
    {
      type: "Jinn",
      conclusion: createGhostConclusionString(fieldData["jinnString"], "Jinn"),
      evidence: JINN,
    },
    {
      type: "Mare",
      conclusion: createGhostConclusionString(fieldData["mareString"], "Mare"),
      evidence: MARE,
    },
    {
      type: "The Mimic",
      conclusion: createGhostConclusionString(fieldData["mimicString"], "The Mimic"),
      evidence: MIMIC,
    },
    {
      type: "Moroii",
      conclusion: createGhostConclusionString(fieldData["moroiiString"], "Moroii"),
      evidence: MOROII,
    },
    {
      type: "Myling",
      conclusion: createGhostConclusionString(fieldData["mylingString"], "Myling"),
      evidence: MYLING,
    },
    {
      type: "Obake",
      conclusion: createGhostConclusionString(fieldData["obakeString"], "Obake"),
      evidence: OBAKE,
    },
    {
      type: "Oni",
      conclusion: createGhostConclusionString(fieldData["oniString"], "Oni"),
      evidence: ONI,
    },
    {
      type: "Onryo",
      conclusion: createGhostConclusionString(
        fieldData["onryoString"],
        "Onryo"
      ),
      evidence: ONRYO,
    },
    {
      type: "Phantom",
      conclusion: createGhostConclusionString(
        fieldData["phantomString"],
        "Phantom"
      ),
      evidence: PHANTOM,
    },
    {
      type: "Poltergeist",
      conclusion: createGhostConclusionString(
        fieldData["poltergeistString"],
        "Poltergeist"
      ),
      evidence: POLTERGEIST,
    },
    {
      type: "Raiju",
      conclusion: createGhostConclusionString(fieldData["raijuString"], "Raiju"),
      evidence: RAIJU,
    },
    {
      type: "Revenant",
      conclusion: createGhostConclusionString(
        fieldData["revenantString"],
        "Revenant"
      ),
      evidence: REVENANT,
    },
    {
      type: "Shade",
      conclusion: createGhostConclusionString(
        fieldData["shadeString"],
        "Shade"
      ),
      evidence: SHADE,
    },
    {
      type: "Spirit",
      conclusion: createGhostConclusionString(
        fieldData["spiritString"],
        "Spirit"
      ),
      evidence: SPIRIT,
    },
    {
      type: "The Twins",
      conclusion: createGhostConclusionString(
        fieldData["twinsString"],
        "The Twins"
      ),
      evidence: TWINS,
    },
    {
      type: "Wraith",
      conclusion: createGhostConclusionString(
        fieldData["wraithString"],
        "Wraith"
      ),
      evidence: WRAITH,
    },
    {
      type: "Yokai",
      conclusion: createGhostConclusionString(
        fieldData["yokaiString"],
        "Yokai"
      ),
      evidence: YOKAI,
    },
    {
      type: "Yurei",
      conclusion: createGhostConclusionString(
        fieldData["yureiString"],
        "Yurei"
      ),
      evidence: YUREI,
    },
  ];
  config.nameStrings = {
    noNameString: fieldData["noNameString"]
      ? fieldData["noNameString"]
      : "A New Ghostie",
    ghostNameString: fieldData["ghostNameString"]
      ? fieldData["ghostNameString"]
      : "Name: [name]",
    autoCapitalize: fieldData["autoCapitalize"] === "yes" ? true : false,
  };
  config.locationNameStrings = {
    noLocationString: fieldData["noLocationString"]
      ? fieldData["noLocationString"]
      : "No Map Selected...",
  };
  config.optionalObj = {
    noOptionalString: fieldData["noOptionalObjectivesMessage"]
      ? fieldData["noOptionalObjectivesMessage"]
      : "Widget Author: GlitchedMythos",
    spacing: fieldData["objectivesSpacing"],
  };
  config.markImpossibleEvidence =
    fieldData["markImpossibleEvidence"] === "yes" ? true : false;
  config.useEvidenceImpossibleCompleted =
    fieldData["useEvidenceImpossibleCompleted"] === "yes" ? true : false;

  // TODO: Refactor to set up in config
  let displayName = fieldData["displayName"] === "yes" ? true : false;
  let displayLocation = fieldData["displayLocation"] === "yes" ? true : false;
  let displayEvidence = fieldData["displayEvidence"] === "yes" ? true : false;
  let displayCounter = fieldData["displayCounter"] === "yes" ? true : false;
  let displayCounterTwo = fieldData["displayCounter2"] === "yes" ? true : false;
  let displayCursedPossessions = fieldData["displayCursedPossessions"] === "yes" ? true : false;
  let displaySightings = fieldData["displaySightings"] === "yes" ? true : false;
  let displayOptionalObjectives =
    fieldData["displayOptionalObjectives"] === "yes" ? true : false;
  let displayConclusion =
    fieldData["displayConclusion"] === "yes" ? true : false;

  if (!displayName) {
    $(`#name`).remove();
  }

  if (!displayLocation && !displaySightings && !displayCursedPossessions) {
    $(`#location-container`).remove();
  } else {
    if (!displayLocation) {
      $(`#location-name`).remove();
      $(`#location-difficulty`).remove();
    }
    if (!displaySightings) {
      $(`#location-sightings`).remove();
    }
    if (!displayCursedPossessions) {
      $(`#possession-container`).remove();
    }
  }

  if (!displayEvidence && !displayCounter) {
    $(`#evidence-container`).remove();
    $(`#counter-container`).remove();
  } else {
    if (!displayEvidence) {
      $(`#evidence-container`).remove();
    }

    if (!displayCounter) {
      $(`#counter-container`).remove();
    }

    if (!displayCounterTwo) {
      $(`#counter-two`).remove();
    } else {
      $(`#counter2-name`).html($(`#counter2-name`).text());
      let countersSpacing = fieldData["countersSpacing"];
      let hasCloseSpacing = countersSpacing === "justify-start"
      || countersSpacing === "justify-end"
      || countersSpacing === "justify-center";

      if(hasCloseSpacing && fieldData["counterFlexDirection"] === "flex-row") {
        $(`#counter-one`).addClass("mr-0.5");
        $(`#counter-two`).addClass("ml-0.5");
      }
    }
  }

  if (!displayOptionalObjectives) {
    $(`#optional-obj`).remove();
  }

  if (!displayConclusion) {
    $(`#conclusion-container`).remove();
  }

  let useGradientBorder =
    fieldData["useGradientBorder"] === "yes" ? true : false;
  let useAnimatedBorder =
    fieldData["useAnimatedBorder"] === "yes" ? true : false;

  if (useGradientBorder) {
    $("#phas-dashboard").addClass("animated-box");

    if (useAnimatedBorder) {
      $("#phas-dashboard").addClass("in");
      $("#phas-dashboard").addClass("animated-box-300");
    } else {
      $("#phas-dashboard").addClass("animated-box-100");
    }
  } else {
    $("#phas-dashboard").addClass("phas-border");
  }

  userState.conclusionString =
    config.conclusionStrings.zeroEvidenceConclusionString;

  resetGhost(null, userState);
  updateDashboardDOM(userState);
});

window.addEventListener("onEventReceived", function (obj) {
  // Grab relevant data from the event;
  let data = obj.detail.event.data;

  // Check if a matching command
  let givenCommand = data.text.split(" ")[0];

  if (config.commands[givenCommand.toLowerCase()]) {
    config.commands[givenCommand.toLowerCase()](data);
  } else {
    console.log("No command exists");
  }
});

/*******************************************************
 *                  COMMAND FUNCTIONS                  *
 *******************************************************/

const _resetGhost = (command, state) => {
  let commandArgument = command.split(" ").slice(1).join(" ");
  if (commandArgument.length > 0) {
    resetGhost(commandArgument, state);
  } else {
    resetGhost(null, state);
  }
};

const _setGhostName = (command, state) => {
  enteredName = command.split(" ").slice(1).join(" ");
  state.ghostName = config.nameStrings.autoCapitalize
    ? camelCase(enteredName)
    : enteredName;
};

const _setGhostFirstName = (command, state) => {
  enteredName = command.split(" ").slice(1).join(" ");
  currentName = state.ghostName ? state.ghostName.split(" ") : "";
  newName = currentName[1]
    ? enteredName + " " + currentName.slice(1).join(" ")
    : enteredName;
  state.ghostName = config.nameStrings.autoCapitalize
    ? camelCase(newName)
    : newName;
};

const _setGhostSurName = (command, state) => {
  enteredName = command.split(" ").slice(1).join(" ");
  currentName = state.ghostName ? state.ghostName.split(" ") : "";
  if (currentName[1]) {
    newName = currentName.slice(0, -1).join(" ") + " " + enteredName;
  } else if (currentName[0]) {
    newName = currentName[0] + " " + enteredName;
  } else {
    newName = enteredName;
  }
  state.ghostName = config.nameStrings.autoCapitalize
    ? camelCase(newName)
    : newName;
};

const _setLocationName = (command, state) => {
  commandArgument = command.split(" ").slice(1).join(" ");
  state.location.locationName = getLocationNameString(commandArgument);
};

const _setDiffName = (command, state) => {
  commandArgument = command.split(" ");
  commandArgument = commandArgument[1]
    ? commandArgument[1]
    : commandArgument[0];
  state.location.locationDiff = getDifficultyString(commandArgument);
};

const _toggleSighting = (sighting, state) => {
  sightingArray = sighting.split(" ");
  sightingArray.shift();
  for (const [key,value] of Object.entries(sightingArray)) {
    const s = getValueFromArray(SIGHTINGS, value);
    if (s === "slenderman") {
      state.sightings[s] = (state.location.locationName === "Maple Lodge") ? !state.sightings[s] : false;
    } else { state.sightings[s] = !state.sightings[s] }
  }
}

const _togglePossession = (possession, state) => {
  possession = possession.slice(possession.indexOf(" ") + 1)
  const thisPossession = getValueFromArray(POSSESSIONS, possession);
  for (const [key] of Object.entries(state.cursedPossessions)) {
    state.cursedPossessions[key] = (key === thisPossession) ? !state.cursedPossessions[key] : false;
  }
  state.cursedPossessions['none'] = (arrayIsFalse(state.cursedPossessions)) ? true : false;
}

const _toggleEvidence = (evidence, state, config) => {
  evidenceArray = evidence.split(" ").shift();
  for (const [key] of Object.entries(evidenceArray)) {
    toggleEvidence(command, state, config, key)
  }
};

const _setEvidenceNegative = (evidence, state, config) => {
  evidenceArray = evidence.split(" ")
  for (const [e] of Object.entries(evidenceArray)) {
    setEvidenceNegative(e, state, config)
  }
};

const _toggleEMF = (command, state, config) => {
  toggleEvidence(command, state, config, 'emf')
};

const _toggleSpiritBox = (command, state, config) => {
  toggleEvidence(command, state, config, 'spiritBox')
};

const _toggleFingerprints = (command, state, config) => {
  toggleEvidence(command, state, config, 'fingerprints')
};

const _toggleOrbs = (command, state, config) => {
  toggleEvidence(command, state, config, 'orbs')
};

const _toggleWriting = (command, state, config) => {
  toggleEvidence(command, state, config, 'writing')
};

const _toggleFreezing = (command, state, config) => {
  toggleEvidence(command, state, config, 'freezing')
};

const _toggleDots = (command, state, config) => {
  toggleEvidence(command, state, config, 'dots')
};

const _setEMFNegative = (state, config) => {
  setEvidenceNegative("emf", state, config)
};

const _setSpiritBoxNegative = (state, config) => {
  setEvidenceNegative("spiritBox", state, config)
};

const _setFingerprintsNegative = (state, config) => {
  setEvidenceNegative("fingerprints", state, config)
};

const _setOrbsNegative = (state, config) => {
  setEvidenceNegative("orbs", state, config)
};

const _setWritingNegative = (state, config) => {
  setEvidenceNegative("writing", state, config)
};

const _setFreezingNegative = (state, config) => {
  setEvidenceNegative("freezing", state, config)
};

const _setDotsNegative = (state, config) => {
  setEvidenceNegative("dots", state, config)
};

const _setOptionalObjectives = (command, state) => {
  let commandSplit = command.split(" ");
  let optObjCommands = commandSplit.slice(1);
  optObjCommands = optObjCommands.slice(Math.max(optObjCommands.length - 3, 0)); // Grabs only the last 3 commands

  if (optObjCommands.length === 1) {
    state.optionalObjectives = updateSingleOptionalObjective(
      state.optionalObjectives,
      optObjCommands[0]
    );
  } else {
    state.optionalObjectives = updateFullOptionalObjectives(...optObjCommands);
  }
};

const _toggleOptionalObjective = (objectiveNumber, state) => {
  toggleStrikethrough(objectiveNumber, state);
};

const _toggleVIPAccessibility = (canUseVIP) => {
  toggleVIPAccessibility(canUseVIP);
};

const _setCounterName = (num, command) => {
  commandArgument = command.split(" ").slice(1).join(" ");
  setCounterName(num, commandArgument);
};

const _setCounterNumber = (num, command) => {
  commandArgument = command.split(" ").slice(1).join(" ");
  setCounterNumber(num, commandArgument);
};

const _incrementCounter = (num) => {
  incrementCounter(num);
};

const _decrementCounter = (num) => {
  decrementCounter(num);
};

const _glitchedMythos = (command) => {
  commandArgument = command.split(" ").slice(1).join(" ");

  if (commandArgument) {
    writeOutVersion(commandArgument);
  } else {
    writeOutVersion(
      `Hello GlitchedMythos. Thank you for creating me. I am version ${version} of your widget. I think everyone should check you out at twitch.tv/glitchedmythos. Also ${userState.channelName} is absolutely AMAZING!`
    );
  }
};

/*******************************************************
 *                  LOGIC FUNCTIONS                    *
 *******************************************************/
// * This is abstracted out for simplicity.
const setEvidenceNegative = (evidence, state, config) => {
  state.evidence[evidence] = (state.evidence[evidence] === EVIDENCE_NEGATIVE) ? EVIDENCE_OFF : EVIDENCE_NEGATIVE;
  calculateGhostEvidenceDisplay(state, config);
  determineConclusionMessage(state);
}

const toggleEvidence = (command, state, config, evidenceType) => {
  const arg = command.split(" ")[1];
  if (arg) {
    state.evidence[evidenceType] = setEvidence(arg);
  } else {
    state.evidence[evidenceType] = toggleEvidenceIterator(state.evidence[evidenceType]);
  }
  calculateGhostEvidenceDisplay(state, config);
  determineConclusionMessage(state);
}

const resetGhost = (newName, state) => {
  resetName(newName, state);
  resetLocationName(state);
  // resetEvidence is called twice here as it is resetting state in two places.
  resetEvidence(state.evidence);
  resetEvidence(state.evidenceDisplay);
  resetOptionalObjectives([], state);
  resetSightings(state);
  resetPossessions(state);
  resetConclusion(state);
};

const resetName = (newName, state) => {
  if (newName) {
    state.ghostName = config.nameStrings.autoCapitalize
      ? camelCase(newName)
      : newName;
  } else {
    state.ghostName = "";
  }
};

const resetLocationName = (state) => {
  state.location.locationName = config.locationNameStrings.noLocationString;
  state.location.locationDiff = "";
};

const resetSightings = (state) => {
  for (const [key] of Object.entries(state.sightings)) {
    state.sightings[key] = false
  }
};

const resetPossessions = (state) => {
  for (const [key] of Object.entries(state.cursedPossessions)) {
    if (key === "none") {
      state.cursedPossessions[key] = true
    } else {
      state.cursedPossessions[key] = false
    }
  }
};

const resetOptionalObjectives = (optionalObjectives, state) => {
  if (optionalObjectives) {
    state.optionalObjectives = optionalObjectives;
  } else {
    state.optionalObjectives = [];
  }
};

const resetEvidence = (evidence) => {
  evidence.emf = EVIDENCE_OFF;
  evidence.spiritBox = EVIDENCE_OFF;
  evidence.fingerprints = EVIDENCE_OFF;
  evidence.orbs = EVIDENCE_OFF;
  evidence.writing = EVIDENCE_OFF;
  evidence.freezing = EVIDENCE_OFF;
  evidence.dots = EVIDENCE_OFF;
};

const resetConclusion = (state) => {
  state.conclusionString =
    config.conclusionStrings.zeroEvidenceConclusionString;
};

const calculateGhostEvidenceDisplay = (state, config) => {
  // We do a deep copy to ensure there are no references
  let evidenceDisplay = JSON.parse(JSON.stringify(state.evidence));
  let evidenceString = createEvidenceString(evidenceDisplay);
  let numOfTrueEvidence = numOfTrueEvidenceInString(evidenceString);

  if (numOfTrueEvidence < 2) {
    evidenceDisplay = calculateSingleGhostEvidence(evidenceDisplay, evidenceString, config);
  } else if (numOfTrueEvidence === 2) {
    evidenceDisplay = calculateDoubleGhostEvidence(
      evidenceDisplay,
      evidenceString,
      config
    );
  } else if (numOfTrueEvidence === 3) {
    evidenceDisplay = calculateTripleGhostEvidence(
      evidenceDisplay,
      evidenceString,
      config
    );
  } else if (numOfTrueEvidence > 3) {
    evidenceDisplay = calculateBadEvidence(evidenceDisplay);
  }
  state.evidenceDisplay = evidenceDisplay;
};

const calculateSingleGhostEvidence = (evidence) => {
  // Here we need to ensure there is no impossible evidence
  for (let i = 0; i < EVIDENCE_NAMES_IN_DOM; i++) {
    if (
      evidence[EVIDENCE_NAMES_IN_DOM[i]] !== EVIDENCE_ON
      && evidence[EVIDENCE_NAMES_IN_DOM[i]] !== EVIDENCE_NEGATIVE
    ) {
      evidence[EVIDENCE_NAMES_IN_DOM[i]] = EVIDENCE_OFF;
    }
  }

  return evidence;
};

const calculateDoubleGhostEvidence = (evidence, evidenceString, config) => {
  let possibleGhosts = getGhostPossibilities(evidenceString);
  let impossibleEvidence = getImpossibleEvidence(possibleGhosts);


  if (config.markImpossibleEvidence) {
    // Addition shorthand prior to impossibleEvidence converts the string to a number
    // EMF-5 | Freezing | Spirit Box | Writing | Orbs | Fingerprints | Dots
    if (+impossibleEvidence[0] == EVIDENCE_OFF && +evidenceString[0] !== EVIDENCE_NEGATIVE) {
      evidence.emf = EVIDENCE_IMPOSSIBLE;
    }

    if (+impossibleEvidence[1] == EVIDENCE_OFF && +evidenceString[1] !== EVIDENCE_NEGATIVE) {
      evidence.freezing = EVIDENCE_IMPOSSIBLE;
    }

    if (+impossibleEvidence[2] == EVIDENCE_OFF && +evidenceString[2] !== EVIDENCE_NEGATIVE) {
      evidence.spiritBox = EVIDENCE_IMPOSSIBLE;
    }

    if (+impossibleEvidence[3] == EVIDENCE_OFF && +evidenceString[3] !== EVIDENCE_NEGATIVE) {
      evidence.writing = EVIDENCE_IMPOSSIBLE;
    }

    if (+impossibleEvidence[4] == EVIDENCE_OFF && +evidenceString[4] !== EVIDENCE_NEGATIVE) {
      evidence.orbs = EVIDENCE_IMPOSSIBLE;
    }

    if (+impossibleEvidence[5] == EVIDENCE_OFF && +evidenceString[5] !== EVIDENCE_NEGATIVE) {
      evidence.fingerprints = EVIDENCE_IMPOSSIBLE;
    }

    if (+impossibleEvidence[6] == EVIDENCE_OFF && +evidenceString[6] !== EVIDENCE_NEGATIVE) {
      evidence.dots = EVIDENCE_IMPOSSIBLE;
    }
  }

  return evidence;
};

const calculateTripleGhostEvidence = (evidence, evidenceString, config) => {
  let possibleGhosts = getGhostPossibilities(evidenceString);

  if (possibleGhosts.length === 0) {
    for (const val in evidence) {
      if (evidence[val] === EVIDENCE_ON) {
        evidence[val] = EVIDENCE_IMPOSSIBLE;
      } else {
        evidence[val] = EVIDENCE_OFF;
      }
    }
  } else {
    for (let i = 0; i < EVIDENCE_NAMES_IN_DOM.length; i++) {
      if (
        evidence[EVIDENCE_NAMES_IN_DOM[i]] !== EVIDENCE_ON
        && evidence[EVIDENCE_NAMES_IN_DOM[i]] !== EVIDENCE_NEGATIVE
        && config.useEvidenceImpossibleCompleted
      ) {
        evidence[EVIDENCE_NAMES_IN_DOM[i]] = EVIDENCE_COMPLETE_IMPOSSIBLE;
      }
    }
  }

  return evidence;
};

const calculateBadEvidence = (evidence) => {
  for (let i = 0; i < EVIDENCE_NAMES_IN_DOM.length; i++) {
    if (evidence[EVIDENCE_NAMES_IN_DOM[i]] === EVIDENCE_ON) {
      evidence[EVIDENCE_NAMES_IN_DOM[i]] = EVIDENCE_IMPOSSIBLE;
    } else {
      evidence[EVIDENCE_NAMES_IN_DOM[i]] = EVIDENCE_OFF;
    }
  }

  return evidence;
};

const updateSingleOptionalObjective = (optionalObjectives, objective) => {
  let objectiveString = getOptObjectiveString(objective);

  if (objectiveString) {
    let oldOptionalObjective = optionalObjectives.findIndex(
      (item) => item.text === objectiveString
    );

    if (oldOptionalObjective >= 0) {
      optionalObjectives.splice(oldOptionalObjective, 1);
    } else if (optionalObjectives.length < 3) {
      optionalObjectives.push({ text: objectiveString, strike: false });
    }
  }
  return optionalObjectives;
};

const updateFullOptionalObjectives = (
  objectiveOne,
  objectiveTwo,
  objectiveThree
) => {
  let optionalObjectives = [];
  optionalObjectives = updateSingleOptionalObjective(
    optionalObjectives,
    objectiveOne
  );
  optionalObjectives = updateSingleOptionalObjective(
    optionalObjectives,
    objectiveTwo
  );
  optionalObjectives = updateSingleOptionalObjective(
    optionalObjectives,
    objectiveThree
  );

  return optionalObjectives;
};

const determineConclusionMessage = (state) => {
  let displayEvidenceString = createEvidenceString(state.evidenceDisplay);
  let numOfDisplayTrueEvidence = numOfTrueEvidenceInString(displayEvidenceString);

  let numOfPlayerTrueEvidence = numOfTrueEvidenceInString(createEvidenceString(state.evidence));

  let numOfNegative = numOfNegativeEvidenceInString(displayEvidenceString);
  let ghostPossibilities = getGhostPossibilities(displayEvidenceString);

  switch (true) {
    case numOfDisplayTrueEvidence <= 0:
      if (numOfPlayerTrueEvidence < 4) {
        state.conclusionString = getZeroEvidenceConclusionMessage(numOfNegative, ghostPossibilities);
      } else {
        state.conclusionString = config.conclusionStrings.tooMuchEvidence;
      }
      break;
    case numOfDisplayTrueEvidence == 1:
      state.conclusionString = getSingleEvidenceConclusionMessage(numOfNegative, ghostPossibilities);
      break;
    case numOfDisplayTrueEvidence == 2:
    case numOfDisplayTrueEvidence == 3:
      state.conclusionString = getMultipleEvidenceConclusionMessage(ghostPossibilities);
      break;
    case numOfDisplayTrueEvidence == 4:
    case numOfDisplayTrueEvidence >= 4:
      console.log('in here');
      state.conclusionString = config.conclusionStrings.tooMuchEvidence;
      break;
    default:
      state.conclusionString = "Something broke";
      break;
  }
};

/*******************************************************
 *                  HELPER FUNCTIONS                   *
 *******************************************************/

// * This is set to always automatically set evidence to ON
// * Except when ON, in which case it sets to OFF
// * This is intentional behavior
const toggleEvidenceIterator = (evidence) => {
  if (evidence === EVIDENCE_ON) {
    evidence = EVIDENCE_NEGATIVE;
  } else if (evidence === EVIDENCE_NEGATIVE) {
    evidence = EVIDENCE_OFF;
  } else {
    evidence = EVIDENCE_ON;
  }
  return evidence;
};

const setEvidence = (arg) => {
  if (arg === 'o' || arg === 'on') {
    return EVIDENCE_ON;
  }

  if (arg === 'f' || arg === 'off') {
    return EVIDENCE_OFF;
  }

  if (arg === 'x' || arg === 'n' || arg === 'neg' || arg === 'negative') {
    return EVIDENCE_NEGATIVE;
  }
}

const getLocationNameString = (location) => {
  let locationSplit = location.split(" ");
  if (locationSplit[1]) {
    _setDiffName(locationSplit[1].toLowerCase(), userState);
  }
  updateLocationName(LOCATIONS[locationSplit[0].toLowerCase()]);
  return LOCATIONS[locationSplit[0].toLowerCase()];
};

const getDifficultyString = (difficulty) => {
  updateLocationDiff(DIFFICULTY[difficulty.toLowerCase()]);
  return DIFFICULTY[difficulty.toLowerCase()]
};

const getValueFromArray = (array, string) => {
  for (const [key,value] of Object.entries(array)){
    var pattern = new RegExp(`^${key}`, 'ig');
    if(pattern.test(string)){
      return value;
    }
  }
}

const arrayIsFalse = (array) => {
  for (const [key] of Object.entries(array)) {
    if (array[key]) {
      return false;
    }
  }
  return true;
}

// Returns each first character capitalized
const camelCase = (sentence) => {
  return sentence.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
};

const toggleVIPAccessibility = (canUseVIP) => {
  if (canUseVIP !== undefined && canUseVIP !== null) {
    config.allowVIPS = canUseVIP;
  } else {
    config.allowVIPS = !config.allowVIPS;
  }
};

const createEvidenceString = (evidence) => {

  let evidenceString =
    "" +
    evidence.emf +
    evidence.freezing +
    evidence.spiritBox +
    evidence.writing +
    evidence.orbs +
    evidence.fingerprints +
    evidence.dots;

  return evidenceString;
};

const addToEvidenceString = (evidenceString, evidenceValue) => {
  return evidenceString + `${evidenceValue}`;
}

const numOfTrueEvidenceInString = (evidenceString) => {
  let index,
    count = 0;
  for (index = 0; index < evidenceString.length; ++index) {
    count = evidenceString.charAt(index) == "1" ? count + 1 : count;
  }

  return count;
};

const numOfNegativeEvidenceInString = (evidenceString) => {
  let index,
    count = 0;
  for (index = 0; index < evidenceString.length; ++index) {
    count = (evidenceString.charAt(index) == `${EVIDENCE_NEGATIVE}`)
      ? count + 1 : count;
  }

  return count;
}

const getGhostPossibilities = (evidenceString) => {
  // List of ghosts returns [<evidenceString>, <Name>]
  const possibleGhosts = [];
  const numOfTrueEvidence = numOfTrueEvidenceInString(evidenceString);

  if (numOfTrueEvidence > 0) {
    for (let i = 0; i < config.ghosts.length; i++) {
      let evidenceMatch = 0;
      let ghostToCheck = config.ghosts[i];
      let impossibleGhostDueToNegative = false;

      for (let j = 0; j < evidenceString.length; j++) {
        if (evidenceString.charAt(j) == `${EVIDENCE_ON}`) {
          if (evidenceString.charAt(j) == ghostToCheck.evidence.charAt(j)) {
            evidenceMatch = evidenceMatch + 1;
          }
        }

        if (
          evidenceString.charAt(j) == `${EVIDENCE_NEGATIVE}`
          && ghostToCheck.evidence.charAt(j) == `${EVIDENCE_ON}`
        ) {
          impossibleGhostDueToNegative = true;
        }
      }

      if (
        impossibleGhostDueToNegative === false
        && evidenceMatch == numOfTrueEvidence
      ) {
        possibleGhosts.push(ghostToCheck);
      }
    }
  } else {
    for (let i = 0; i < config.ghosts.length; i++) {
      let impossibleGhostDueToNegative = false;

      for (let j = 0; j < evidenceString.length; j++) {
        let ghostToCheck = config.ghosts[i];

        if (
          evidenceString.charAt(j) == `${EVIDENCE_NEGATIVE}`
          && ghostToCheck.evidence.charAt(j) == `${EVIDENCE_ON}`
        ) {
          impossibleGhostDueToNegative = true;
        }
      }

      if  (!impossibleGhostDueToNegative) {
        possibleGhosts.push(config.ghosts[i]);
      }
    }
  }

  return possibleGhosts;
};

const getImpossibleEvidence = (possibleGhosts) => {
  let impossibleEvidenceString = "0000000"; // If it stays a 0, we know it can't match any of the ghosts
  for (let i = 0; i < possibleGhosts.length; i++) {
    for (let k = 0; k < impossibleEvidenceString.length; k++) {
      impossibleEvidenceString =
        impossibleEvidenceString.slice(0, k) +
        `${+impossibleEvidenceString[k] + +possibleGhosts[i].evidence[k]}` +
        impossibleEvidenceString.slice(k + 1);

      impossibleEvidenceString[k] = `${
        +impossibleEvidenceString[k] + +possibleGhosts[i].evidence[k]
      }`; // possibleGhosts[ghost][ghost evidence string][position in evidence string]
    }
  }
  return impossibleEvidenceString;
};

const createGhostConclusionString = (conclusionString, ghostType) => {
  return conclusionString ? conclusionString : `It's a ${ghostType}!!`;
};

const getOptObjectiveString = (obj) => {
  return OPTIONAL_OBJECTIVES[obj.toLowerCase()];
};

const getNumberString = (num) => {
  const numStrings = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  return numStrings[num];
};

const getZeroEvidenceConclusionMessage = (numOfNegativeEvidence, ghostPossibilities) => {
  let conclusionString = "";

  switch (numOfNegativeEvidence) {
    case 4:
    case 3:
    case 2:
      conclusionString = getConclusionStringBasedOnGhostPossiblities(ghostPossibilities);
      break;
    case 1:
      conclusionString = config.conclusionStrings.oneEvidenceConclusionString;
      break;
    default:
      conclusionString = config.conclusionStrings.zeroEvidenceConclusionString;
      break;
  }

  return conclusionString;
}

const getSingleEvidenceConclusionMessage = (numOfNegativeEvidence, ghostPossibilities) => {
  let conclusionString = "";

  switch (numOfNegativeEvidence) {
    case 4:
    case 3:
    case 2:
    case 1:
      conclusionString = getConclusionStringBasedOnGhostPossiblities(ghostPossibilities);
      break;
    default:
      conclusionString = config.conclusionStrings.oneEvidenceConclusionString;
      break;
  }

  return conclusionString;
}

const getMultipleEvidenceConclusionMessage = (ghostPossibilities) => {
  let conclusionString = "";

  conclusionString = getConclusionStringBasedOnGhostPossiblities(ghostPossibilities);

  return conclusionString;
}

const getConclusionArticleBasedOnGhostPossibilities = (ghostPossibilities) => {
  const firstGhost = ghostPossibilities[0]
  const firstWord = firstGhost.split(/(\s+)/)[0]
  const isVowel = /[aeiouAEIOU]/.test(firstWord.charAt(0))
  const isThe = /The/.test(firstWord)
  if (isThe) { return "" } else if (isVowel) { return "an" } else { return "a" }
  return "a"
}

const getConclusionStringBasedOnGhostPossiblities = (ghostPossibilities) => {
  let conclusionString = "";
  let ghostPossibilityStrings = ghostPossibilities.map((ghost) => ghost.type);

  if (ghostPossibilities.length === 0) {
    conclusionString = config.conclusionStrings.tooMuchEvidence;
  } else if (ghostPossibilities.length === 1) {
    conclusionString = ghostPossibilities[0].conclusion;
  } else {
    let conclusionArticle = getConclusionArticleBasedOnGhostPossibilities(ghostPossibilityStrings)
    conclusionString = `Could be ${conclusionArticle} ${ghostPossibilityStrings.join(", ")}`
  }

  return conclusionString;
}

/*******************************************************
 *             DOM MANIPULATING FUNCTIONS              *
 *******************************************************/

const updateDashboardDOM = (state) => {
  updateNameDOM(state.ghostName);
  updateLocationName(state.location.locationName);
  updateLocationDiff(state.location.locationDiff);
  updateSighting(state.sightings, state.location.locationName);
  updatePossession(state.cursedPossessions);
  updateEvidenceDOM(state.evidenceDisplay);
  updateOptionalObjectivesDOM(state.optionalObjectives);
  updateConclusion(state.conclusionString);
};

/** NAME RELATED DOM MANIPULATING FUNCTIONS */
const updateNameDOM = (newName) => {
  let nameString = "" + config.nameStrings.ghostNameString;

  /**
   * Replaces "[name]" with the name of the ghost, allowing the user to paramaterize
   * the name for things such as "Name: [name]" === "Name: John Doe"
   */
  nameString = nameString.replace(/\[name\]/g, newName);
  $("#name").html(`${newName ? nameString : config.nameStrings.noNameString}`);
};

/** EVIDENCE RELATED DOM MANIPULATING FUNCTIONS */
const updateEvidenceDOM = (evidence) => {
  resetEvidenceDOM();
  for (let i = 0; i < EVIDENCE_NAMES_IN_DOM.length; i++) {
    let evidenceDom = $(`#${EVIDENCE_NAMES_IN_DOM[i]}-svg`);
    let negativeDom = $(`#${EVIDENCE_NAMES_IN_DOM[i]}-negative`);
    negativeDom.addClass("hidden");
    switch (evidence[EVIDENCE_NAMES_IN_DOM[i]]) {
      case EVIDENCE_ON:
        evidenceDom.addClass("active");
        break;
      case EVIDENCE_IMPOSSIBLE:
        evidenceDom.addClass("impossible");
        break;
      case EVIDENCE_COMPLETE_IMPOSSIBLE:
        evidenceDom.addClass("impossible-completed");
        break;
      case EVIDENCE_NEGATIVE:
        evidenceDom.addClass("impossible");
        negativeDom.removeClass("hidden");
      case EVIDENCE_OFF:
      default:
        evidenceDom.addClass("inactive");
        break;
    }
  }
};

const resetEvidenceDOM = () => {
  for (let i = 0; i < EVIDENCE_NAMES_IN_DOM.length; i++) {
    $(`#${EVIDENCE_NAMES_IN_DOM[i]}-svg`).removeClass([
      "active",
      "inactive",
      "impossible",
      "impossible-completed",
    ]);
  }
};

/** OPTIONAL OBJECTIVE RELATED DOM MANIPULATING FUNCTIONS */
const updateOptionalObjectivesDOM = (optionalObjectives) => {
  resetOptionalDOM();

  if (config.optionalObj.spacing === "justify-evenly") {
    updateOptionalObjectivesDOMEvenly(optionalObjectives);
  } else if (optionalObjectives.length > 0) {
    $("#optional-obj-container").removeClass("hidden");
    $("#no-opt-objectives-container").addClass("hidden");
    for (let i = 0; i < optionalObjectives.length; i++) {
      $("#optional-obj-container").append(
        $("<div>", {
          class: `objective px-0.5 ${
            optionalObjectives[i].strike ? " strikethrough" : ""
          }`,
          id: `objective-${getNumberString(i + 1)}`,
          text: optionalObjectives[i].text,
        })
      );
    }
  }
};

const updateOptionalObjectivesDOMEvenly = (optionalObjectives) => {
  if (optionalObjectives.length > 0) {
    $("#optional-obj-container").removeClass("hidden");
    $("#no-opt-objectives-container").addClass("hidden");

    if (optionalObjectives[0]) {
      $("#optional-obj-container").append(
        $("<div>", {
          class: `objective w-1/3 text-left${
            optionalObjectives[0].strike ? " strikethrough" : ""
          }`,
          id: "objective-one",
          text: optionalObjectives[0].text,
        })
      );
    }
    if (optionalObjectives[1]) {
      $("#optional-obj-container").append(
        $("<div>", {
          class: `objective w-1/3 text-center${
            optionalObjectives[1].strike ? " strikethrough" : ""
          }`,
          id: "objective-two",
          text: optionalObjectives[1].text,
        })
      );
    }
    if (optionalObjectives[2]) {
      $("#optional-obj-container").append(
        $("<div>", {
          class: `objective w-1/3 text-right${
            optionalObjectives[2].strike ? " strikethrough" : ""
          }`,
          id: "objective-three",
          text: optionalObjectives[2].text,
        })
      );
    }
  }
};

const resetOptionalDOM = () => {
  $("#optional-obj-container").empty();
  $("#optional-obj-container").addClass("hidden");
  $("#no-opt-objectives-container").removeClass("hidden");
};

const toggleStrikethrough = (optionalNumber, state) => {
  state.optionalObjectives[optionalNumber].strike =
    !state.optionalObjectives[optionalNumber].strike;
};

/** LOCATION RELATED DOM MANIPULATING FUNCTIONS */
const updateLocationName = (location) => {
  $("#location-name").html(location);
};

const updateLocationDiff = (diff) => {
  $("#location-difficulty").html(diff);
};

/** SIGHTING RELATED DOM MANIPULATING FUNCTIONS */
const updateSighting = (sightings, locationName) => {
  for (const [key, value] of Object.entries(sightings)) {
    let sightingInactive = (key === "slenderman" && locationName != "Maple Lodge") ? `sighting-hidden` : `sighting-{{displayInactiveSighting}}`
    $(`#${key}-svg-container`).removeClass([`sighting-active`, `sighting-hidden`, sightingInactive])
    $(`#${key}-svg-container`).addClass(value ? `sighting-active` : sightingInactive)
    $(`#${key}`).removeClass([`sighting-active`, `sighting-hidden`, sightingInactive])
    $(`#${key}`).addClass(value ? `sighting-active` : sightingInactive)
  }
}

/** POSESSIONS RELATED DOM MANIPULATING FUNCTIONS */
const updatePossession = (possessions) => {
  for (const [key, value] of Object.entries(possessions)) {
    $(`#${key}-svg-container`).removeClass([`possession-active`, `possession-inactive`])
    $(`#${key}`).removeClass([`possession-active`, `possession-inactive`])
    $(`#${key}-svg-container`).addClass(value ? `possession-active` : `possession-inactive`)
    $(`#${key}`).addClass(value ? `possession-active` : `possession-inactive`)
  }
}

/** CONCLUSION RELATED DOM MANIPULATING FUNCTIONS */
const updateConclusion = (conclusion) => {
  $("#conclusion").html(conclusion);
};

/** COUNTER RELATED DOM MANIPULATING FUNCTIONS */
const setCounterName = (which, name) => {
  if (which === 1) {
    $("#counter-name").html(name);
  } else if (which === 2) {
    $("#counter2-name").html(name);
  }
};

const setCounterNumber = (which, number) => {
  let num = parseInt(number);

  if (Number.isInteger(num)) {
    if (which === 1) {
      $("#counter-number").text("" + num);
    } else if (which === 2) {
      $("#counter2-number").text("" + num);
    }
  }
};

const incrementCounter = (which, num) => {
  let counter;
  if (which === 1) {
    counter = $("#counter-number");
  } else if (which === 2) {
    counter = $("#counter2-number");
  }
  counter.text(parseInt(counter.text()) + (num ? num : 1));
};

const decrementCounter = (which, num) => {
  let counter;
  if (which === 1) {
    counter = $("#counter-number");
  } else if (which === 2) {
    counter = $("#counter2-number");
  }
  counter.text(parseInt(counter.text()) - (num ? num : 1));
};

/**
 * GlitchedMythos Only
 */

let speed = 100;
let cursorSpeed = 400;
let time = 0;
let prevTime = 200;

const writeMessage = (word) => {
  for (let c in word.split("")) {
    time = Math.floor(Math.random() * speed);

    setTimeout(() => {
      $("#text").before(word[c]);
    }, prevTime + time);

    prevTime += time;
  }

  return prevTime;
};

const writeOutVersion = (command) => {
  $("#version").addClass("show-version-item");
  setTimeout(() => {
    let time = writeMessage(command);
    setTimeout(() => {
      $("#version").removeClass("show-version-item");
      prevTime = 0;
      time = 0;
      setTimeout(() => {
        $("#console-container").empty();
        $("#console-container").append($(`<span class="prompt">>  </span>`));
        $("#console-container").append($(`<div id="text"></div>`));
        $("#console-container").append($(`<div class="cursor"></div>`));
      }, 2000);
    }, time + 2000);
  }, 1000);
};
