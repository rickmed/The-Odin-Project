console.clear();

const One_nine = '1-9';
const Zero_nine = '0-9';
const OP = `OP`;
const CE = 'CE';
const C = 'C';


const init_state = {
    op1: '0',
    op: '',
    op2: '',
}
let app_state = {...init_state};

let screen_input = document.querySelector('screen user_input');
let screen_result = document.querySelector('screen result');

const events = asyncProducer();
document.addEventListener('click', ev => events.push(ev));

async function interpret(statechart) {
    let state_history = [];
    let state = default_state(statechart);
    let always_queries = global_queries(statechart);

    while (true) {
        let queries = [...always_queries];

        for (const k in state) {
            if (!is_fn(state, k)) queries.push(k)
        }

        console.log('queries', queries);

        const [query_res, val] = await input(queries);

        state_history.push(query_res);

        if (!(query_res in state)) {
            runEffects(statechart, query_res, val);
            state = transit(statechart, query_res)
            continue
        }

        runEffects(state, query_res, val);

        if (query_res[query_res.length - 1] === '*') {
            continue
        }
        if ('goto' in state) {
            state = transit(state, query_res)
            continue
        }
        if (query_res in state) {
            state = state[query_res];
            continue
        }

    }


    // helpers
    function transit(curr_state, query_res) {
        const goto_pointer = curr_state[query_res].goto;
        return statechart[goto_pointer] || statechart['_' + goto_pointer];
    }
    function default_state(statechart) {
        for (const k in statechart) {
            if (k[0] === '_') return statechart[k]
        }
    }
    function global_queries() {
        const res = Object.keys(statechart).filter( k => {
            return !(is_named_state(k) || k[0] === '_')
        })
        return res
    }
    function is_named_state(k) {
        return k[0] === '$' || k[1] === '$'
    }
    function runEffects(state, query, val) {
        const effect = findEffect(state[query]);
        effect(val);
        statechart.__after_each(state_history);

        function findEffect(state) {
            for (let k in state) {
                if (is_fn(state, k)) return state[k]
            }
        }
    }
    function is_fn(obj, k) {
        return typeof obj[k] === 'function'
    }
}

/*** Statechart spec ***/

let statechart; {

const DOT = {
    ['.']: {
        append_to_op1,
        ['0-9*']: { append_to_op1 }
    }
}

statechart = {
    ['OP']: {
        eff(val) {
            app_state.op = val;
            app_state.op2 = app_state.op1;
        },
        goto: '$Await_Operand'
    },
    ['C']: {
        restart_state,
        goto: '$Await_Operand'
    },
    _$Await_Operand: {
        ['1-9']: {
            replace_op1,
            ['0-9*']: {
                append_to_op1,
                ...DOT
            },
            ...DOT
        },
        ['.']: {
            append_to_op1,
            ['0-9*']: { append_to_op1 }
        },
        ['0']: {
            eff(_) { app_state.op1 = '0' },
            goto: '$Await_Operand'
        }
    },
    __after_each(state_history) {
        console.log('hist', state_history);
        render();

        function render() {
            if (app_state == init_state) {
                screen_input.textContent = '0';
                screen_result.textContent += '';
                return
            }
            const {op1, op, op2} = app_state;
            screen_input.textContent = op1;
            screen_result.textContent = op === '' ? '\xa0' :
                    `${op1} ${op}`;

        }
    }
}


    // helpers
    function append_to_op1(val) {
        app_state.op1 += val;
    }
    function replace_op1(val) {
        app_state.op1 = val;
    }
    function restart_state() {
        app_state = {...init_state};
    }

}


interpret(statechart)




// HELPERS
async function input(types) {
    while (true) {

        const ev = await events.take();
        const button_text = ev.target.textContent;

        for (const type of types) {
            const regex = type === OP ? /[+|\-|x|÷]/ : new RegExp(`[${type}]`);

            if (regex.test(button_text)) {
                return [type, button_text]
            }
        }
    }
}

function asyncProducer() {
    let resolve;
    const queue = [];

    return {
        async take() {
            if (queue.length === 0) {
                await new Promise( res => resolve = res);
            }
            return queue.shift();
        },
        push(event) {
            queue.push(event);
            resolve();
        },
    }
}








function operate (operation, op1, op2) {
    // body
}


function add (x, y) {
    // body
}


function subtract (x, y) {
    // body
}

function multiply (x, y) {
    // body
}

function divide (x, y) {
    // body
}


