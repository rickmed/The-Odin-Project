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

    const result = playerSelection === computerSelection ? 'draw' :
       (playerSelection === 'rock' && computerSelection === 'scissors' ||
        playerSelection === 'scissors' && computerSelection === 'paper' ||
        playerSelection === 'paper' && computerSelection === 'rock') ? 'player' :
    'computer'

    return result
}

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


let score = {
    computer: 0,
    player: 0
}

for (button of $$(`.selection`)) {

    button.addEventListener(`click`, e => {
        const playerSelection = e.target.id;
        const computerSelection = computerPlay();
        const round_winner = playRound(playerSelection, computerSelection);

        // update score
        const winner_score = score[round_winner];
        if (winner_score < 5) {
            score[round_winner] = winner_score + 1
        }

        const score_text =
            `Player: ${score.player} - Computer: ${score.computer}`;
        $(`#score`).textContent = score_text;

        const round_result_msg = round_winner === 'draw' ?
            `It's a draw between ${playerSelection}s` :
                round_winner === 'player' ?
            `You win! ${playerSelection} beats ${computerSelection} ` :
            `You lose! ${computerSelection} beats ${playerSelection} `;

        // Append round result
        let result_ui = document.createElement(`div`);
        result_ui.textContent = round_result_msg;
        $(`body`).appendChild(result_ui);

        console.log(winner_score);
        if (winner_score === 5) {
            let game_winner_ui = document.createElement(`h3`);
            result_ui.textContent = `${round_winner} wins!`;
            $(`body`).appendChild(result_ui);
        }

    })
}

console.clear();

