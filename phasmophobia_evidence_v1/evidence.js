let commands,
  resetCommand,
  nameCommand,
  emfCommand,
  spiritBoxCommand,
  fingerprintsCommand,
  orbsCommand,
  writingCommand,
  freezingCommand,
  optionalObjectivesCommand,
  toggleOptObjOne,
  toggleOptObjTwo,
  toggleOptObjThree,
  vipToggleOnCommand,
  vipToggleOffCommand;

let emf,
  spiritBox,
  fingerprints,
  orbs,
  writing,
  freezing;

let greyOutInvalidEvidence;

let config = {};

// Order is important here:
// EMF-5 | Freezing | Spirit Box | Writing | Orbs | Fingerprints
let phantom = '110010',
  banshee = '110001',
  jinn = '101010',
  revenant = '100101',
  shade = '100110',
  oni = '101100',
  wraith = '011001',
  mare = '011010',
  yurei = '010110',
  poltergeist = '001011',
  spirit = '001101',
  demon = '011100';

window.addEventListener('onWidgetLoad', function (obj) {
  const fieldData = obj.detail.fieldData;
  console.log('the field data', fieldData)

  resetCommand = fieldData['resetCommand'];
  nameCommand = fieldData['nameCommand'];
  emfCommand = fieldData['emfCommand'];
  spiritBoxCommand = fieldData['spiritBoxCommand'];
  fingerprintsCommand = fieldData['fingerprintsCommand'];
  orbsCommand = fieldData['orbsCommand'];
  writingCommand = fieldData['writingCommand'];
  freezingCommand = fieldData['freezingCommand'];
  optionalObjectivesCommand = fieldData['optionalObjectivesCommand'];
  toggleOptObjOne = fieldData['toggleOptObjOne'];
  toggleOptObjTwo = fieldData['toggleOptObjTwo'];
  toggleOptObjThree = fieldData['toggleOptObjThree'];
  vipToggleOnCommand = fieldData['vipToggleOnCommand'];
  vipToggleOffCommand = fieldData['vipToggleOffCommand'];

  commands = [
    resetCommand,
    nameCommand,
    emfCommand,
    spiritBoxCommand,
    fingerprintsCommand,
    orbsCommand,
    writingCommand,
    freezingCommand,
    optionalObjectivesCommand,
    toggleOptObjOne,
    toggleOptObjTwo,
    toggleOptObjThree,
    vipToggleOnCommand,
    vipToggleOffCommand,
    '!version',
    '!glitchedMythos'
  ];

  greyOutInvalidEvidence = (fieldData['greyOutInvalidEvidence'] === 'yes') ? true : false;

  config.allowVIPS = (fieldData['allowVIPS'] === 'yes') ? true : false;
  config.vipCommandAccess = (config.allowVIPS) ? true : false;
  config.evidencePixelSize = fieldData['evidencePixelSize'];
  config.nameStrings = {
    noNameString: (fieldData['noNameString']) ?
      fieldData['noNameString'] : 'A New Ghostie',
    ghostNameString: (fieldData['ghostNameString']) ?
      fieldData['ghostNameString'] : 'Name: [name]'
  }
  config.optionalObj = {
    noOptionalString: fieldData['noOptionalObjectivesMessage']
  }
  config.conclusionStrings = {
    zeroEvidenceConclusionString: (fieldData['zeroEvidenceConclusionString']) ?
      fieldData['zeroEvidenceConclusionString'] : 'Waiting for Evidence',
    oneEvidenceConclusionString: (fieldData['oneEvidenceConclusionString']) ?
      fieldData['oneEvidenceConclusionString'] : 'Not sure yet...',
    tooMuchEvidence: (fieldData['impossibleConclusionString']) ?
      fieldData['impossibleConclusionString'] : 'Too Much Evidence'
  };
  config.ghosts = [
    {
      "type": 'Banshee',
      "conclusion": createGhostConclusionString(fieldData['bansheeString'], 'Banshee'),
      "evidence": '110001'
    }, {
      "type": "Demon",
      "conclusion": createGhostConclusionString(fieldData['demonString'], 'Demon'),
      "evidence": '011100'
    }, {
      "type": "Jinn",
      "conclusion": createGhostConclusionString(fieldData['jinnString'], 'Jinn'),
      "evidence": '101010'
    }, {
      "type": "Mare",
      "conclusion": createGhostConclusionString(fieldData['mareString'], 'Mare'),
      "evidence": '011010'
    }, {
      "type": "Oni",
      "conclusion": createGhostConclusionString(fieldData['oniString'], 'Oni'),
      "evidence": '101100'
    }, {
      "type": "Phantom",
      "conclusion": createGhostConclusionString(fieldData['phantomString'], 'Phantom'),
      "evidence": '110010'
    }, {
      "type": "Poltergeist",
      "conclusion": createGhostConclusionString(fieldData['poltergeistString'], 'Poltergeist'),
      "evidence": '001011'
    }, {
      "type": "Revenant",
      "conclusion": createGhostConclusionString(fieldData['revenantString'], 'Revenant'),
      "evidence": '100101'
    }, {
      "type": "Shade",
      "conclusion": createGhostConclusionString(fieldData['shadeString'], 'Shade'),
      "evidence": '100110'
    }, {
      "type": "Spirit",
      "conclusion": createGhostConclusionString(fieldData['spiritString'], 'Spirit'),
      "evidence": '001101'
    }, {
      "type": "Wraith",
      "conclusion": createGhostConclusionString(fieldData['wraithString'], 'Wraith'),
      "evidence": '011001'
    }, {
      "type": "Yurei",
      "conclusion": createGhostConclusionString(fieldData['yureiString'], 'Yurei'),
      "evidence": '010110'
    }
  ];

  let displayName = (fieldData['displayName'] === 'yes') ? true : false;
  let displayOptionalObjectives = (fieldData['displayOptionalObjectives'] === 'yes') ? true : false;
  let displayConclusion = (fieldData['displayConclusion'] === 'yes') ? true : false;

  if (!displayName) {
    $(`#name`).addClass('hidden');
  }

  if (!displayOptionalObjectives) {
    $(`#optional-obj`).addClass(`hidden`);
  }

  if (!displayConclusion) {
    $(`#conclusion`).addClass('hidden');
  }

  let useGradientBorder = (fieldData['useGradientBorder'] === 'yes') ? true : false;
  let useAnimatedBorder = (fieldData['useAnimatedBorder'] === 'yes') ? true : false;

  if (useGradientBorder) {
    $('#phas-dashboard').addClass('animated-box');

    if (useAnimatedBorder) {
      $('#phas-dashboard').addClass('in');
      $('#phas-dashboard').addClass('animated-box-300');
    } else {
      $('#phas-dashboard').addClass('animated-box-100');
    }
  } else {
    $('#phas-dashboard').addClass('phas-border');
  }


  resetEvidence();
  updateGhostGuess();
});

