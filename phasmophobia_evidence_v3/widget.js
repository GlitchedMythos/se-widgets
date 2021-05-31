const version = "3.0";

// Order is important here:
// EMF-5 | Freezing | Spirit Box | Writing | Orbs | Fingerprints
// 1 is true
// 0 is false
const BANSHEE = "110001",
  DEMON = "011100",
  HANTU = "000111",
  JINN = "101010",
  MARE = "011010",
  ONI = "101100",
  PHANTOM = "110010",
  POLTERGEIST = "001011",
  REVENANT = "100101",
  SHADE = "100110",
  SPIRIT = "001101",
  WRAITH = "011001",
  YOKAI = "001110",
  YUREI = "010110";

const OPTIONAL_OBJECTIVES = {
  ca: "Candle",
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
  sa: "Salt",
  salt: "Salt",
  san: "<25% Sanity",
  sanity: "<25% Sanity",
  sm: "Smudge",
  smudge: "Smudge",
};

// Constants for displaying evidence on the widget
const EVIDENCE_OFF = 0,
  EVIDENCE_ON = 1,
  EVIDENCE_IMPOSSIBLE = 2,
  EVIDENCE_COMPLETE_IMPOSSIBLE = 3;

  // Permission levels for commands
const PERMISSION_GLITCHED = 0,
  PERMISSION_BROADCASTER = 1,
  PERMISSION_MOD = 2,
  PERMISSION_VIP = 3;

  // TODO: Move all widget and user state to here
let userState = {
  channelName: "",
  counter: 0,
  evidence: {
    emf: EVIDENCE_OFF,
    spiritBox: EVIDENCE_OFF,
    fingerprints: EVIDENCE_OFF,
    orbs: EVIDENCE_OFF,
    writing: EVIDENCE_OFF,
    freezing: EVIDENCE_OFF,
  },
  ghostName: "",
  optionalObjectives: {
    objectiveOne: "",
    objectiveTwo: "",
    objectiveThree: "",
  },
};

let config = {};

/*
 ? Maybe this should take in an array of permissions?
 * Would be able to expand on this by adding train conductor badges, founders, etc.
 */
