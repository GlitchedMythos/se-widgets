const version = "3.3";

// Order is important here:
// EMF-5 | Freezing | Spirit Box | Writing | Orbs | Fingerprints | DOTS
// 1 is true
// 0 is false

const BANSHEE = "0000111",
  DEMON =       "0101010",
  GORYO =       "1000011",
  HANTU =       "0100110",
  JINN =        "1100010",
  MARE =        "0011100",
  MYLING =      "1001010",
  ONI =         "1100001",
  PHANTOM =     "0010011",
  POLTERGEIST = "0011010",
  REVENANT =    "0101100",
  SHADE =       "1101000",
  SPIRIT =      "1011000", // ONLY CORRECT ONE
  WRAITH =      "1010001",
  YOKAI =       "0010101",
  YUREI =       "0100101";

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
  as: "Asylum",
  asylum: "Asylum",
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
};

// Constants for displaying evidence on the widget
const EVIDENCE_OFF = 0,
  EVIDENCE_ON = 1,
  EVIDENCE_IMPOSSIBLE = 2,
  EVIDENCE_COMPLETE_IMPOSSIBLE = 3;

const EVIDENCE_NAMES_IN_DOM = [
  "emf",
  "spiritBox",
  "fingerprints",
  "orbs",
  "writing",
  "freezing",
  "dots"
];

// Permission levels for commands
const PERMISSION_GLITCHED = 0,
  PERMISSION_BROADCASTER = 1,
  PERMISSION_MOD = 2,
  PERMISSION_VIP = 3;

