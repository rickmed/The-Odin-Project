// console.clear();
const $ = document.querySelector.bind(document)

for (let i = 0; i < 16 * 16; i++) {
    const elem = document.createElement('div');
    elem.classList.add('square')
    elem.id = `${i}`;
    elem.width = '10px';
    elem.style.border = '1px solid red';
    elem.textContent = i;
    elem.style.fontSize = '12px';
    $('#container').appendChild(elem);
}