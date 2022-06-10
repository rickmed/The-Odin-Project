// console.clear();
const $ = document.querySelector.bind(document)

let grid = $('grid');

$('#new_grid').addEventListener('click', e => {
    const answer = parseInt(prompt('Grid size?'));
    if (answer > 100) {
        alert('Sorry, 100 is the maximum');
        return
    }
    change_grid(answer);
})

change_grid();

function change_grid(size_size = 16) {
    grid.style['grid-template-columns'] = `repeat(${size_size}, 1fr)`;
    const cells = create_cells(size_size);
    grid.replaceChildren(...cells);

    function create_cells(n_squares) {
        const cells = [...Array(n_squares ** 2)].map( _ => {
            return create_cell()
        })
        return cells
    }

    function create_cell() {
        const cell = document.createElement('cell');
        cell.style.border = '1px solid black';
        cell.addEventListener('mouseover', e => {
            cell.style.backgroundColor = 'yellow';
        })
        return cell
    }
}