window.addEventListener('onEventReceived', function (obj) {
  console.log('the obj', obj);
  // Grab relevant data from the event;
  let data = obj.detail.event.data;

  // Check if a moderator
  let badges = data.badges;
  let i = badges.findIndex(x =>
    x.type === 'moderator' || x.type === 'broadcaster' || (config.allowVIPS && config.vipCommandAccess && x.type === 'vip'));
  if (i == -1) {
    console.log('Not a mod');
    return;
  }

  // Check if a matching command
  let givenCommand = data.text.split(' ')[0];
  if (!commands.includes(givenCommand)) {
    console.log('available commands: ', commands);
    console.log('No command match: ' + givenCommand)
    return;
  }

  console.log('COMMAND: ' + givenCommand);

  let newName;

  switch (givenCommand) {
    case "{{resetCommand}}":
      newName = data.text.split(' ').slice(1).join(' ');
      if (newName.length > 0) {
        resetGhost(newName);
      } else {
        resetGhost(null);
      }
      break;
    case "{{nameCommand}}":
      newName = data.text.split(' ').slice(1).join(' ');

      resetName(newName);

      break;
    case "{{emfCommand}}":
      toggleSVG('emf-svg');
      emf = !emf;
      updateGhostGuess();
      break;
    case "{{spiritBoxCommand}}":
      toggleSVG('spirit-box-svg');
      spiritBox = !spiritBox;
      updateGhostGuess();
      break;
    case "{{fingerprintsCommand}}":
      toggleSVG('fingerprints-svg');
      fingerprints = !fingerprints;
      updateGhostGuess();
      break;
    case "{{orbsCommand}}":
      toggleSVG('orbs-svg');
      orbs = !orbs;
      updateGhostGuess();
      break;
    case "{{writingCommand}}":
      toggleSVG('writing-svg');
      writing = !writing;
      updateGhostGuess();
      break;
    case "{{freezingCommand}}":
      toggleSVG('freezing-svg');
      freezing = !freezing;
      updateGhostGuess();
      break;
    case "{{optionalObjectivesCommand}}":
      updateOptionalObjectives(data.text);
      break;
    case "{{toggleOptObjOne}}":
      toggleStrikethrough("objective-one");
      break;
    case "{{toggleOptObjTwo}}":
      toggleStrikethrough("objective-two");
      break;
    case "{{toggleOptObjThree}}":
      toggleStrikethrough("objective-three");
      break;
    case "{{vipToggleOnCommand}}":
      if (x.type === 'moderator' || x.type === 'broadcaster') {
        config.vipCommandAccess = true;
      }
      break;
    case "{{vipToggleOffCommand}}":
      if (x.type === 'moderator' || x.type === 'broadcaster') {
        config.vipCommandAccess = false;
      }
      break;
    case "!version":
      $('#version').addClass('elementToFadeInAndOut');
      writeWord("Phas Widget Version 2.0\nAuthor: GlitchedMythos");
    /* setTimeout(() => {
      $('#version').removeClass('elementToFadeInAndOut');
    }, 5000); */
  }
});

