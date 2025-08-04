  export const Status = Object.freeze({
	PLAYING: "playing",
	VICTORY: "victory",
	FAILURE: "failure",
  });

  export const stringToStatus = (str) => {
	switch (str) {
		case "playing":
			return Status.PLAYING;
			break;
		case "victory":
			return Status.VICTORY;
			break;
		case "failure":
			return Status.FAILURE;
			break;
		default:
			return null;
			break;
	}
  }

export const startDate = new Date(2025, 6, 27);

export const aGrammar = (nextWord, capital) => {
	let returnStr = "A";
	if (!capital) {
		returnStr = "a";
	}
	let letter = nextWord[0].toLowerCase();
	let regex = /^[aeiou]$/;
	let isVowel = regex.test(letter);
	if (isVowel) {
		return returnStr+"n";
	}
	return returnStr;
}

export const getDateNumber = () => {
	const oneDay = 24*60*60*1000;
	const date = new Date();

	return Math.round(Math.abs((startDate.setHours(0,0,0) - date.setHours(0,0,0)) / oneDay)) + 1;
}

export const checkGuess = (guess, answer) => {
	answer = answer.toLowerCase();
	guess = guess.toLowerCase();
	var correct = false;
	var hasThe = false;
	if (guess == answer) {
		correct = true;
	}
	//console.log("check:", );
	if (guess.substring(0,4) == "the ") {
		hasThe = true;
		guess = guess.substring(4, guess.length);
		if (guess == answer) {
			correct = true;
		}
	}
	
	if (isEditDistanceOne(guess, answer)) {
		correct = true;
	}


	return correct;
}


export const generateScore = (guesses, maxGuesses, previousGuesses, gameStatus) => {
	var score = "";
	for (var i = 0; i < maxGuesses; i++) {
	
		if (i >= guesses-1 && gameStatus == Status.VICTORY) {
			if (i == guesses-1) {
				score += '🟩';
			} else {
				score += '⬜';
			}
			
		} else {
			if (previousGuesses[i] != null) {
				score += '🟥';
			} else {
				if (i < guesses) {
					score += '⬛';
				} else {
					score += '❓';
				}
			}
			
		}
	}
	// for (var i = guesses; i < maxGuesses-1; i++) {
	// 	if (gameStatus == Status.VICTORY) {
	// 		score += '⬜';
	// 	} 
	// 	if (gameStatus == Status.PLAYING) {
	// 		score += '❓';
	// 	}
	// }

	return score;
}


export const shareResults = (guesses, maxGuesses, previousGuesses, gameStatus, day) => {

	const score = generateScore(guesses, maxGuesses, previousGuesses, gameStatus);

	var emojis = ['🎹', '🎸', '🎺', '🎷', '🎧', '🎼', '🎙️', '🎚️', '📻', '🎵', '🎶']
	
	var rand = Math.floor(Math.random()*emojis.length);

	var emoji = emojis[day%emojis.length];
	if (guesses == 1) {
		emoji = '🔥';
	}
	var results = `#GuessTheBand #${day}\n\n${emoji}:${score}\n\n<insert link here>`
	// console.log(previousGuesses)
	// console.log(guesses);
	try {
		navigator.clipboard.writeText(results);
	} catch (err) {
		console.log(err);
	}
	return results;

}

export const generateScoreFromStorage = (data) => {
	if (data == null) {
		return "❓❓❓❓❓❓"
	}
	if (data.gameStatus == Status.PLAYING) {
		
	}
	const guesses = data.guesses.length+1;
	const prevGuesses = data.guesses;
	const gameStatus = data.gameStatus;

	return generateScore(guesses, 6, prevGuesses, gameStatus);
}

export const generateStatusFromStorage = (data) => {
	if (data == null) {
		return "⬅️ Unplayed"
	}
	const status = data.gameStatus;
	const guesses = data.guesses.length+1;
	const prevGuesses = data.guesses;
	var allSkipped = true;
	for (var i = 0; i < guesses; i++) {
		if (prevGuesses[i] != null) {
			allSkipped = false;
		}
	}

	switch (status) {
		case Status.PLAYING:
			return "🤔 In Progress...";
			break;
		case Status.FAILURE:
			if (!allSkipped) {
			return "❌ Failed 😭";
			} else {
				return "❌ All skipped 💀";
			}
			break;
		case Status.VICTORY:
			return "✅ Victory!! 😁"
			break;
	}
}

export const generateStatsFromStorage = (data) => {
	
}


// JavaScript program to check if given two strings are  
// at distance one.

// Returns true if edit distance between s1 and  
// s2 is one, else false
// credit: https://www.geeksforgeeks.org/dsa/check-if-two-given-strings-are-at-edit-distance-one/
function isEditDistanceOne(s1, s2) {

    // Find lengths of given strings
    let m = s1.length, n = s2.length;

    // If difference between lengths is more than  
    // 1, then strings can't be at one distance
    if (Math.abs(m - n) > 1)
        return false;

    // Count of edits
    let count = 0;

    let i = 0, j = 0;
    while (i < m && j < n) {

        // If current characters don't match
        if (s1[i] !== s2[j]) {

            // If one edit has been done already
            if (count === 1)
                return false;

            // If length of one string is  
            // more, then only possible edit  
            // is to remove a character
            if (m > n)
                i++;
            else if (m < n)
                j++;
            else {
                i++;
                j++;
            }

            // Increment count of edits
            count++;
        }

        // If current characters match
        else {
            i++;
            j++;
        }
    }

    // If last character is extra in any string
    if (i < m || j < n)
        count++;

    return count <= 1;
}
 
// https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
export function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export function toPercent(num1, num2) {
	return Math.floor((num1/num2) * 100) + "%"

}

//🟥⬛🟩⬜