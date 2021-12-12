# Welcome to Phasmophobia Evidence V3.6.0

# Updated for the Cursed Possessions Update!

## One Click Install Link:
https://strms.net/phasmophobia_widget_by_glitchedmythos 

I made this widget for anyone who uses StreamElements that plays Phasmophobia. To see how the widget works, please click the video below:

[![Video showing how to use and edit the widget](http://img.youtube.com/vi/stYhlKtzIv0/0.jpg)](https://youtu.be/stYhlKtzIv0)

# Example Commands

IF USING THE ONE CLICK INSTALL, THE DEFAULT GHOST RESET COMMAND IS `!ghostreset` AND THE DEFAULT NAME COMMAND IS `!ghostname`.

THESE CAN BE UPDATED MANUALLY BY CHANGING THE OPTION IN STREAMELEMENTS UNDER THE COMMANDS OPTION FOR THE WIDGET.

| Name | Command | Action |
|--|--|--|
| Name Reset | !gr | Reset the ghost |
| Name Reset| !gr "name" | Reset the ghost with the name |
| Name Input | !gn "name" | Change name to "name" |
| Name Input<br />(Stream Deck) | !gfn "name"<br />!gsn "name" | Change either first or last name to "name" |
| Map Input | !map "map" | Set the map name. Replace with a command from the [map list](#Map-Names-and-Difficulties) below |
| Difficulty Input | !diff "difficulty" | Set the map name. Replace with a command from the [map list](#Map-Names-and-Difficulties) below |
| Toggle Sightings | !sight "sighting" | Toggles Sightings for the Location On or Off, See [Sightings](#Sightings) |
| Toggle Possession | !poss "possession" | Toggles Possession found for the Location, Defaults to None displayed as ?, See [Cursed Possessions](#Cursed-Possessions) |
| Toggle EMF | !ge | Cycle EMF to next state: Off -> On -> Negative -> Off <br/> See below for advanced usage  |
| Toggle Spirit Box | !gs | Cycle Spirit Box to next state: Off -> On -> Negative -> Off <br/> See below for advanced usage |
| Toggle Fingerprints | !gf | Cycle Fingerprints to next state: Off -> On -> Negative -> Off <br/> See below for advanced usage |
| Toggle Orbs | !go | Cycle Orbs to next state: Off -> On -> Negative -> Off <br/> See below for advanced usage |
| Toggle Ghost Writing | !gw | Cycle Ghost Writing to next state: Off -> On -> Negative -> Off <br/> See below for advanced usage |
| Toggle Freezing Temps | !gt | Cycle Freezing Temps to next state: Off -> On -> Negative -> Off <br/> See below for advanced usage |
| Toggle Dots | !gd | Cycle Dots to next state: Off -> On -> Negative -> Off <br/> See below for advanced usage |
| Optional Objectives | !oo "a" "b" "c"<br />!oo "a" | Set the optional objectives. Replace a, b or c with the objective you'd like below, See [Optional Objectives](#Optional-Objectives) |
| Toggle Optional Objective 1 | !o1 | Toggles Optional Objective 1 from being marked or not |
| Toggle Optional Objective 2 | !o2 | Toggles Optional Objective 2 from being marked or not |
| Toggle Optional Objective 3 | !o3 | Toggles Optional Objective 3 from being marked or not |
| Set Counter Name | !setcounter "phrase"<br />!setcounter2 "phrase" | Set's the phrase before the number in the counter |
| Set Counter Number | !setcounternumber "num"<br />!setcounter2number "num" | Set's the number in the counter to the number input |
| Increment the counter by 1 | !counterup<br />!counter2up | Adds one to the counter number |
| Decrement the counter by 1 | !counterdown<br />!counter2down | Subtracts one from the counter number |

# Toggle Evidence Advanced Usage

You can manually set evidence using extra parameters

| Result | Argument |
|--|--|
| Turn Evidence On | "o" "on" |
| Turn Evidence Negative | "x" "n" "neg" "negative" |
| Turn Evidence Off | "f" "off" |

## Example Usage:

To turn emf on:

    !ge o
    !ge on

To turn ghost orbs to negative:

    !go x
    !go n
    !go neg
    !go negative

To turn fingerprints to off:

    !gf f
    !gf off

When using any of the ghost evidence commands without arguments, it will toggle to the next state:

Off -> On -> Negative -> Off -> On -> Negative -> Off -> etc.

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

# Sightings

| Sighting | Possible Phrases |
|--|--|
| Bone | "bone" "boner" |
| Slenderman | "slender" "slenderman" "man" |
| Dirty Water | "dirtywater" "dirty" "water" |

# Cursed Possession
| Possession | Possible Phrases |
|--|--|
|Tortured Voodoo Doll | "tortured voodoo doll" "voodoo doll" "voodoo" "doll" |
|Cursed Mirror| "mirror" |
|Music Box| "music box" "music" "box" |
|Summoning Circle| "summoning circle" "summoning" "summon" "circle" |
|Tarot Cards| "tarot cards" "tarot" "cards" |
|Ouija Board| "ouija board" "ouija" "board" |

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
| Willow | "wi" "will" "willow" |
| Edgefield | "ed" "edge" "edgefield" |
| Ridgeview | "ri" "ridge" "ridgeview" |
| Grafton | "gr" "grafton" |
| Bleasdale | "bl" "bleasdale" |
| High School | "hi" "hs" "high" "school" "brown" "brownstone" |
| Prison | "pr" "prison" |
| Asylum | "as" "asylum" |
| Maple Lodge | "ma" "maple" "camp" "campsite" |

| Difficulty | Possible Phrases |
|--|--|
| Amateur | "a" "am" "amateur" |
| Intermediate | "i" "int" "intermediate" |
| Professional | "p" "pro" "professional" |
| Nightmare | "n" "ni" "night" "nightmare" |

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
