  export const Status = Object.freeze({
	PLAYING: "PLAYING",
	VICTORY: "VICTORY",
	FAILURE: "FAILURE",
  });

export const startDate = new Date(2025, 6, 22);

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
	var correct = false;
	if (guess == answer.toLowerCase()) {
		correct = true;
	}


	return correct;
}




export const shareResults = (guesses, maxGuesses, previousGuesses, gameStatus) => {
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
				score += '⬛';
			}
			
		}

	}
	

	var emojis = ['🎹', '🎸', '🎺', '🎷', '🎧', '🎼', '🎙️', '🎚️', '🎛️', '📻', '🎵', '🎶']
	
	var rand = Math.floor(Math.random()*emojis.length);

	var emoji = emojis[rand];
	if (guesses == 1) {
		emoji = '🔥';
	}
	var results = `#GuessTheBand #${getDateNumber()}\n\n${emoji}:${score}\n\n<insert link here>`
	// console.log(previousGuesses)
	// console.log(guesses);
	navigator.clipboard.writeText(results);
	return results;

}
//⬛🟥⬛⬛🟩⬜