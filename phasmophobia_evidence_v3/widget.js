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
  vipToggleOffCommand,
  setCounterNameCommand,
  setCounterNumberCommand,
  incrementCounterCommand,
  decrementCounterCommand;

let emf,
  spiritBox,
  fingerprints,
  orbs,
  writing,
  freezing;

let counter;

// TODO: Move to config
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
  demon = '011100',
  yokai = '001110',
  hantu = '000111';

let channelName;

window.addEventListener('onWidgetLoad', function (obj) {
  channelName = obj["detail"]["channel"]["username"];

  const fieldData = obj.detail.fieldData;

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
  setCounterNameCommand = fieldData['setCounterNameCommand'];
  setCounterNumberCommand = fieldData['setCounterNumberCommand'];
  incrementCounterCommand = fieldData['incrementCounterCommand'];
  decrementCounterCommand = fieldData['decrementCounterCommand'];

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
    setCounterNameCommand,
    setCounterNumberCommand,
    incrementCounterCommand,
    decrementCounterCommand,
    '!glitchedmythos'
  ];

  greyOutInvalidEvidence = (fieldData['greyOutInvalidEvidence'] === 'yes') ? true : false;

  config.allowVIPS = (fieldData['allowVIPS'] === 'yes') ? true : false;
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
      "evidence": banshee
    }, {
      "type": "Demon",
      "conclusion": createGhostConclusionString(fieldData['demonString'], 'Demon'),
      "evidence": demon
    }, {
      "type": "Hantu",
      "conclusion": createGhostConclusionString(fieldData['hantuString'], 'Hantu'),
      "evidence": hantu
    }, {
      "type": "Jinn",
      "conclusion": createGhostConclusionString(fieldData['jinnString'], 'Jinn'),
      "evidence": jinn
    }, {
      "type": "Mare",
      "conclusion": createGhostConclusionString(fieldData['mareString'], 'Mare'),
      "evidence": mare
    }, {
      "type": "Oni",
      "conclusion": createGhostConclusionString(fieldData['oniString'], 'Oni'),
      "evidence": oni
    }, {
      "type": "Phantom",
      "conclusion": createGhostConclusionString(fieldData['phantomString'], 'Phantom'),
      "evidence": phantom
    }, {
      "type": "Poltergeist",
      "conclusion": createGhostConclusionString(fieldData['poltergeistString'], 'Poltergeist'),
      "evidence": poltergeist
    }, {
      "type": "Revenant",
      "conclusion": createGhostConclusionString(fieldData['revenantString'], 'Revenant'),
      "evidence": revenant
    }, {
      "type": "Shade",
      "conclusion": createGhostConclusionString(fieldData['shadeString'], 'Shade'),
      "evidence": shade
    }, {
      "type": "Spirit",
      "conclusion": createGhostConclusionString(fieldData['spiritString'], 'Spirit'),
      "evidence": spirit
    }, {
      "type": "Wraith",
      "conclusion": createGhostConclusionString(fieldData['wraithString'], 'Wraith'),
      "evidence": wraith
    }, {
      "type": "Yokai",
      "conclusion": createGhostConclusionString(fieldData['yokaiString'], 'Yokai'),
      "evidence": yokai
    }, {
      "type": "Yurei",
      "conclusion": createGhostConclusionString(fieldData['yureiString'], 'Yurei'),
      "evidence": yurei
    }
  ];

  let displayName = (fieldData['displayName'] === 'yes') ? true : false;
  let displayCounter = (fieldData['displayCounter'] === 'yes') ? true : false;
  let displayOptionalObjectives = (fieldData['displayOptionalObjectives'] === 'yes') ? true : false;
  let displayConclusion = (fieldData['displayConclusion'] === 'yes') ? true : false;

  if (!displayName) {
    $(`#name`).addClass('hidden');
  }

  if (!displayCounter) {
    $(`#counter-container`).addClass('hidden');
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
  // Grab relevant data from the event;
  let data = obj.detail.event.data;

  // Check if a moderator
  let badges = data.badges;
  let i = badges.findIndex(x =>
    x.type === 'moderator' || 
    x.type === 'broadcaster' || 
    (config.allowVIPS && x.type === 'vip') || 
    data.displayName.toLowerCase() === 'glitchedmythos');
  if (i == -1) {
    // Not a mod, VIP or GlitchedMythos
    return;
  }

  // Check if a matching command
  let givenCommand = data.text.split(' ')[0];
  if (!commands.includes(givenCommand)) {
    // No matching command
    return;
  }

  let commandArgument;

  switch (givenCommand) {
    case "{{resetCommand}}":
      commandArgument = data.text.split(' ').slice(1).join(' ');
      if (commandArgument.length > 0) {
        resetGhost(commandArgument);
      } else {
        resetGhost(null);
      }
      break;
    case "{{nameCommand}}":
      commandArgument = data.text.split(' ').slice(1).join(' ');

      resetName(commandArgument);
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
        config.allowVIPS = true;
      }
      break;
    case "{{vipToggleOffCommand}}":
      if (x.type === 'moderator' || x.type === 'broadcaster') {
        config.allowVIPS = false;
      }
      break;
    case "{{setCounterNameCommand}}":
      commandArgument = data.text.split(' ').slice(1).join(' ');
      setCounterName(commandArgument);
      break;
    case "{{setCounterNumberCommand}}":
      commandArgument = data.text.split(' ').slice(1).join(' ');
      setCounterNumber(commandArgument);
      break;
    case "{{incrementCounterCommand}}":
      incrementCounter();
      break;
    case "{{decrementCounterCommand}}":
      decrementCounter();
      break;
    case "!glitchedmythos":
      if (data.displayName.toLowerCase() === 'glitchedmythos') {
        commandArgument = data.text.split(' ').slice(1).join(' ');
  
        if (commandArgument) {
          writeOutVersion(commandArgument);
        } else {
          writeOutVersion(`Hello GlitchedMythos. Thank you for creating me. I am version 2.1 of your widget. I think everyone should check you out at twitch.tv/glitchedmythos. Also ${channelName} is absolutely AMAZING!`)
        }
      }
      break;
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
  $('#objective-one').text("");
  $('#objective-one').removeClass('strikethrough');
  $('#objective-two').text("");
  $('#objective-two').removeClass('strikethrough');
  $('#objective-three').text("");
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

    for (let j = 0; j < evidenceString.length; j++) {
      if (evidenceString.charAt(j) == '1') {
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
    for (let k = 0; k < impossibleEvidenceString.length; k++) {
      impossibleEvidenceString = impossibleEvidenceString.substr(0, k) + `${+impossibleEvidenceString[k] + +possibleGhosts[i].evidence[k]}` + impossibleEvidenceString.substr(k + 1);
      impossibleEvidenceString[k] = `${+impossibleEvidenceString[k] + +possibleGhosts[i].evidence[k]}` // possibleGhosts[ghost][ghost evidence string][position in evidence string]
    }
  }
  return impossibleEvidenceString;
}

let updateGhostGuess = (guessText) => {
  (guessText) ? $('#conclusion').html(guessText) : $('#conclusion').html(checkEvidenceGhostMatch());
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
  else if (optObjCommands.length === 2) { // Note, since there are only 2 words, the length minimum is 2.
    optObjectives.push(getOptObj(optObjCommands[1]));
  }

  if (optObjectives.length === 3) {
    $('#optional-obj-container').removeClass('hidden');
    $('#no-opt-objectives-container').addClass('hidden');
    $('#objective-one').html(optObjectives[0]);
    $('#objective-two').html(optObjectives[1]);
    $('#objective-three').html(optObjectives[2]);
  }
  else if (optObjectives.length === 1) {
    if ($('#objective-one').text() === optObjectives[0]) {
      $('#objective-one').text("");
      if (($('#objective-two').text() === "") && ($('#objective-three').text() === "")) {
        $('#optional-obj-container').addClass('hidden');
        $('#no-opt-objectives-container').removeClass('hidden');
      }
    }
    else if ($('#objective-two').text() === optObjectives[0]) {
      $('#objective-two').text("");
      if (($('#objective-one').text() === "") && ($('#objective-three').text() === "")) {
        $('#optional-obj-container').addClass('hidden');
        $('#no-opt-objectives-container').removeClass('hidden');
      }
    }
    else if ($('#objective-three').text() === optObjectives[0]) {
      $('#objective-three').text("");
      if (($('#objective-one').text() === "") && ($('#objective-two').text() === "")) {
        $('#optional-obj-container').addClass('hidden');
        $('#no-opt-objectives-container').removeClass('hidden');
      }
    }
    else if ($('#objective-one').text() === "") {
      $('#optional-obj-container').removeClass('hidden');
      $('#no-opt-objectives-container').addClass('hidden');
      $('#objective-one').text(optObjectives[0]);
    }
    else if ($('#objective-two').text() === "") {
      $('#objective-two').html(optObjectives[0]);
    }
    else if ($('#objective-three').text() === "") {
      $('#objective-three').html(optObjectives[0]);
    }
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

let setCounterName = (name) => {
  $('#counter-name').html(name);
}

let setCounterNumber = (number) => {
  let num = parseInt(number);

  if (Number.isInteger(num)) {
    $('#counter-number').html('' + num);
  }
}

let incrementCounter = (num) => {
  $('#counter-number').html(parseInt($('#counter-number').text()) + (num ? num : 1));
}

let decrementCounter = (num) => {
  $('#counter-number').html(parseInt($('#counter-number').text()) - (num ? num : 1));
}

/**
 * GlitchedMythos Only
 */

let speed = 100;
let cursorSpeed = 400;
let time = 0;
let prevTime = 200;

let writeMessage = (word) => {
  for (let c in word.split('')) {
    time = Math.floor(Math.random() * speed);

    setTimeout(() => {
      $('#text').before(word[c]);
    }, (prevTime + time));

    prevTime += time;
  }

  return prevTime;
}

let writeOutVersion = (command) => {
  $('#version').addClass('show-version-item');
  setTimeout(() => {
    let time = writeMessage(command);
    setTimeout(() => {
      $('#version').removeClass('show-version-item')
      prevTime = 0;
      time = 0;
      setTimeout(() => {
        $('#console-container').empty();
        $('#console-container').append($(`<span class="prompt">>  </span>`));
        $('#console-container').append($(`<div id="text"></div>`));
        $('#console-container').append($(`<div class="cursor"></div>`));
      }, 2000)
    }, time + 2000)
  }, 1000);
}