const runCommandWithPermission = (permission, data, command, commandArgs) => {
  if (hasPermission(permission, getUserLevelFromData(data))) {
    command(...commandArgs);
  }
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
  userState.channelName = obj["detail"]["channel"]["username"];

  const fieldData = obj.detail.fieldData;

  config.commands = {
    [fieldData["resetCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config), 
        data, 
        _resetGhost, 
        [
          data.text,
          userState.evidence,
        ]
      );
    },
    [fieldData["nameCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setGhostName,
        [data.text]
      );
    },
    [fieldData["emfCommand"]]: (data) => {
      runCommandWithPermission(modOrVIPPermission(config), data, _toggleEMF, [
        userState.evidence,
      ]);
    },
    [fieldData["spiritBoxCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleSpiritBox,
        [userState.evidence]
      );
    },
    [fieldData["fingerprintsCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleFingerprints,
        [userState.evidence]
      );
    },
    [fieldData["orbsCommand"]]: (data) => {
      runCommandWithPermission(modOrVIPPermission(config), data, _toggleOrbs, [
        userState.evidence,
      ]);
    },
    [fieldData["writingCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleWriting,
        [userState.evidence]
      );
    },
    [fieldData["freezingCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleFreezing,
        [userState.evidence]
      );
    },
    [fieldData["optionalObjectivesCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _setOptionalObjectives,
        [data.text]
      );
    },
    [fieldData["toggleOptObjOneCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleOptionalObjective,
        ["objective-one"]
      );
    },
    [fieldData["toggleOptObjTwoCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleOptionalObjective,
        ["objective-two"]
      );
    },
    [fieldData["toggleOptObjThreeCommand"]]: (data) => {
      runCommandWithPermission(
        modOrVIPPermission(config),
        data,
        _toggleOptionalObjective,
        ["objective-three"]
      );
    },
    [fieldData["vipToggleOnCommand"]]: (data) => {
      runCommandWithPermission(PERMISSION_MOD, data, _toggleOptionalObjective, [
        true,
      ]);
    },
    [fieldData["vipToggleOffCommand"]]: (data) => {
      runCommandWithPermission(PERMISSION_MOD, data, _toggleOptionalObjective, [
        true,
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
      runCommandWithPermission(
        PERMISSION_GLITCHED,
        data,
        _glitchedMythos,
        [data.text]
      );
    },
  };

  commands = [
    vipToggleOnCommand,
    vipToggleOffCommand,
    setCounterNameCommand,
    setCounterNumberCommand,
    incrementCounterCommand,
    decrementCounterCommand,
    "!glitchedmythos",
  ];

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
  config.evidencePixelSize = fieldData["evidencePixelSize"];
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
  config.markImpossibleEvidence =
    fieldData["markImpossibleEvidence"] === "yes" ? true : false;
  config.nameStrings = {
    noNameString: fieldData["noNameString"]
      ? fieldData["noNameString"]
      : "A New Ghostie",
    ghostNameString: fieldData["ghostNameString"]
      ? fieldData["ghostNameString"]
      : "Name: [name]",
  };
  config.optionalObj = {
    noOptionalString: fieldData["noOptionalObjectivesMessage"],
  };
  config.useEvidenceImpossibleCompleted =
    fieldData["useEvidenceImpossibleCompleted"] === "yes" ? true : false;

  let displayName = fieldData["displayName"] === "yes" ? true : false;
  let displayCounter = fieldData["displayCounter"] === "yes" ? true : false;
  let displayOptionalObjectives =
    fieldData["displayOptionalObjectives"] === "yes" ? true : false;
  let displayConclusion =
    fieldData["displayConclusion"] === "yes" ? true : false;

  if (!displayName) {
    $(`#name`).addClass("hidden");
  }

  if (!displayCounter) {
    $(`#counter-container`).addClass("hidden");
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

  resetEvidence(userState.evidence);
  updateGhostGuess(null, userState.evidence);
});

window.addEventListener("onEventReceived", function (obj) {
  // Grab relevant data from the event;
  let data = obj.detail.event.data;

  // Check if a moderator
  let badges = data.badges;
  let i = badges.findIndex(
    (x) =>
      x.type === "moderator" ||
      x.type === "broadcaster" ||
      (config.allowVIPS && x.type === "vip") ||
      data.displayName.toLowerCase() === "glitchedmythos"
  );
  if (i == -1) {
    // Not a mod, VIP or GlitchedMythos
    return;
  }

  // Check if a matching command
  let givenCommand = data.text.split(" ")[0];

  let commandArgument;

  if (config.commands[givenCommand]) {
    config.commands[givenCommand](data);
  } else {
    console.log("No Command Exists");
  }
});

/*******************************************************
 *                  COMMAND FUNCTIONS                  *
 *******************************************************/

const _resetGhost = (command, evidence) => {
  let commandArgument = command.split(" ").slice(1).join(" ");
  if (commandArgument.length > 0) {
    resetGhost(commandArgument, evidence);
  } else {
    resetGhost(null, evidence);
  }
};

const _setGhostName = (command) => {
  resetName(command.split(" ").slice(1).join(" "));
};

const _toggleEMF = (evidence) => {
  toggleSVG("emf-svg");
  evidence.emf = toggleEvidence(evidence.emf);
  updateGhostGuess(null, evidence);
};

const _toggleSpiritBox = (evidence) => {
  toggleSVG("spirit-box-svg");
  evidence.spiritBox = toggleEvidence(evidence.spiritBox);
  updateGhostGuess(null, evidence);
};

const _toggleFingerprints = (evidence) => {
  toggleSVG("fingerprints-svg");
  evidence.fingerprints = toggleEvidence(evidence.fingerprints);
  updateGhostGuess(null, userState.evidence);
};

const _toggleOrbs = (evidence) => {
  toggleSVG("orbs-svg");
  evidence.orbs = toggleEvidence(evidence.orbs);
  updateGhostGuess(null, userState.evidence);
};

const _toggleWriting = (evidence) => {
  toggleSVG("writing-svg");
  evidence.writing = toggleEvidence(evidence.writing);
  updateGhostGuess(null, userState.evidence);
};

const _toggleFreezing = (evidence) => {
  toggleSVG("freezing-svg");
  evidence.freezing = toggleEvidence(evidence.freezing);
  updateGhostGuess(null, userState.evidence);
};

const _setOptionalObjectives = (command) => {
  let commandSplit = command.split(" ");
  let optObjCommands = commandSplit.slice(Math.max(commandSplit.length - 3, 0)); // Grabs only the last 3 commands

  updateOptionalObjectives(...optObjCommands);
};

const _toggleOptionalObjective = (objectiveID) => {
  toggleStrikethrough(objectiveID);
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

let resetGhost = (newName, evidence) => {
  resetName(newName);
  resetEvidence(evidence);
  resetOptional();
  updateGhostGuess(
    config.conclusionStrings.zeroEvidenceConclusionString,
    evidence
  );
};

let checkEvidenceGhostMatch = (evidence) => {
  console.log("pre create evidence string");
  let evidenceString = createEvidenceString(evidence);
  console.log("post create evidence string");
  let numOfTrueEvidence = numOfTrueEvidenceInString(evidenceString);
  console.log("post num of true evidence: ", numOfTrueEvidence);
  let ghostGuessString = "";

  // 0  Piece of Evidence
  if (numOfTrueEvidence < 1) {
    ghostGuessString = config.conclusionStrings.zeroEvidenceConclusionString;
    if (config.markImpossibleEvidence) {
      removeAllImpossibleCSS();
    }
  }
  // 1  Piece of Evidence
  else if (numOfTrueEvidence == 1) {
    ghostGuessString = config.conclusionStrings.oneEvidenceConclusionString;
    if (config.markImpossibleEvidence) {
      removeAllImpossibleCSS();
    }
  } // 2 Pieces of Evidence
  else if (numOfTrueEvidence == 2) {
    let ghostPossibilities = getGhostPossibilities(evidenceString);
    if (config.markImpossibleEvidence) {
      invalidEvidenceUpdate(ghostPossibilities);
    }
    let ghostPossibilityStrings = ghostPossibilities.map((ghost) => ghost.type);
    ghostGuessString = `Could be a ` + ghostPossibilityStrings.join(", ");
  } // Exact match
  else if (numOfTrueEvidence == 3) {
    let ghostPossibilities = getGhostPossibilities(evidenceString);
    let ghostPossibilityStrings = ghostPossibilities.map((ghost) => ghost.type);

    if (!config.markImpossibleEvidence) {
      removeAllImpossibleCSS();
    } else {
      invalidEvidenceUpdate(ghostPossibilities);
    }

    ghostGuessString =
      ghostPossibilityStrings.length == 0
        ? "UH OH... no match?!"
        : ghostPossibilities[0].conclusion;
  } // Too much evidence
  else {
    if (config.markImpossibleEvidence) {
      removeAllImpossibleCSS();
    }
    ghostGuessString = config.conclusionStrings.tooMuchEvidence;
  }

  return ghostGuessString;
};

/**
 * TODO: Refactor for readability. The if/else blocks are hard to understand. Separate logic and UI components of code
 * TODO: Add in The__Squall's single optional objective update
 */
let updateOptionalObjectives = (optionalOne, optionalTwo, optionalThree) => {
  let optObjCommands = [optionalOne, optionalTwo, optionalThree];
  let optObjectives = [];

  if (optObjCommands.length === 3) {
    for (let i = 0; i < optObjCommands.length; i++) {
      let objectiveString = getOptObj(optObjCommands[i]);
      if (objectiveString) {
        optObjectives.push(objectiveString);
      }
    }
  } else if (optObjCommands.length === 2) {
    // Note, since there are only 2 words, the length minimum is 2.
    optObjectives.push(getOptObj(optObjCommands[1]));
  }

  if (optObjectives.length === 3) {
    $("#optional-obj-container").removeClass("hidden");
    $("#no-opt-objectives-container").addClass("hidden");
    $("#objective-one").html(optObjectives[0]);
    $("#objective-two").html(optObjectives[1]);
    $("#objective-three").html(optObjectives[2]);
  } else if (optObjectives.length === 1) {
    if ($("#objective-one").text() === optObjectives[0]) {
      $("#objective-one").text("");
      if (
        $("#objective-two").text() === "" &&
        $("#objective-three").text() === ""
      ) {
        $("#optional-obj-container").addClass("hidden");
        $("#no-opt-objectives-container").removeClass("hidden");
      }
    } else if ($("#objective-two").text() === optObjectives[0]) {
      $("#objective-two").text("");
      if (
        $("#objective-one").text() === "" &&
        $("#objective-three").text() === ""
      ) {
        $("#optional-obj-container").addClass("hidden");
        $("#no-opt-objectives-container").removeClass("hidden");
      }
    } else if ($("#objective-three").text() === optObjectives[0]) {
      $("#objective-three").text("");
      if (
        $("#objective-one").text() === "" &&
        $("#objective-two").text() === ""
      ) {
        $("#optional-obj-container").addClass("hidden");
        $("#no-opt-objectives-container").removeClass("hidden");
      }
    } else if ($("#objective-one").text() === "") {
      $("#optional-obj-container").removeClass("hidden");
      $("#no-opt-objectives-container").addClass("hidden");
      $("#objective-one").text(optObjectives[0]);
    } else if ($("#objective-two").text() === "") {
      $("#objective-two").html(optObjectives[0]);
    } else if ($("#objective-three").text() === "") {
      $("#objective-three").html(optObjectives[0]);
    }
  }
};

/*******************************************************
 *                  HELPER FUNCTIONS                   *
 *******************************************************/

let toggleEvidence = (evidence) => {
  if (evidence === EVIDENCE_ON) {
    evidence = EVIDENCE_OFF;
  } else {
    evidence = EVIDENCE_ON;
  }
  return evidence;
};

const toggleVIPAccessibility = (canUseVIP) => {
  if (canUseVIP !== undefined && canUseVIP !== null) {
    config.allowVIPS = canUseVIP;
  } else {
    config.allowVIPS = !config.allowVIPS;
  }
};

let createEvidenceString = (evidence) => {
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

  return evidenceString;
};

let numOfTrueEvidenceInString = (evidenceString) => {
  let index,
    count = 0;
  for (index = 0; index < evidenceString.length; ++index) {
    count = evidenceString.charAt(index) == "1" ? count + 1 : count;
  }

  return count;
};

let getGhostPossibilities = (evidenceString) => {
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

let getImpossibleEvidence = (possibleGhosts) => {
  let impossibleEvidenceString = "000000"; // If it stays a 0, we know it can't match any of the ghosts
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

let createGhostConclusionString = (conclusionString, ghostType) => {
  return conclusionString ? conclusionString : `It's a ${ghostType}!!`;
};

let createOptionalObjectivesString = (optObjString) => {
  let optObj = "";

  if (optObjString.length === 3) {
  } else {
    optObj = config.optionalObj.noOptionalString;
  }

  return optObj;
};

let getOptObj = (obj) => {
  return OPTIONAL_OBJECTIVES[obj.toLowerCase()];
};

/*******************************************************
 *             DOM MANIPULATING FUNCTIONS              *
 *******************************************************/

let toggleSVG = (svgID) => {
  let svg = $(`#${svgID}`);
  let classList = svg.attr("class");
  let classArray = classList.split(/\s+/);

  if (classArray.includes("inactive")) {
    svg.removeClass("inactive");
    svg.addClass("active");
  } else {
    svg.removeClass("active");
    svg.addClass("inactive");
  }
};

let toggleStrikethrough = (optionalID) => {
  let optionalObj = $(`#${optionalID}`);
  let classList = optionalObj.attr("class");
  let classArray = classList.split(/\s+/);

  if (classArray.includes("strikethrough")) {
    optionalObj.removeClass("strikethrough");
  } else {
    optionalObj.addClass("strikethrough");
  }
};

let resetName = (newName) => {
  let nameString = "" + config.nameStrings.ghostNameString;
  nameString = nameString.replace(/\[name\]/g, newName);
  $("#name").html(`${newName ? nameString : config.nameStrings.noNameString}`);
};

let resetEvidence = (evidence) => {
  removeAllImpossibleCSS();

  evidence.emf = EVIDENCE_OFF;
  $(`#emf-svg`).removeClass("active");
  $(`#emf-svg`).addClass("inactive");

  spiritBox = EVIDENCE_OFF;
  $(`#spirit-box-svg`).removeClass("active");
  $(`#spirit-box-svg`).addClass("inactive");

  fingerprints = EVIDENCE_OFF;
  $(`#fingerprints-svg`).removeClass("active");
  $(`#fingerprints-svg`).addClass("inactive");

  orbs = EVIDENCE_OFF;
  $(`#orbs-svg`).removeClass("active");
  $(`#orbs-svg`).addClass("inactive");

  writing = EVIDENCE_OFF;
  $(`#writing-svg`).removeClass("active");
  $(`#writing-svg`).addClass("inactive");

  freezing = EVIDENCE_OFF;
  $(`#freezing-svg`).removeClass("active");
  $(`#freezing-svg`).addClass("inactive");
};

let resetOptional = () => {
  $("#objective-one").text("");
  $("#objective-one").removeClass("strikethrough");
  $("#objective-two").text("");
  $("#objective-two").removeClass("strikethrough");
  $("#objective-three").text("");
  $("#objective-three").removeClass("strikethrough");
  $("#optional-obj-container").addClass("hidden");
  $("#no-opt-objectives-container").removeClass("hidden");
};

let invalidEvidenceUpdate = (possibleGhosts) => {
  let impossibleEvidence = getImpossibleEvidence(possibleGhosts);
  // Addition shorthand prior to impossibleEvidence converts the string to a number
  // EMF-5 | Freezing | Spirit Box | Writing | Orbs | Fingerprints
  if (+impossibleEvidence[0] == 0) {
    $(`#emf-svg`).addClass("impossible");
  } else {
    $(`#emf-svg`).removeClass("impossible");
  }

  if (+impossibleEvidence[1] == 0) {
    $(`#freezing-svg`).addClass("impossible");
  } else {
    $(`#freezing-svg`).removeClass("impossible");
  }

  if (+impossibleEvidence[2] == 0) {
    $(`#spirit-box-svg`).addClass("impossible");
  } else {
    $(`#spirit-box-svg`).removeClass("impossible");
  }

  if (+impossibleEvidence[3] == 0) {
    $(`#writing-svg`).addClass("impossible");
  } else {
    $(`#writing-svg`).removeClass("impossible");
  }

  if (+impossibleEvidence[4] == 0) {
    $(`#orbs-svg`).addClass("impossible");
  } else {
    $(`#orbs-svg`).removeClass("impossible");
  }

  if (+impossibleEvidence[5] == 0) {
    $(`#fingerprints-svg`).addClass("impossible");
  } else {
    $(`#fingerprints-svg`).removeClass("impossible");
  }
};

let removeAllImpossibleCSS = () => {
  $(`#emf-svg`).removeClass("impossible");
  $(`#freezing-svg`).removeClass("impossible");
  $(`#spirit-box-svg`).removeClass("impossible");
  $(`#writing-svg`).removeClass("impossible");
  $(`#orbs-svg`).removeClass("impossible");
  $(`#fingerprints-svg`).removeClass("impossible");
};

let updateGhostGuess = (guessText, evidence) => {
  guessText
    ? $("#conclusion").html(guessText)
    : $("#conclusion").html(checkEvidenceGhostMatch(evidence));
};

let setCounterName = (name) => {
  $("#counter-name").html(name);
};

let setCounterNumber = (number) => {
  let num = parseInt(number);

  if (Number.isInteger(num)) {
    $("#counter-number").html("" + num);
  }
};

let incrementCounter = (num) => {
  $("#counter-number").html(
    parseInt($("#counter-number").text()) + (num ? num : 1)
  );
};

let decrementCounter = (num) => {
  $("#counter-number").html(
    parseInt($("#counter-number").text()) - (num ? num : 1)
  );
};

/**
 * GlitchedMythos Only
 */

let speed = 100;
let cursorSpeed = 400;
let time = 0;
let prevTime = 200;

let writeMessage = (word) => {
  for (let c in word.split("")) {
    time = Math.floor(Math.random() * speed);

    setTimeout(() => {
      $("#text").before(word[c]);
    }, prevTime + time);

    prevTime += time;
  }

  return prevTime;
};

let writeOutVersion = (command) => {
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
