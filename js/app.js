/* jshint shadow: true */
(function (document) {
  'use strict';

  var overlay = document.getElementById('overlay');
  var start = document.getElementById('start');
  var qwerty = document.getElementById('qwerty');
  var phrase = document.getElementById('phrase');
  var letters = document.getElementsByClassName('letter');
  var tries = document.getElementsByClassName('tries');
  var qwertyButtons = qwerty.getElementsByTagName('button');

  var missed = 0;
  var randomPhrase = '';
  var phrases = [
    'Document Object Model',
    'Front End Development',
    'HTML and CSS',
    'JavaScript',
    'Responsive Web Design'
  ];

  /**
   * Sets the randomPhrase variable from the phrases array.
   * @returns {void}
   */
  var setRandomPhrase = function() {
    var previousRandomPhrase = randomPhrase;

    // This prevents the same phrase being played twice in a row.
    while (previousRandomPhrase === randomPhrase) {
      randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    }
  };

  /**
   * Displays the phrase by appending list items to the phrase list.
   * @returns {void}
   */
  var displayPhrase = function() {
    randomPhrase.split('').forEach(function(letter) {
      var isSpace = letter === ' ';
      var element = document.createElement('li');

      element.innerHTML = isSpace ? '&nbsp;' : letter;
      element.className = isSpace ? 'space' : 'letter';

      phrase.firstElementChild.appendChild(element);
    });
  };

  /**
   * Checks if a letter is in the random phrase. If it is, the show class is added to the letters
   * list. If it isn't, the missed counter is incremented and the lostHeart image is displayed.
   * @param {string} letter
   * @returns {void}
   */
  var checkLetter = function(letter) {
    if (randomPhrase.toLowerCase().indexOf(letter) !== -1) {
      for (var i = 0; i < letters.length; i += 1) {
        var listItem = letters[i];

        if (listItem.innerText.toLowerCase() === letter) {
          listItem.className = 'letter show';
        }
      }

      return;
    }

    // This code runs if we didn't find the letter, so increment the missed counter and replace one
    // of the liveHearts with a lostHeart image.
    missed += 1;
    tries[tries.length - missed].firstElementChild.src = 'images/lostHeart.png';
  };

  /**
   * Sets the chosen class on the element, and sets the element's disabled attribute to true.
   * @param {Element} element
   * @returns {void}
   */
  var disableKeyboardLetter = function(element) {
    element.className = 'chosen';
    element.disabled = true;
  };

  /**
   * Checks if the player has won or lost and displays the appropriate overlay.
   * @returns {void}
   */
  var checkWinState = function() {
    var displayedPhrase = '';
    var listItems = phrase.firstElementChild.children;

    if (missed === 5) {
      overlay.className = 'lose';
      overlay.children[1].innerText = 'Better luck next time!';
      overlay.children[2].innerText = 'Play Again';
      overlay.style.display = '';
      return;
    }

    // Build a string to compare against the current random phrase.
    for (var i = 0; i < listItems.length; i += 1) {
      var listItem = listItems[i];

      if (listItem.className === 'space') {
        displayedPhrase += ' ';
        continue;
      }

      if (listItem.className === 'letter show') {
        displayedPhrase += listItem.innerText;
      }
    }

    if (displayedPhrase === randomPhrase) {
      overlay.className = 'win';
      overlay.children[1].innerText = 'Congratulations! You won!';
      overlay.children[2].innerText = 'Play Again';
      overlay.style.display = '';
    }
  };

  /**
   * Resets all game state back to their initial values.
   * @returns {void}
   */
  var reset = function() {
    // Reset the missed counter.
    missed = 0;

    // Reset the overlay.
    overlay.children[1].innerText = 'Click the button to play!';
    overlay.children[2].innerText = 'Start Game';

    // Reset the keyboard by removing the chosen class and disabled attribute.
    for (var i = 0; i < qwertyButtons.length; i += 1) {
      var button = qwertyButtons[i];

      if (button.hasAttribute('class')) {
        button.removeAttribute('class');
      }

      if (button.hasAttribute('disabled')) {
        button.disabled = false;
      }
    }

    // Reset tries by displaying the liveHeart image for all tries.
    for (var i = 0; i < tries.length; i += 1) {
      var img = tries[i].firstElementChild;

      if (img.getAttribute('src') === 'images/lostHeart.png') {
        img.src = 'images/liveHeart.png';
      }
    }

    // Remove the displayed phrase (does nothing if there is none).
    while (phrase.firstElementChild.firstChild !== null) {
      var listItem = phrase.firstElementChild.firstChild;

      phrase.firstElementChild.removeChild(listItem);
    }
  };

  // Add a keypress handler so we can use a real keyboard.
  document.body.addEventListener('keypress', function(event) {
    for (var i = 0; i < qwertyButtons.length; i += 1) {
      var button = qwertyButtons[i];

      if (event.key === button.innerText) {
        // Note that createEvent is a deprecated method, but I'm shooting for IE compatibility.
        var click = document.createEvent('MouseEvent');
        click.initMouseEvent('click', true);

        if (!button.disabled) {
          // This simulates a real mouse click, so our click handler will run.
          button.dispatchEvent(click);
        }
      }
    }
  });

  // Start button click handler.
  start.addEventListener('click', function (event) {
    event.target.parentElement.style.display = 'none';

    // Reset the game if we already have a phrase displayed.
    if (randomPhrase !== '') {
      reset();
    }

    // Start the game.
    setRandomPhrase();
    displayPhrase();
  });

  // Keyboard buttons click handler.
  qwerty.addEventListener('click', function (event) {
    var target = event.target;

    // When using event delegation, we need to filter out any unwanted events.
    if (target.tagName.toLowerCase() !== 'button') return;

    disableKeyboardLetter(target);
    checkLetter(target.innerText);
    checkWinState();
  });
})(window.document);