let toggleSVG = (svgID) => {
  let svg = $(`#${svgID}`);
  let classList = svg.attr("class");
  let classArray = classList.split(/\s+/);

  if (classArray.includes('inactive')) {
    svg.removeClass('inactive');
    svg.addClass('active');
  } else {
    svg.removeClass('active');
    svg.addClass('inactive');
  }
}

let toggleStrikethrough = (optionalID) => {
  let optionalObj = $(`#${optionalID}`);
  let classList = optionalObj.attr("class");
  let classArray = classList.split(/\s+/);

  if (classArray.includes('strikethrough')) {
    optionalObj.removeClass('strikethrough');
  } else {
    optionalObj.addClass('strikethrough');
  }
}

let resetName = (newName) => {
  let nameString = '' + config.nameStrings.ghostNameString;
  nameString = nameString.replace(/\[name\]/g, newName);
  console.log('the new name string:', nameString, newName);
  $("#name").html(`${(newName) ? nameString : config.nameStrings.noNameString}`);
}

let resetEvidence = () => {
  removeAllImpossibleCSS();

  emf = false;
  $(`#emf-svg`).removeClass('active');
  $(`#emf-svg`).addClass('inactive');

  spiritBox = false;
  $(`#spirit-box-svg`).removeClass('active');
  $(`#spirit-box-svg`).addClass('inactive');

  fingerprints = false;
  $(`#fingerprints-svg`).removeClass('active');
  $(`#fingerprints-svg`).addClass('inactive');

  orbs = false;
  $(`#orbs-svg`).removeClass('active');
  $(`#orbs-svg`).addClass('inactive');

  writing = false;
  $(`#writing-svg`).removeClass('active');
  $(`#writing-svg`).addClass('inactive');

  freezing = false;
  $(`#freezing-svg`).removeClass('active');
  $(`#freezing-svg`).addClass('inactive');
}

let resetOptional = () => {
  $('#objective-one').removeClass('strikethrough');
  $('#objective-two').removeClass('strikethrough');
  $('#objective-three').removeClass('strikethrough');
  $('#optional-obj-container').addClass('hidden');
  $('#no-opt-objectives-container').removeClass('hidden');
}

let resetGhost = (newName) => {
  resetName(newName);
  resetEvidence();
  resetOptional();
  updateGhostGuess(config.conclusionStrings.zeroEvidenceConclusionString);
}

let numOfTrueEvidence = () => {
  let num = 0;

  if (emf) { num = num + 1; }
  if (spiritBox) { num = num + 1; }
  if (fingerprints) { num = num + 1; }
  if (orbs) { num = num + 1; }
  if (writing) { num = num + 1; }
  if (freezing) { num = num + 1; }

  return num;
}

