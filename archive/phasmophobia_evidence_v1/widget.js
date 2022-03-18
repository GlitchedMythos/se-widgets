let commands,
  resetCommand,
  nameCommand,
  emfCommand,
  spiritBoxCommand,
  fingerprintsCommand,
  orbsCommand,
  writingCommand,
  freezingCommand;

let emf,
  spiritBox,
  fingerprints,
  orbs,
  writing,
  freezing;

let greyOutInvalidEvidence;

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
  spirit = '001101';
demon = '011100';

let ghosts = [
  [phantom, 'Phantom'],
  [banshee, 'Banshee'],
  [jinn, 'Jinn'],
  [revenant, 'Revenant'],
  [shade, 'Shade'],
  [oni, 'Oni'],
  [wraith, 'Wraith'],
  [mare, 'Mare'],
  [yurei, 'Yurei'],
  [poltergeist, 'Poltergeist'],
  [spirit, 'Spirit'],
  [demon, 'Demon']
];

window.addEventListener('onWidgetLoad', function (obj) {
  const fieldData = obj.detail.fieldData;
  resetCommand = fieldData['resetCommand'];
  nameCommand = fieldData['nameCommand'];
  emfCommand = fieldData['emfCommand'];
  spiritBoxCommand = fieldData['spiritBoxCommand'];
  fingerprintsCommand = fieldData['fingerprintsCommand'];
  orbsCommand = fieldData['orbsCommand'];
  writingCommand = fieldData['writingCommand'];
  freezingCommand = fieldData['freezingCommand'];
  greyOutInvalidEvidence = fieldData['greyOutInvalidEvidence'];

  commands = [
    resetCommand,
    nameCommand,
    emfCommand,
    spiritBoxCommand,
    fingerprintsCommand,
    orbsCommand,
    writingCommand,
    freezingCommand
  ];
  
  let displayName = fieldData['displayName'];
  let displayConclusion = fieldData['displayConclusion'];
  
  if (!displayName) {
   $(`#name`).addClass('hidden');
  }
  
  if (!displayConclusion) {
   $(`#conclusion`).addClass('hidden'); 
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
    x.type === 'moderator' || x.type === 'broadcaster');
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

  let evidenceText;
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

      $("#name").html(`Name: ${newName}`);
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

let resetName = (newName) => {
  $("#name").html(`${(newName) ? `Name: ${newName}` : 'New Ghost...'}`);
}

let resetGhost = (newName) => {
  resetName(newName);
  resetEvidence();
  updateGhostGuess('No clue... yet');
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
  console.log('THE EVIDENCE STRING', evidenceString);
  let numOfTrueEvidence = numOfTrueEvidenceInString(evidenceString);
  let ghostGuessString = '';

  if (numOfTrueEvidence < 2) {
    ghostGuessString = 'Not sure yet...';
    if (greyOutInvalidEvidence) { removeAllImpossibleCSS() }
  } else if (numOfTrueEvidence == 2) {
    let ghostPossibilities = getGhostPossibilities(evidenceString);
    if (greyOutInvalidEvidence) {
      invalidEvidenceUpdate(evidenceString, ghostPossibilities);
    }
    let ghostPossibilityStrings = ghostPossibilities.map(ghost => ghost[1]);
    console.log('the ghost possibiilties', ghostPossibilityStrings);
    ghostGuessString = `Could be a ` + ghostPossibilityStrings.join(', ');
  } else if (numOfTrueEvidence == 3) {
    if (greyOutInvalidEvidence) { removeAllImpossibleCSS() }
    let ghostPossibilities = getGhostPossibilities(evidenceString);
    let ghostPossibilityStrings = ghostPossibilities.map(ghost => ghost[1]);
    ghostGuessString = (ghostPossibilityStrings.length == 0) ?
      'UH OH... no match?!' :
      `It's a ${ghostPossibilities[0][1]}!!`;
  } else {
    if (greyOutInvalidEvidence) { removeAllImpossibleCSS() }
    ghostGuessString = 'IMPOSSIBRUUUU';
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

  for (let i = 0; i < ghosts.length; i++) {
    let evidenceMatch = 0;
    console.log('GHOST: ', ghosts[i]);
    for (let j = 0; j < evidenceString.length; j++) {
      if (evidenceString.charAt(j) == '1') {
        if (evidenceString.charAt(j) == ghosts[i][0].charAt(j)) {
          evidenceMatch = evidenceMatch + 1;
        }
      }
    }
    if (evidenceMatch == numOfTrueEvidence && evidenceMatch > 1) {
      possibleGhosts.push(ghosts[i]);
    }
  }

  console.log("ALL the possible ghosts: ", possibleGhosts);

  return possibleGhosts;
}

let invalidEvidenceUpdate = (evidenceString, possibleGhosts) => {
  let impossibleEvidence = getImpossibleEvidence(possibleGhosts);
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
    console.log('going through ghost', possibleGhosts[i])
    for (let k = 0; k < impossibleEvidenceString.length; k++) {
      console.log('values: ', `${+impossibleEvidenceString[k] + +possibleGhosts[i][0][k]}`, `${+impossibleEvidenceString[k]}`, `${+possibleGhosts[i][0][k]}`);
      impossibleEvidenceString = impossibleEvidenceString.slice(0, k) + `${+impossibleEvidenceString[k] + +possibleGhosts[i][0][k]}` + impossibleEvidenceString.slice(k + 1);
      impossibleEvidenceString[k] = `${+impossibleEvidenceString[k] + +possibleGhosts[i][0][k]}` // possibleGhosts[ghost][ghost evidence string][position in evidence string]
    }
  }
  console.log(impossibleEvidenceString);
  return impossibleEvidenceString;
}

let updateGhostGuess = (guessText) => {
  (guessText) ? $('#conclusion').html('No clue... yet') : $('#conclusion').html(checkEvidenceGhostMatch());
}








