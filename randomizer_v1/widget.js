const listOfPhasItems = [
  "Spirit Box",
  "Ghost Writing Book",
  "EMF Reader",
  "Video Camera",
  "UV Flashlight",
  "Candle",
  "Crucifix",
  "Glow Stick",
  "Head Mounted Camera",
  "Infrared Light Sensor",
  "Motion Sensor",
  "Parabolic Microphone",
  "Salt Shaker",
  "Sanity Pills",
  "Smudge Sticks",
  "Sound Sensor",
  "Thermometer",
  "Tripod",
];

let currentPhasList = [...listOfPhasItems];

window.addEventListener("onEventReceived", function (obj) {
  // Grab relevant data from the event;
  let data = obj.detail.event.data;

  // Check if a moderator
  let badges = data.badges;
  let i = badges.findIndex(
    (x) =>
      x.type === "moderator" ||
      x.type === "broadcaster" ||
      (config.allowVIPS && config.vipCommandAccess && x.type === "vip") ||
      data.displayName.toLowerCase() === "glitchedmythos"
  );
  if (i == -1) {
    // Not a mod, VIP or GlitchedMythos
    return;
  }

  // Check if a matching command
  let givenCommand = data.text.split(" ")[0];
  let commandArgument = data.text.split(" ").slice(1).join(" ");

  switch (givenCommand) {
    case "!nextitem":
      nextItem();
      break;
    case "!resetitems":
      resetItems();
      break;
  }
});

const nextItem = () => {
  if(isEmpty($("#items-container"))) {
      $("#items-container").removeClass("hidden");
  }
  console.log('next item');
  let item = currentPhasList.splice(
    Math.floor(Math.random() * currentPhasList.length),
    1
  );

  if (currentPhasList.length < 1) {
      // DO nothing
  } else {
    const newItem = $.parseHTML(
      `
            <div class="object flex items-center justify-center flex-col animate__animated animate__backInRight">
              <div class="text-center">
                  ${item}
              </div>
            </div>
          `
    );
    $("#items-container").append(newItem);
  }
};

const resetItems = () => {
  currentPhasList = [...listOfPhasItems];
  $("#items-container").addClass("animate__animated");
  $("#items-container").addClass("animate__hinge");

  setTimeout(() => {
    $("#items-container").empty();
    $("#items-container").removeClass("animate__animated");
    $("#items-container").removeClass("animate__hinge");
    $("#items-container").addClass("hidden");
  }, 2000);
};

function isEmpty( el ){
    return !$.trim(el.html())
}