let checkEvidenceGhostMatch = () => {
  let evidenceString = createEvidenceString();
  let numOfTrueEvidence = numOfTrueEvidenceInString(evidenceString);
  let ghostGuessString = '';

  // 0  Piece of Evidence
  if (numOfTrueEvidence < 1) {
    ghostGuessString = config.conclusionStrings.zeroEvidenceConclusionString;
    if (greyOutInvalidEvidence) { removeAllImpossibleCSS() }
  }
  // 1  Piece of Evidence
  else if (numOfTrueEvidence == 1) {
    ghostGuessString = config.conclusionStrings.oneEvidenceConclusionString;
    if (greyOutInvalidEvidence) { removeAllImpossibleCSS() }
  } // 2 Pieces of Evidence
  else if (numOfTrueEvidence == 2) {
    let ghostPossibilities = getGhostPossibilities(evidenceString);
    if (greyOutInvalidEvidence) {
      invalidEvidenceUpdate(ghostPossibilities);
    }
    let ghostPossibilityStrings = ghostPossibilities.map(ghost => ghost.type);
    console.log('the ghost possibiilties', ghostPossibilityStrings);
    ghostGuessString = `Could be a ` + ghostPossibilityStrings.join(', ');
  } // Exact match
  else if (numOfTrueEvidence == 3) {
    let ghostPossibilities = getGhostPossibilities(evidenceString);
    let ghostPossibilityStrings = ghostPossibilities.map(ghost => ghost.type);

    if (!greyOutInvalidEvidence) {
      removeAllImpossibleCSS()
    } else {
      invalidEvidenceUpdate(ghostPossibilities);
    }

    ghostGuessString = (ghostPossibilityStrings.length == 0) ?
      'UH OH... no match?!' :
      ghostPossibilities[0].conclusion;
  } // Too much evidence
  else {
    if (greyOutInvalidEvidence) { removeAllImpossibleCSS() }
    ghostGuessString = config.conclusionStrings.tooMuchEvidence;
  }

  return ghostGuessString;
}

let createEvidenceString = () => {
  let evidenceString = '';

  evidenceString = (emf) ? evidenceString + '1' : evidenceString + '0';
  evidenceString = (freezing) ? evidenceString + '1' : evidenceString + '0';
  evidenceString = (spiritBox) ? evidenceString + '1' : evidenceString + '0';
  evidenceString = (writing) ? evidenceString + '1' : evidenceString + '0';
  evidenceString = (orbs) ? evidenceString + '1' : evidenceString + '0';
  evidenceString = (fingerprints) ? evidenceString + '1' : evidenceString + '0';

  return evidenceString;
}

let numOfTrueEvidenceInString = (evidenceString) => {
  let index, count = 0;
  for (index = 0; index < evidenceString.length; ++index) {
    count = (evidenceString.charAt(index) == '1') ? count + 1 : count;
  }

  return count;
}

let getGhostPossibilities = (evidenceString) => {
  // List of ghosts returns [<evidenceString>, <Name>]
  const possibleGhosts = [];
  const numOfTrueEvidence = numOfTrueEvidenceInString(evidenceString);

  for (let i = 0; i < config.ghosts.length; i++) {
    let evidenceMatch = 0;
    let ghostToCheck = config.ghosts[i];
    console.log('Checking ', ghostToCheck.type, ghostToCheck.evidence);

    for (let j = 0; j < evidenceString.length; j++) {
      console.log(i, j);
      if (evidenceString.charAt(j) == '1') {
        if (evidenceString.charAt(j) == ghostToCheck.evidence.charAt(j)) {
          evidenceMatch = evidenceMatch + 1;
        }
        console.log('Have a true evidence', evidenceString.charAt(j), ghostToCheck.evidence.charAt(j), 'evidence: ', evidenceMatch, 'numtrue: ', numOfTrueEvidence);
      }
    }

    if (evidenceMatch == numOfTrueEvidence && evidenceMatch > 1) {
      possibleGhosts.push(config.ghosts[i]);
    }
  }

  console.log("ALL the possible ghosts: ", possibleGhosts);

  return possibleGhosts;
}

let invalidEvidenceUpdate = (possibleGhosts) => {
  let impossibleEvidence = getImpossibleEvidence(possibleGhosts);
  // Addition shorthand prior to impossibleEvidence converts the string to a number
  // EMF-5 | Freezing | Spirit Box | Writing | Orbs | Fingerprints
  if (+impossibleEvidence[0] == 0) {
    $(`#emf-svg`).addClass('impossible');
  } else {
    $(`#emf-svg`).removeClass('impossible');
  }

  if (+impossibleEvidence[1] == 0) {
    $(`#freezing-svg`).addClass('impossible');
  } else {
    $(`#freezing-svg`).removeClass('impossible');
  }

  if (+impossibleEvidence[2] == 0) {
    $(`#spirit-box-svg`).addClass('impossible');
  } else {
    $(`#spirit-box-svg`).removeClass('impossible');
  }

  if (+impossibleEvidence[3] == 0) {
    $(`#writing-svg`).addClass('impossible');
  } else {
    $(`#writing-svg`).removeClass('impossible');
  }

  if (+impossibleEvidence[4] == 0) {
    $(`#orbs-svg`).addClass('impossible');
  } else {
    $(`#orbs-svg`).removeClass('impossible');
  }

  if (+impossibleEvidence[5] == 0) {
    $(`#fingerprints-svg`).addClass('impossible');
  } else {
    $(`#fingerprints-svg`).removeClass('impossible');
  }
}

