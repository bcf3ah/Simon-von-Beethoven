$(document).ready(function() {
  // Initialize collapse button
  $(".button-collapse").sideNav();

  //Map divs to integers
  var map = {
    1: ".one",
    2: ".two",
    3: ".three",
    4: ".four"
  };

  //Initialize sounds via HowlerJS
  var sound1 = new Howl({
    src: ["https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"]
  });

  var sound2 = new Howl({
    src: ["https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"]
  });

  var sound3 = new Howl({
    src: ["https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"]
  });

  var sound4 = new Howl({
    src: ["https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"]
  });

  var alarm = new Howl({
    src: ["https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg"]
  });

  var win = new Howl({
    src: ["https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg"]
  });

  //Define click events for each key
  $(".one").mousedown(function() {
    sound1.play();
  });

  $(".two").mousedown(function() {
    sound2.play();
  });

  $(".three").mousedown(function() {
    sound3.play();
  });

  $(".four").mousedown(function() {
    sound4.play();
  });

  //Setup listening mode for when player should press keys
  var listeningMode = false;

  //set interval between computer generated sounds to a variable so we can easily change it after certain levels
  var interval = 750;

  //declare array to hold computer generated sequence;
  var sequence = [];

  //declare variable for current level
  var level = 0;

  //setup strictMode variable
  var strictMode = false;

  //setup variable for difficulty.
  var hardDifficulty = false;

  //setup variable to keep track of how many clicks the user has...well, clicked.Then will compare it to the sequence array via index
  var click = 0;

  //define function that returns 1-4 randomly to get the next computer generated sound in the sequence
  function getNextSound() {
    return Math.floor(Math.random() * 4) + 1;
  }

  function playSequence(i) {
    setTimeout(function() {
      //get the current sound number
      var num = sequence[i];
      //find the corresponding div
      var div = map[num];
      //play that div's sound
      $(div).trigger("mousedown");
      //activate the triggered class for color effects
      var triggerClass = div.substr(1) + "Triggered";
      $(div).toggleClass(triggerClass);
      //remove the class now after a slight delay so we see it
      setTimeout(() => {
        $(div).toggleClass(triggerClass);
      }, 300);
      i++;
      if (i < sequence.length) {
        // If i is less than the length of sequence, keep going
        playSequence(i); // Call the loop again, and pass it the current value of i
      }
    }, interval);

    //reset click to 0
    click = 0;

    //turn on listeningMode
    listeningMode = true;
  }

  //define reset function
  function reset(){
     //player shouldn't click anything yet
    listeningMode = false;
    click = 0;
    level = 0;
    $("#level").text('--');
    //Clear the sequence and start COMPLETELY from scratch because we are in strict mode baby.
    sequence = [];
    $("#startButton").addClass('pulse');
  }

  //create next sequence if user passed the level
  function nextSequence() {
    //get the next sound, push it into the sequence array
    var nextSound = getNextSound();
    sequence.push(nextSound);

    //increment the level
    level++;
    $("#level").text(level);

    //Now play the sequence!
    playSequence(0);
  }

  //define function for handling incorrect clicks in unstrict mode
  function incorrectUnstrict() {
    alarm.play();
    $(".one, .two, .three, .four").toggleClass("incorrect");
    setTimeout(() => {
      $(".one, .two, .three, .four").toggleClass("incorrect");
    }, 800);

    listeningMode = false;
    //play the current sequence again from the beginning
    setTimeout(() => {
      playSequence(0);
    }, 1500);
  }

  //define function for handling incorrect clicks in strict mode
  function incorrectStrict() {
    alarm.play();
    $(".one, .two, .three, .four").toggleClass("incorrect");
    setTimeout(() => {
      $(".one, .two, .three, .four").toggleClass("incorrect");
    }, 800);

    //player shouldn't click anything yet
    listeningMode = false;

    //reset level
    level = 0;
    $("#level").text('--');
    //Clear the sequence and start COMPLETELY from scratch because we are in strict mode baby.
    sequence = [];
    setTimeout(() => {
      nextSequence();
    }, 1500);
  }

  //setup listeningMode for player
  $("#piano-container").click(e => {
    if (listeningMode) {
      //see which key the user clicked
      var id = +e.target.id;
      //compare it to the current index in sequence. If different, run incorrect function  for unstrict for now...
      if (id !== sequence[click]) {
        //if strict mode is on, call incorrectStrict. Else call incorrectUnstrict
        if (strictMode) {
          incorrectStrict();
        } else {
          incorrectUnstrict();
        }
      } else {
        //if click is equal to the last index of sequence - ie its the last key to press - then call nextSequence again. Otherwise increment the click
        if (click === sequence.length - 1) {
          //if player reaches level twenty, he wins
          if (level === 20) {
            win.play();
            setTimeout(() => {
              reset();
            }, 3000)
          } else {
            setTimeout(() => {
              listeningMode = false;
              nextSequence();
            }, 1000);
          }
        } else {
          if(level >= 5){
            interval = 600;
            if(level >= 9){
              interval = 500;
              if(level >=13){
                interval = 450;
              }
            }
          }
          click++;
        }
      }
    }
  });

  //listen for if the user wants to enable strict mode
  $("#strictMode").click(() => {
    strictMode = !strictMode;
    console.log("Strict mode is now: ", strictMode);
  });

  //listen for if the user wants to ramp up the difficulty
  $("#difficulty").click(() => {
    hardDifficulty = !hardDifficulty;
    if (hardDifficulty) {
      interval /= 1.5;
    } else {
      interval *= 1.5;
    }
  });

  //reset button
  $("#reset").click(() => {
    reset();
  })
  //Start button trigger
  $("#startButton").click(() => {
    nextSequence();
    $("#startButton").removeClass('pulse');
  });

  //END DOCUMENT READY FUNCTION
});
