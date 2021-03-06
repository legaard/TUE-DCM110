var robot = require('robotjs');

var FILE_NAME = 'SPOTIFY';

module.exports = (function (){
  var VOLUME_INTERVAL_SIZE = 5,
      INITIAL_VOLUME_VALUE = 3;

  var currentVolume = null,
      isMuted = false;

  function nextSong() {
    robot.keyTap('right', ['control', 'command']);
    console.log(FILE_NAME, '==>', 'Play next song');
  }

  function prevSong() {
    robot.keyTap('left', ['control', 'command']);
    console.log(FILE_NAME, '==>','Play previous song');
  }

  function playOrPause() {
    robot.keyTap('space');
    console.log(FILE_NAME, '==>', 'Song played/paused');
  }

  function searchAndSelect(searchValue) {
    //Set the 'focus field' and delete existing text (if any)
    robot.keyTap('f', ['alt', 'command']);
    robot.keyTap('delete');

    // Split word into array of characters
    var characters = searchValue.toLowerCase().split('');

    // Replace all ' ' with 'space' and type word
    characters.map(function(character){
      if(character === ' '){
        return 'space';
      } else {
        return character;
      }
    }).forEach(function(character){
      robot.keyTap(character);
    });

    //Make sure that spotify has found search results first
    setTimeout(function() {
      robot.keyTap('down');
      robot.keyTap('enter');

      setTimeout(function(){
        robot.moveMouse(600, 280);
        robot.mouseClick();
        console.log(FILE_NAME, '==>', 'Search for and selected:', searchValue);
      }, 250);

    }, 250);
  }

  function volumeUp() {
    isMuted = false;
    robot.keyTap('up', 'command');
  }

  function volumeDown() {
    robot.keyTap('down', 'command');
  }

  function volumeMute() {
    if (!isMuted) {
      robot.keyTap('down', ['command', 'shift']);
      isMuted = true;
    }
  }

  function volumeMax() {
    robot.keyTap('up', ['command', 'shift']);
  }

  function setVolume(newVolume) {
    var volumeDiff = newVolume - currentVolume;

    // If calibration of the volume has not been executed --> do nothing
    if (currentVolume === null) {
      return;
    }

    // If the new value exeeds interval --> do nothing
    if (newVolume > VOLUME_INTERVAL_SIZE) {
      return;
    }

    // If the new value is the same --> do nothing
    if (volumeDiff === 0) {
      volumeMute();
      return;
    }

    // Turn volume up or down based on the difference between new and old value
    if (volumeDiff > 0) {
      for (var i = 0; i < volumeDiff; i++) {
        volumeUp();
      }
    } else {
      for (var j = 0; j > volumeDiff; j--) {
        volumeDown();
      }
    }

    // Set new value to current value
    currentVolume = newVolume;
    console.log(FILE_NAME, '==>', 'Changed volume to', currentVolume);
  }

  function calibrateVolume(){
    volumeMute();
    for (var i = 0; i < INITIAL_VOLUME_VALUE; i++) {
      volumeUp();
    }
    currentVolume = INITIAL_VOLUME_VALUE;
    console.log(FILE_NAME, '==>', 'Completed calibration!');
  }

  return {
    nextSong: nextSong,
    prevSong: prevSong,
    playOrPause: playOrPause,
    setVolume: setVolume,
    volumeMute: volumeMute,
    volumeMax: volumeMax,
    searchAndSelect: searchAndSelect,
    calibrateVolume: calibrateVolume
  };
})();