let removeAllImpossibleCSS = () => {
  $(`#emf-svg`).removeClass('impossible');
  $(`#freezing-svg`).removeClass('impossible');
  $(`#spirit-box-svg`).removeClass('impossible');
  $(`#writing-svg`).removeClass('impossible');
  $(`#orbs-svg`).removeClass('impossible');
  $(`#fingerprints-svg`).removeClass('impossible');
}

let getImpossibleEvidence = (possibleGhosts) => {
  let impossibleEvidenceString = '000000'; // If it stays a 0, we know it can't match any of the ghosts
  for (let i = 0; i < possibleGhosts.length; i++) {
    console.log('going through ghost', possibleGhosts[i].type)
    for (let k = 0; k < impossibleEvidenceString.length; k++) {
      console.log('values: ', `${+impossibleEvidenceString[k] + +possibleGhosts[i].evidence[k]}`, `${+impossibleEvidenceString[k]}`, `${+possibleGhosts[i].evidence[k]}`);
      impossibleEvidenceString = impossibleEvidenceString.substr(0, k) + `${+impossibleEvidenceString[k] + +possibleGhosts[i].evidence[k]}` + impossibleEvidenceString.substr(k + 1);
      impossibleEvidenceString[k] = `${+impossibleEvidenceString[k] + +possibleGhosts[i].evidence[k]}` // possibleGhosts[ghost][ghost evidence string][position in evidence string]
    }
  }
  return impossibleEvidenceString;
}

let updateGhostGuess = (guessText) => {
  (guessText) ? $('#conclusion').html('No clue... yet') : $('#conclusion').html(checkEvidenceGhostMatch());
}

let createGhostConclusionString = (conclusionString, ghostType) => {
  return (conclusionString) ? conclusionString : `It's a ${ghostType}!!`;
}

let createOptionalObjectivesString = (optObjString) => {
  let optObj = "";

  if (optObjString.length === 3) {

  } else {
    optObj = config.optionalObj.noOptionalString;
  }

  return optObj;
}

let updateOptionalObjectives = (command) => {
  let commandSplit = command.split(' ');
  let optObjCommands = commandSplit.slice(Math.max(commandSplit.length - 3, 0)); // Grabs only the last 3 commands

  let optObjectives = [];

  if (optObjCommands.length === 3) {
    for (let i = 0; i < optObjCommands.length; i++) {
      let objectiveString = getOptObj(optObjCommands[i]);
      if (objectiveString) {
        optObjectives.push(objectiveString);
      }
    }
  }

  console.log('OptionalObj: ', optObjCommands, optObjectives)

  if (optObjectives.length === 3) {
    $('#optional-obj-container').removeClass('hidden');
    $('#no-opt-objectives-container').addClass('hidden');
    $('#objective-one').html(optObjectives[0]);
    $('#objective-two').html(optObjectives[1]);
    $('#objective-three').html(optObjectives[2]);
  }
}

let getOptObj = (obj) => {
  let optObj = ""

  switch (obj.toLowerCase()) {
    case 'mo':
    case 'motion':
      optObj = "Motion"
      break;
    case 'sa':
    case `salt`:
      optObj = "Salt"
      break;
    case 'ph':
    case 'photo':
      optObj = "Photo"
      break;
    case 'ev':
    case 'event':
      optObj = "Event"
      break;
    case 'em':
    case 'emf':
      optObj = "EMF"
      break;
    case 'cr':
    case 'crucifix':
      optObj = "Crucifix"
      break;
    case 'sm':
    case 'smudge':
      optObj = "Smudge"
      break;
    case 'pa':
    case 'parabolic':
    case 'mic':
      optObj = "Parabolic"
      break;
    case 'es':
    case 'escape':
      optObj = "Escape"
      break;
    case 'hunt':
    case 'hu':
      optObj = "Smudge(Hunt)"
      break;
    case 'san':
    case 'sanity':
      optObj = "<25% Sanity"
      break;
    case 'ca':
    case 'candle':
      optObj = "Candle"
      break;
    default:
      break;
  }

  return optObj;
}

let speed = 300;
let cursorSpeed = 400;
let time = 0;
let prevTime = 0;

// Change this variable to change what gets typed
let text = 'Hello, world. I am a self-typing console. Change my `speed` variable in javascript to  increase or decrease the speed at which I type. Change the `text` variable to change what is typed.';

let writeWord = (word) => {
  for (let c in word.split('')) {
    time = Math.floor(Math.random() * speed);

    setTimeout(() => {
      $('#text').before(word[c]);
    }, (prevTime + time));

    prevTime += time;
  }
}
