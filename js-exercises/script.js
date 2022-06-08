function computerPlay() {
    const random = Math.random()
    if (random <= 1 / 3) {
        return 'rock'
    } else if (random > 1 / 3 && random <= 2 / 3) {
        return 'paper'
    } else {
        return 'scissors'
    }
}

function playRound(playerSelection, computerSelection) {

    let winner;

    if (playerSelection === computerSelection) {
        return `It's a draw between ${playerSelection}s`
    }

    if (playerSelection === 'rock' && computerSelection === 'scissors' ||
        playerSelection === 'scissors' && computerSelection === 'paper' ||
        playerSelection === 'paper' && computerSelection === 'rock'
    ) {
        winner = 'player'
    } else {
        winner = 'computer'
    }

    const result = winner === 'player' ?
        `You win! ${playerSelection} beats ${computerSelection} ` :
        `You lose! ${computerSelection} beats ${playerSelection} `

    return result
}

function game() {
    const playerSelection = prompt('Your move:').toLowerCase()
    console.log(playRound(playerSelection, computerPlay()))
}

console.log(`Let's play 3 rounds!`);
for (let i = 0; i < 3; i++) {
    game()
}
console.log('game over')