// TODO: Move all widget and user state to here
let userState = {
  boner: false,
  channelName: "",
  conclusionString: "",
  counter: 0,
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
  ouija: false,
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
  const fieldData = obj.detail.fieldData;

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
    [fieldData["bonerCommand"]]: (data) => {
      runCommandWithPermission(modOrVIPPermission(config), data, _toggleBoner, [
        userState,
      ]);
    },
    [fieldData["ouijaCommand"]]: (data) => {
      runCommandWithPermission(modOrVIPPermission(config), data, _toggleOuija, [
        userState,
      ]);
    },
    [fieldData["emfCommand"]]: (data) => {
      runCommandWithPermission(modOrVIPPermission(config), data, _toggleEMF, [
        userState,
        config,
      ]);
    },
    [fieldData["spiritBoxCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleSpiritBox,
        [userState, config]
      );
    },
    [fieldData["fingerprintsCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleFingerprints,
        [userState, config]
      );
    },
    [fieldData["orbsCommand"]]: (data) => {
      runCommandWithPermission(modOrVIPPermission(config), data, _toggleOrbs, [
        userState,
        config,
      ]);
    },
    [fieldData["writingCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleWriting,
        [userState, config]
      );
    },
    [fieldData["freezingCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleFreezing,
        [userState, config]
      );
    },
    [fieldData["dotsCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleDots,
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
        [data.text]
      );
    },
    [fieldData["setCounterNumberCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setCounterNumber,
        [data.text]
      );
    },
    [fieldData["incrementCounterCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _incrementCounter,
        []
      );
    },
    [fieldData["decrementCounterCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _decrementCounter,
        []
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
      type: "Myling",
      conclusion: createGhostConclusionString(fieldData["mylingString"], "Myling"),
      evidence: MYLING,
    },
    {
      type: "Oni",
      conclusion: createGhostConclusionString(fieldData["oniString"], "Oni"),
      evidence: ONI,
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
    noOptionalString: fieldData["noOptionalObjectivesMessage"],
    spacing: fieldData["objectivesSpacing"],
  };
  config.markImpossibleEvidence =
    fieldData["markImpossibleEvidence"] === "yes" ? true : false;
  config.useEvidenceImpossibleCompleted =
    fieldData["useEvidenceImpossibleCompleted"] === "yes" ? true : false;

  // TODO: Refactor to set up in config
  let displayName = fieldData["displayName"] === "yes" ? true : false;
  let displayLocation = fieldData["displayLocation"] === "yes" ? true : false;
  let displayBoner = fieldData["displayBoner"] === "yes" ? true : false;
  let displayOuija = fieldData["displayOuija"] === "yes" ? true : false;
  let displayEvidence = fieldData["displayEvidence"] === "yes" ? true : false;
  let displayCounter = fieldData["displayCounter"] === "yes" ? true : false;
  let displayOptionalObjectives =
    fieldData["displayOptionalObjectives"] === "yes" ? true : false;
  let displayConclusion =
    fieldData["displayConclusion"] === "yes" ? true : false;

  if (!displayName) {
    $(`#name`).addClass("hidden");
  }

  if (!displayLocation && !displayBoner && !displayOuija) {
    $(`#location-container`).addClass("hidden");
  } else {
    if (!displayLocation) {
      $(`#location-name`).addClass("hidden");
      $(`#location-difficulty`).addClass("hidden");
    }

    if (!displayBoner && !displayOuija) {
      $(`#location-optionals`).addClass("hidden");
    } else {
      if (!displayBoner) {
        $(`#boner-svg-container`).addClass("hidden");
      }
      if (!displayOuija) {
        $(`#ouija-svg-container`).addClass("hidden");
      }
    }
  }

  if (!displayEvidence && !displayCounter) {
    $(`#evidence-and-counter-container`).addClass("hidden");
  } else {
    if (!displayEvidence) {
      $(`#evidence-container`).addClass("hidden");
    }

    if (!displayCounter) {
      $(`#counter-container`).addClass("hidden");
    }
  }

  if (!displayOptionalObjectives) {
    $(`#optional-obj`).addClass(`hidden`);
  }

  if (!displayConclusion) {
    $(`#conclusion`).addClass("hidden");
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

const _toggleBoner = (state) => {
  state.boner = !state.boner;
};

const _toggleOuija = (state) => {
  state.ouija = !state.ouija;
};

const _toggleEMF = (state, config) => {
  state.evidence.emf = toggleEvidence(state.evidence.emf);
  calculateGhostEvidenceDisplay(state, config);
  determineConclusionMessage(state);
};

const _toggleSpiritBox = (state, config) => {
  state.evidence.spiritBox = toggleEvidence(state.evidence.spiritBox);
  calculateGhostEvidenceDisplay(state, config);
  determineConclusionMessage(state);
};

const _toggleFingerprints = (state, config) => {
  state.evidence.fingerprints = toggleEvidence(state.evidence.fingerprints);
  calculateGhostEvidenceDisplay(state, config);
  determineConclusionMessage(state);
};

const _toggleOrbs = (state, config) => {
  state.evidence.orbs = toggleEvidence(state.evidence.orbs);
  calculateGhostEvidenceDisplay(state, config);
  determineConclusionMessage(state);
};

const _toggleWriting = (state, config) => {
  state.evidence.writing = toggleEvidence(state.evidence.writing);
  calculateGhostEvidenceDisplay(state, config);
  determineConclusionMessage(state);
};

const _toggleFreezing = (state, config) => {
  state.evidence.freezing = toggleEvidence(state.evidence.freezing);
  calculateGhostEvidenceDisplay(state, config);
  determineConclusionMessage(state);
};

const _toggleDots = (state, config) => {
  state.evidence.dots = toggleEvidence(state.evidence.dots);
  calculateGhostEvidenceDisplay(state, config);
  determineConclusionMessage(state);
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

const _setCounterName = (command) => {
  commandArgument = command.split(" ").slice(1).join(" ");
  setCounterName(commandArgument);
};

const _setCounterNumber = (command) => {
  commandArgument = command.split(" ").slice(1).join(" ");
  setCounterNumber(commandArgument);
};

const _incrementCounter = () => {
  incrementCounter();
};

const _decrementCounter = () => {
  decrementCounter();
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
const resetGhost = (newName, state) => {
  resetName(newName, state);
  resetLocationName(state);
  resetLocationOptionals(state);
  // resetEvidence is called twice here as it is resetting state in two places.
  resetEvidence(state.evidence);
  resetEvidence(state.evidenceDisplay);
  resetOptionalObjectives([], state);
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

const resetLocationOptionals = (state) => {
  state.boner = false;
  state.ouija = false;
};

const resetOptionalObjectives = (optionalObjectives, state) => {
  if (optionalObjectives) {
    state.optionalObjectives = optionalObjectives;
  } else {
    state.optionalObjectives = [];
  }
};

// TODO: Update with new evidence
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

// TODO: Ensure this still works with new/more evidence
const calculateGhostEvidenceDisplay = (state, config) => {
  // We do a deep copy to ensure there are no references
  let evidenceDisplay = JSON.parse(JSON.stringify(state.evidence));
  let evidenceString = createEvidenceString(evidenceDisplay);
  let numOfTrueEvidence = numOfTrueEvidenceInString(evidenceString);

  if (numOfTrueEvidence < 2) {
    evidenceDisplay = calculateSingleGhostEvidence(evidenceDisplay);
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
    if (evidence[EVIDENCE_NAMES_IN_DOM[i]] !== EVIDENCE_ON) {
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
    if (+impossibleEvidence[0] == 0) {
      evidence.emf = EVIDENCE_IMPOSSIBLE;
    }

    if (+impossibleEvidence[1] == 0) {
      evidence.freezing = EVIDENCE_IMPOSSIBLE;
    }

    if (+impossibleEvidence[2] == 0) {
      evidence.spiritBox = EVIDENCE_IMPOSSIBLE;
    }

    if (+impossibleEvidence[3] == 0) {
      evidence.writing = EVIDENCE_IMPOSSIBLE;
    }

    if (+impossibleEvidence[4] == 0) {
      evidence.orbs = EVIDENCE_IMPOSSIBLE;
    }

    if (+impossibleEvidence[5] == 0) {
      evidence.fingerprints = EVIDENCE_IMPOSSIBLE;
    }

    if (+impossibleEvidence[6] == 0) {
      evidence.dots = EVIDENCE_IMPOSSIBLE;
    }
  }

  return evidence;
};

// TODO: Add/validate new evidence
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
        evidence[EVIDENCE_NAMES_IN_DOM[i]] !== EVIDENCE_ON &&
        config.useEvidenceImpossibleCompleted
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

// TODO: Ensure new ghosts work
const determineConclusionMessage = (state) => {
  let displayEvidenceString = createEvidenceString(state.evidenceDisplay);
  let numOfDisplayTrueEvidence = numOfTrueEvidenceInString(
    displayEvidenceString
  );

  let userEvidenceString = createEvidenceString(state.evidence);
  let numberOfUserTrueEvidence = numOfTrueEvidenceInString(userEvidenceString);

  if (numOfDisplayTrueEvidence < 1 && numberOfUserTrueEvidence < 1) {
    state.conclusionString =
      config.conclusionStrings.zeroEvidenceConclusionString;
  } else if (numOfDisplayTrueEvidence === 1) {
    state.conclusionString =
      config.conclusionStrings.oneEvidenceConclusionString;
  } else if (numOfDisplayTrueEvidence === 2) {
    let ghostPossibilities = getGhostPossibilities(displayEvidenceString);
    let ghostPossibilityStrings = ghostPossibilities.map((ghost) => ghost.type);
    state.conclusionString = `Could be a ` + ghostPossibilityStrings.join(", ");
  } else if (numOfDisplayTrueEvidence === 3) {
    let ghostPossibilities = getGhostPossibilities(displayEvidenceString);
    let ghostPossibilityStrings = ghostPossibilities.map((ghost) => ghost.type);

    state.conclusionString =
      ghostPossibilityStrings.length === 0
        ? config.conclusionStrings.tooMuchEvidence
        : ghostPossibilities[0].conclusion;
  } else {
    state.conclusionString = config.conclusionStrings.tooMuchEvidence;
  }
};

/*******************************************************
 *                  HELPER FUNCTIONS                   *
 *******************************************************/

const toggleEvidence = (evidence) => {
  if (evidence === EVIDENCE_ON) {
    evidence = EVIDENCE_OFF;
  } else {
    evidence = EVIDENCE_ON;
  }
  return evidence;
};

const getLocationNameString = (location) => {
  let locationSplit = location.split(" ");
  if (locationSplit[1]) {
    _setDiffName(locationSplit[1].toLowerCase(), userState);
  }
  updateLocationName(LOCATIONS[locationSplit[0].toLowerCase()]);
};

const getDifficultyString = (difficulty) => {
  updateLocationDiff(DIFFICULTY[difficulty.toLowerCase()]);
};

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
  let evidenceString = "";

  evidenceString =
    evidence.emf === EVIDENCE_ON ? evidenceString + "1" : evidenceString + "0";
  evidenceString =
    evidence.freezing === EVIDENCE_ON
      ? evidenceString + "1"
      : evidenceString + "0";
  evidenceString =
    evidence.spiritBox === EVIDENCE_ON
      ? evidenceString + "1"
      : evidenceString + "0";
  evidenceString =
    evidence.writing === EVIDENCE_ON
      ? evidenceString + "1"
      : evidenceString + "0";
  evidenceString =
    evidence.orbs === EVIDENCE_ON ? evidenceString + "1" : evidenceString + "0";
  evidenceString =
    evidence.fingerprints === EVIDENCE_ON
      ? evidenceString + "1"
      : evidenceString + "0";
  evidenceString =
    evidence.dots === EVIDENCE_ON
      ? evidenceString + "1"
      : evidenceString + "0";

  return evidenceString;
};

const numOfTrueEvidenceInString = (evidenceString) => {
  let index,
    count = 0;
  for (index = 0; index < evidenceString.length; ++index) {
    count = evidenceString.charAt(index) == "1" ? count + 1 : count;
  }

  return count;
};

const getGhostPossibilities = (evidenceString) => {
  // List of ghosts returns [<evidenceString>, <Name>]
  const possibleGhosts = [];
  const numOfTrueEvidence = numOfTrueEvidenceInString(evidenceString);

  for (let i = 0; i < config.ghosts.length; i++) {
    let evidenceMatch = 0;
    let ghostToCheck = config.ghosts[i];

    for (let j = 0; j < evidenceString.length; j++) {
      if (evidenceString.charAt(j) == "1") {
        if (evidenceString.charAt(j) == ghostToCheck.evidence.charAt(j)) {
          evidenceMatch = evidenceMatch + 1;
        }
      }
    }

    if (evidenceMatch == numOfTrueEvidence && evidenceMatch > 1) {
      possibleGhosts.push(config.ghosts[i]);
    }
  }

  return possibleGhosts;
};

const getImpossibleEvidence = (possibleGhosts) => {
  let impossibleEvidenceString = "0000000"; // If it stays a 0, we know it can't match any of the ghosts
  for (let i = 0; i < possibleGhosts.length; i++) {
    for (let k = 0; k < impossibleEvidenceString.length; k++) {
      impossibleEvidenceString =
        impossibleEvidenceString.substr(0, k) +
        `${+impossibleEvidenceString[k] + +possibleGhosts[i].evidence[k]}` +
        impossibleEvidenceString.substr(k + 1);
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

/*******************************************************
 *             DOM MANIPULATING FUNCTIONS              *
 *******************************************************/

const updateDashboardDOM = (state) => {
  updateNameDOM(state.ghostName);
  updateLocationName(state.location.locationName);
  updateLocationDiff(state.location.locationDiff);
  updateBoner(state.boner);
  updateOuija(state.ouija);
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

// TODO: Validate working
/** EVIDENCE RELATED DOM MANIPULATING FUNCTIONS */
const updateEvidenceDOM = (evidence) => {
  resetEvidenceDOM();
  for (let i = 0; i < EVIDENCE_NAMES_IN_DOM.length; i++) {
    let evidenceDom = $(`#${EVIDENCE_NAMES_IN_DOM[i]}-svg`);
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
      case EVIDENCE_OFF:
      default:
        evidenceDom.addClass("inactive");
        break;
    }
  }
};

// TODO: Validate working
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

const updateBoner = (boner) => {
  $(`#boner`).removeClass(["boner-active", "boner-inactive"]);
  $(`#boner`).addClass(boner ? "boner-active" : "boner-inactive");
};

const updateOuija = (ouija) => {
  $(`#ouija`).removeClass(["ouija-active", "ouija-inactive"]);
  $(`#ouija`).addClass(ouija ? "ouija-active" : "ouija-inactive");
};

/** CONCLUSION RELATED DOM MANIPULATING FUNCTIONS */
const updateConclusion = (conclusion) => {
  $("#conclusion").html(conclusion);
};

/** COUNTER RELATED DOM MANIPULATING FUNCTIONS */
const setCounterName = (name) => {
  $("#counter-name").html(name);
};

const setCounterNumber = (number) => {
  let num = parseInt(number);

  if (Number.isInteger(num)) {
    $("#counter-number").text("" + num);
  }
};

const incrementCounter = (num) => {
  let counter = $("#counter-number");
  counter.text(parseInt(counter.text()) + (num ? num : 1));
};

const decrementCounter = (num) => {
  let counter = $("#counter-number");
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
