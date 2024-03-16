export class GameManager {

  constructor() {
    this.startButton = document.getElementById('startButton');
    this.restartButton = document.getElementById('restartButton');
    this.levelTitle = document.getElementById('levelTitle');
    this.mainTitle = document.getElementById('mainTitle');
    this.subTitle = document.getElementById('subTitle');
    this.gameOver = document.getElementById('gameOverScene');
    this.iconContainer = document.getElementById('iconContainer'); // The div containing the svg icons in the sequence
    this.inputScene = document.getElementById('inputScene'); // The div containing the buttons to press when guessing
    this.currentLevel = 2;
    this.iconSequence = [];
    this.playerSequence = [];
    this.iconDisplay = document.getElementById('icon');
    this.icons = ['alarm-fill', 'heart-fill', 'airplane-fill', 'balloon-fill', 'battery-half', 'bicycle', 'book-fill', 'brilliance', 'bug-fill', 'camera-fill', 'capsule', 'clock-fill', 'arrow-through-heart-fill', 'cloud-drizzle-fill', 'compass-fill', 'dice-5-fill', 'dpad-fill', 'droplet-fill', 'egg-fill', 'eye-fill', 'feather', 'gear-fill', 'gift-fill', 'globe2', 'headphones', 'heart-fill', 'house-door-fill', 'lamp-fill', 'incognito', 'lightning-charge-fill', 'link', 'rocket-takeoff-fill', 'send-fill', 'shield-shaded', 'snow', 'speaker-fill', 'star-fill', 'suit-club-fill', 'suit-diamond-fill', 'suit-spade-fill', 'telephone-fill', 'tree-fill']; //icon pool
  }
  //toggle the different container classes in index.html
  toggleGameState(newState) {
    const gameStates = ['welcomeScene', 'countdownScene', 'gameScene', 'inputScene', 'gameOverScene'];
    // Hide all states
    gameStates.forEach(state => {
      const element = document.getElementById(state);
      if (element) element.classList.add('hidden');
    });

    // Show the new state
    const newStateElement = document.getElementById(newState);
    if (newStateElement) newStateElement.classList.remove('hidden');
  }

  initGameStates() {
    this.startButton.addEventListener("click", () => {
      console.log("start button clicked");
      // Switch to the countdown scene first
      this.toggleGameState('countdownScene');
      

      // Perform the countdown
      let countdownValue = 3;
      const countdownElement = document.getElementById('countdownNumber');
      countdownElement.textContent = countdownValue; // Initialize with the starting value
      const countdownInterval = setInterval(() => {
        countdownValue--;
        countdownElement.textContent = countdownValue;
        if (countdownValue <= 0) {
          clearInterval(countdownInterval); // Stop the countdown
          // Switch to the game scene after the countdown
          this.toggleGameState('gameScene');
          this.runIconSequence(); // Start the icon sequence
        }
      }, 1000); // Updates every second.
    });
  }

  updateSubtitle(text) {
    const subTitleElement = document.getElementById('subTitle');
    if (subTitleElement) subTitleElement.textContent = text;
  }
  updateLevelDisplay() {
    if (this.levelTitle) this.levelTitle.textContent = `Level ${this.currentLevel}`;
    // Update other places where the level is displayed if necessary
  }

  // Generate a random sequence of icons.
  runIconSequence() {
    // Update the level
    this.updateLevelDisplay();
    
    // Clear the player response input buttons before displaying the next sequence.
    const inputScene = document.querySelector('#inputScene');
    inputScene.innerHTML = '';
    
    this.iconSequence = [];
    const availableIcons = [...this.icons]; // Create a copy of the icons array
    
    // Select 'currentLevel' unique icons for the sequence
    for (let i = 0; i < this.currentLevel; i++) {
      // Randomly select an index from the availableIcons array
      const randomIndex = Math.floor(Math.random() * availableIcons.length);
      // Add the selected icon to the sequence
      this.iconSequence.push(availableIcons[randomIndex]);
      // Remove the selected icon from the available icons pool
      availableIcons.splice(randomIndex, 1);
    }
    
    this.updateSubtitle('Memorize the icon sequence.');
    this.displayIconSequence();
    console.log("running icon sequence!");
  }

  // fetch('/api/sounds')
  // .then(response => response.json())
  // .then(sounds => {
  //   const audioElement = new Audio(sounds[0].url); // Assuming the first sound
  //   audioElement.play();
  // })
  // .catch(error => console.error("Error fetching sounds:", error));

  
  // this.sounds = {
  //   'alarm-fill': new Audio('path/to/alarm-fill_sound.mp3'),
  //   'heart-fill': new Audio('path/to/heart-fill_sound.mp3'),
  //   // Repeat for all icons
  // };

  // Display the icon sequence to the player
  displayIconSequence() {
    document.querySelector('.icon-sequence').classList.remove('hidden');
    this.iconSequence.forEach((iconName, index) => {
      setTimeout(() => {
        const newIconHref = `./icons/bootstrap-icons.svg#${iconName}`;
        const useElement = this.iconContainer.querySelector('use');
        if (useElement) {
          useElement.setAttribute('href', newIconHref); // Modern browsers
          // if (this.sounds[iconName]) { 
          //   this.sounds[iconName].play();
          // }
        } else {
          console.error('Use element not found');
        }
        console.log(`Displaying icon: ${iconName}`); // Log the icon being displayed
      }, 1000 * index); // Display each icon one second apart
    });

    // After displaying the sequence, clear the icon display and prepare for player input
    setTimeout(() => {
      // Clear the last displayed icon
      const useElement = this.iconContainer.querySelector('use');
      if (useElement) {
        useElement.setAttribute('href', ''); // Clear the icon
      }

      // generate the buttons for player input based on the sequence
      this.generateIconButtons();
      this.updateSubtitle('Input the correct sequence order.');
      console.log("Icon sequence complete, buttons displayed for user input.");
    }, 1000 * this.iconSequence.length); // Wait for the last icon to be displayed before clearing and showing buttons
  }

  
  //shuffle button order
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // ES6 array destructuring to swap elements
    }
  }

  generateIconButtons() {
    const inputScene = document.querySelector('#inputScene');
    inputScene.innerHTML = ''; // Clear previous buttons if any

    // Create a copy of iconSequence for button generation
    const shuffledSequence = [...this.iconSequence];
    this.shuffleArray(shuffledSequence);

    shuffledSequence.forEach((iconName) => {
      const button = document.createElement('button');
      button.classList.add('icon-grid');
      button.innerHTML = `<svg class="icon icon-4x" width="50" height="50"><use xlink:href="./icons/bootstrap-icons.svg#${iconName}"></use></svg>`;
      button.addEventListener('click', () => {
        this.handlePlayerInput(iconName);
      });
      inputScene.appendChild(button);
    });

    // Optionally, reveal the input scene if hidden
    inputScene.classList.remove('hidden');
  }


  handlePlayerInput(selectedIcon) {
    const pressedButton = event.currentTarget;
    pressedButton.classList.add('click'); // Add 'clicked' class for visual feedback
    // Check if the button has already been pressed
    if (!pressedButton.classList.contains('pressed')) {
      // Remove 'clicked' class after a short delay, add 'pressed' permanently
      setTimeout(() => {
        pressedButton.classList.remove('click');
        pressedButton.classList.add('pressed'); // Mark as permanently pressed
        pressedButton.disabled = true; // Disable the button
      }, 150); // Adjust timing as needed

      this.playerSequence.push(selectedIcon);
      console.log(`Icon selected: ${selectedIcon}`); // Debugging

      // Check if the player has finished inputting their sequence
      if (this.playerSequence.length === this.iconSequence.length) {
        this.checkPlayerSequence();
      }
    }
  }

  checkPlayerSequence() {
    if (JSON.stringify(this.playerSequence) === JSON.stringify(this.iconSequence)) {
      console.log('Correct sequence! Advancing to the next level.');
      // Turn all buttons green for visual confirmation of correct sequence
      document.querySelectorAll('.icon-grid button').forEach(button => {
        button.classList.add('correct');
      });
      // Proceed to next level or reset after a delay
      setTimeout(() => {
        this.currentLevel++;
        this.playerSequence = [];
        document.querySelectorAll('.icon-grid button').forEach(button => {
          button.classList.remove('correct'); // Reset the buttons
        });
        this.updateLevelDisplay(); // Update the level display
        this.runIconSequence();
      }, 2000); // Delay before starting the next level
    } else {
      this.GameOverScreen();
      this.GenerateRestartButton();
    }
  }

  GenerateRestartButton() {
    // This check ensures multiple event listeners

      this.restartButton.addEventListener('click', () => {
        console.log("restart button clicked");
        this.currentLevel = 1; // Reset to initial level
        this.iconSequence = [];
        this.playerSequence = [];
        this.updateLevelDisplay(); // Ensure level display is updated
        this.toggleGameState('gameScene'); // Go directly to game scene
        this.runIconSequence(); // Start a new game sequence
      });
      this.restartButtonClickListenerAdded = true; // Mark that the listener was added
    }

    async getHighscores() {
      const requestUrl = '/user';
    
      try {
        const response = await fetch(requestUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok!');
        }
        const data = await response.json();
    
        // Process the response data here
        // First, remove table if it already exists in the DOM
        const highscoreTableOld = document.getElementById('highscoresTable');
        if (highscoreTableOld != null) {
          highscoreTableOld.remove();
        }
    
        // Create the table element
        let highscoresTable = document.createElement("table");
        highscoresTable.id = 'highscoresTable';
    
        // Sort the array by highscores in descending order
        data.sort((a, b) => b.score - a.score);
    
        // Create the table cells
        for (let element of data) {
          let row = highscoresTable.insertRow();
          let keys = ["rank", "name", "score"]; // Update keys to include "rank"
          keys.forEach(key => {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
          });
        }
    
        // Create the table headings
        let thead = highscoresTable.createTHead();
        let row = thead.insertRow();
        let keys = ["rank", "name", "score"]; // Update keys to include "rank"
        keys.forEach(key => {
          let th = document.createElement("th");
          let text = document.createTextNode(key.charAt(0).toUpperCase() + key.slice(1)); // Capitalize the first letter of the key
          th.appendChild(text);
          row.appendChild(th);
        });
        // Insert the table in the DOM
        const highscoresContainer = document.getElementById('highscoresContainer'); // Add this line
        highscoresContainer.appendChild(highscoresTable); // Update this line
      } catch (error) {
        // Handle errors here
        console.log('An error occurred!', error);
      }
  }
  
  // New method to update the highscore for a specific user
  async setUserHighscore(userId, data) {
    const url = '/user/' + userId;
  
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Item updated successfully:', responseData);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }


  GameOverScreen() {
    const levelDisplay = this.gameOver.querySelector('.text-md');
    if (levelDisplay) levelDisplay.textContent = `Level ${this.currentLevel}`;
    const gameOverMessage = this.gameOver.querySelector('.text-lg');

    // changes the text line beneath "Game Over"
    if (gameOverMessage) {
      gameOverMessage.textContent = `You reached Level ${this.currentLevel}!`;
    }

    // const newScore = this.currentLevel; //current level represents the score
    this.getHighscores();
    this.toggleGameState('gameOverScene');
  }
}









