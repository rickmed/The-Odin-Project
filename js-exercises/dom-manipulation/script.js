const container = document.querySelector('#container');

const content = document.createElement('div');
content.classList.add('content');
content.textContent = 'This is the glorious text-content!';

container.appendChild(content);

const red_p = document.createElement('p');
red_p.style.color = 'red';
red_p.textContent = `Hey I'm red!`;

const blue_h3 = document.createElement('h3');
blue_h3.setAttribute('style', `color: blue`);
blue_h3.textContent = `Hey I'm a blue H3!`;

const parent_div = document.createElement('div')
parent_div.setAttribute('style', `border: 1px solid black; background-color: pink`);

const h1 = document.createElement(`h1`);
h1.textContent = `I'm a div`;

const p = document.createElement('p');
p.textContent = `I'm too!`;

[h1, p].forEach( e => {
    parent_div.appendChild(e);
})

for (e of [red_p, blue_h3, parent_div]) {
    container.appendChild(e);
}



