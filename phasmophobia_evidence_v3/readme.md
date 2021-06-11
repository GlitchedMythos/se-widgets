# Welcome to Phasmophobia Evidence V3.0

I made this widget for anyone who uses StreamElements that plays Phasmophobia. To see how the widget works, please click the video below:

[![Video showing how to use and edit the widget](http://img.youtube.com/vi/stYhlKtzIv0/0.jpg)](https://youtu.be/stYhlKtzIv0)

# Example Commands

| Name | Command | Action |
|--|--|--|
| Name Reset | !gr | Reset the ghost |
| Name Reset| !gr "name" | Reset the ghost with the name |
| Name Input | !gn "name" | Change name to "name" |
| Name Input<br />(Stream Deck) | !gfn "name"<br />!gsn "name" | Change either first or last name to "name" |
| Map Input | !gm "map" | Set the map name. Replace with a command from the map list below |
| Difficulty Input | !gd "difficulty" | Set the map name. Replace with a command from the map list below |
| Toggle Bone | !boner | Change Bone to opposite of current state |
| Toggle Ouija | !ouija | Change Ouija to opposite of current state |
| Toggle EMF | !ge | Change EMF to opposite of current state |
| Toggle Spirit Box | !gs | Change Spirit Box to opposite of current state |
| Toggle Fingerprints | !gf | Change Fingerprints to opposite of current state |
| Toggle Orbs | !go | Change Ghost Orbs to opposite of current state |
| Toggle Ghost Writing | !gw | Change Ghost Writing to opposite of current state |
| Toggle Freezing Temps | !gt | Change Freezing Temps to opposite of current state |
| Optional Objectives | !oo "a" "b" "c"<br />!oo "a" | Set the optional objectives. Replace a, b or c with the objective you'd like below |
| Toggle Optional Objective 1 | !o1 | Toggles Optional Objective 1 from being marked or not |
| Toggle Optional Objective 2 | !o2 | Toggles Optional Objective 2 from being marked or not |
| Toggle Optional Objective 3 | !o3 | Toggles Optional Objective 3 from being marked or not |
| Set Counter Name | !setcounter "phrase" | Set's the phrase before the number in the counter |
| Set Counter Number | !setcounternumber "num" | Set's the number in the counter to the number input |
| Increment the counter by 1 | !counterup | Adds one to the counter number |
| Decrement the counter by 1 | !counterdown | Subtracts one from the counter number |

# Optional Objectives

| Objective | Possible Phrases |
|--|--|
| Motion Sensor | "mo" "motion" |
| Salt | "sa" "salt" |
| Photo | "ph" "photo" |
| Event | "ev" "event" |
| EMF | "em" "emf" |
| Crucifix | "cr" "crucifix" |
| Smudge Ghost (NON-Hunt) | "sm" "smudge" |
| Escape | "es" "escape" |
| Smudge Ghost (During Hunt) | "hu" "hunt" |
| Repel Ghost (During Hunt) - smudge during hunt | "re" "repel" |
| <25% Sanity | "san "sanity" |
| Candle | "ca" "candle" |

## Example Usage:

To get `Salt Photo Event`

    !oo sa ph ev

To get `Crucifix Motion Salt`

    !oo cr motion sa

Individual Objectives can be used and can be toggled on and off

To get `Smudge`

    !oo sm

# Map Names and Difficulties

| Map | Possible Phrases |
|--|--|
| Tanglewood | "ta" "tangle" "tanglewood" |
| Edgefield | "ed" "edge" "edgefield" |
| Ridgeview | "ri" "ridge" "ridgeview" |
| Grafton | "gr" "grafton" |
| Bleasdale | "bl" "bleasdale" |
| High School | "hi" "hs" "high" "school" "brown" "brownstone" |
| Prison | "pr" "prison" |
| Asylum | "as" "asylum" |

| Difficulty | Possible Phrases |
|--|--|
| Amateur | "a" "am" "amateur" |
| Intermediate | "i" "int" "intermediate" |
| Professional | "p" "pro" "professional" |

## Example Usage:

To get `Grafton Farmhouse`

    !gm gr

To get `Brownstone High School`

    !gm school

To get `Professional` Difficulty

    !gd pro

Both Map and Difficulty can be combined in one map command

To get `Asylum Intermediate`

    !gm as i

# How to Add to StreamElements?!?

1. Create a Brand New Overlay
2. Add a new Widget and select "Static/Custom" followed by Custom Widget
3. Select the Widget under Layers on the left. Select Open Editor. This will give you a code screen with several tabs. DON'T BE SCARED. For each tab, delete everything that exists and paste the related content from the files listed in this folder into the editor and save.

NOTE: 

html -> html

css -> css

js -> js

json -> fields

data -> Input just -> { }
