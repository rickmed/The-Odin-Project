console.clear();
function lg(str, v) {
    if (typeof str !== 'string') {
        console.log(JSON.stringify(str));
        return;
    }
    console.log(`${str} --`, JSON.stringify(v));
}

const buttons = document.querySelectorAll('buttons_area button');
for (const button of buttons) { button.addEventListener('click', loop); }
window.addEventListener('keyup', loop);

let Mem = {
	Tokens: [],
	restore() { Mem.Tokens = []; },
    inInit: () => Mem.Tokens.length === 0,
};
function lastToken() {
    return Mem.Tokens.slice(-1)[0];
}
let msg = {};  // TODO remove this API

function loop(raw_ev) {
    update();
    lg(Mem.Tokens);
    render();
    msg = {};

    //
    function update() {
        handleEv();
        evaluate();

        function handleEv() {
            if (ev('C')) {
                Mem.restore();
            }
            if (ev('CE')) {
                if (Mem.inInit()) {
                    return;
                }
                else {
                    cancelEntry();
                }
            }
            if (ev('Back')) {
                const {Tokens} = Mem;
                if (Mem.inInit()) {
                    return;
                }
                else if (lastNumHasOneChar() || lastIsOP()) {
                    cancelEntry();
                }
                else {
                    const last_number = Tokens[Tokens.length - 1];
                    const without_last_char = last_number.val.slice(0, -1);
                    last_number.val = without_last_char;
                }

                //
                function lastNumHasOneChar() {
                    return Tokens.slice(-1)[0].val.length === 1;
                }
                function lastIsOP() {
                    return Tokens.slice(-1)[0].Op;
                }
            }
            if (ev('Op')) {
                if (Mem.inInit()) {
                    addNewNum('0');
                    addNewOp(inp());
                }
                else if (lastTokenWas('Op')) {
                    lastToken().val = inp();
                }
                else {
                    addNewOp(inp());
                }

                //
                function addNewOp(val) {
                    Mem.Tokens.push({ Op: {}, val });
                }
            }
            if (ev('Num')) {
                if (lastTokenWas('Num')) {
                    checkTrailingZero();
                    lastToken().val += inp();

                    //
                    function checkTrailingZero() {
                        if (lastToken().val === '0') {
                            lastToken().val = '';
                        }
                    }
                }
                else {
                    addNewNum(inp());
                }
            }
            if (ev('PlusMinus')) {
                if (Mem.inInit()) {
                    addNewNum('-');
                }
                else {
                    const last_num = getLastNum();
                    const {val} = last_num;
                    if (val[0] === '-') {
                        const without_1st_char = last_num.val.slice(1);
                        last_num.val = without_1st_char;
                    }
                    else {
                        last_num.val = '-'.concat(val);
                    }

                    //
                    function getLastNum() {
                        return Mem.Tokens.slice().reverse().find(token => token.number);
                    }
                }
            }
            if (ev('Eq')) {
                const {Tokens} = Mem;
                if (Tokens.length === 2) {
                    Mem.Tokens = [Tokens.shift()];
                    delete Mem.Result;
                }
            }

            //
            function cancelEntry() {
                if (Mem.Tokens.length === 1) {
                    Mem.restore();
                }
                Mem.Tokens.pop();
            }
            function lastTokenWas(type) {
                return lastToken() ? lastToken()[type] : false;
            }
        }

        function evaluate() {
            const {Tokens} = Mem;

            if (Tokens.length < 3) {
                delete Mem.Result;
                return;
            }

            let last_3_tokens_to_eval;
            if (Tokens.at(-1).Op) {
                last_3_tokens_to_eval = Tokens.slice(Tokens.length - 4, -1);
            }
            else {
                last_3_tokens_to_eval = Mem.Tokens.slice(-3);
            }

            let [{val: num1}, {val: op}, {val: num2}] = last_3_tokens_to_eval;

            num1 = Number(num1);
            num2 = Number(num2);
            let res;
            if (op === 'plus') {
                res = num1 + num2;
            }
            if (op === 'minus') {
                res = num1 - num2;
            }
            if (op === 'mult') {
                res = num1 * num2;
            }
            if (op === 'div') {
                res = num2 === 0 ? "Can't divide by 0" : num1 / num2;
            }
            res = res.toString();

            if (ev('Eq')) {
                Mem.Tokens = [];
                addNewNum(res);
                delete Mem.Result;
            }
            else {
                Mem.Result = res;
            }
        }

        //
        function ev(type) {
            let app_ev;
            if (raw_ev.key) {
                const key_to_ev = {
                    '+': 'plus',
                    '-': 'minus',
                    '*': 'mult',
                    'x': 'mult',
                    '/': 'div',
                    'c': 'C',
                    '=': 'Eq',
                    'Backspace': 'Back'
                };
                if (raw_ev.key in key_to_ev) {
                    app_ev = key_to_ev[raw_ev.key];
                }
                else {
                    app_ev = raw_ev.key;
                }
            }
            else {
                app_ev = raw_ev.className;
            }

            if (['plus', 'minus', 'mult', 'div'].includes(app_ev)) {
                msg.Op = {};
                msg.val = app_ev;
            }
            else if (/[0-9]/.test(app_ev)) {
                msg.Num = {};
                msg.val = app_ev;
            }
            else {
                msg[app_ev] = {};
            }

            return type in msg;
        }
        function inp() {
            return msg.val;
        }
        function addNewNum(val) {
            Mem.Tokens.push({ Num: {}, val });
        }

    }
    function render() {
        let screen_input = document.querySelector('screen user_input');
        let screen_result = document.querySelector('screen result');

        const input_hist = Mem.Tokens.reduce((acc, tkn) => {
            const show_val = tkn.Op ? ui_val() : tkn.val;
            return acc.concat(' ', show_val);

            //
            function ui_val() {
                const button = [...buttons].find(node => node.className === tkn.val);
                return button.textContent;
            }

        },'\xa0');

        screen_input.textContent = input_hist;
        screen_result.textContent = Mem.Result || '\xa0';
    }
}











/*******/
/**** OTHER possible APIs for specifying the statechart ****/

/* v1 Object-based DSL */
// async function interpret(statechart) {
//     let state_history = [];
//     let always_queries = global_queries(statechart);
//     let state = default_state(statechart);
//     runEffects(state)

//     while (true) {
//         let queries = [...always_queries];

//         for (const k in state) {
//             if (!is_fn(state, k)) queries.push(k)
//         }

//         console.log('queries', queries);

//         const [query_res, val] = await or(queries);

//         state_history.push(query_res);

//         if (!(query_res in state)) {
//             runEffects(statechart, query_res, val);
//             state = transit(statechart, query_res)
//             continue
//         }

//         runEffects(state, query_res, val);

//         if (query_res[query_res.length - 1] === '*') {
//             continue
//         }
//         if ('goto' in state) {
//             state = transit(state, query_res)
//             continue
//         }
//         if (query_res in state) {
//             state = state[query_res];
//             continue
//         }

//     }

//     // helpers
//     function transit(curr_state, query_res) {
//         const goto_pointer = curr_state[query_res].goto;
//         return statechart[goto_pointer] || statechart['_' + goto_pointer];
//     }
//     function default_state(state) {
//         for (const k in state) {
//             if (k.slice(0, 2) === '_$') return state[k]
//         }
//     }
//     function global_queries() {
//         const res = Object.keys(statechart).filter( k => {
//             return !(is_named_state(k) || k[0] === '_')
//         })
//         return res
//     }
//     function is_named_state(k) {
//         return k[0] === '$' || k[1] === '$'
//     }
//     function runEffects(state, query, val) {
//         const effect_location = !query ? state : state[query];
//         const effect = findEffect(effect_location);
//         effect(val);
//         statechart.__after_each(state_history);

//         function findEffect(state) {
//             for (let k in state) {
//                 if (is_fn(state, k)) return state[k]
//             }
//         }
//     }
//     function is_fn(obj, k) {
//         return typeof obj[k] === 'function'
//     }
// }

// // Statechart spec

// let statechart; {
// let app_state;

// const DOT = {
//     ['.']: {
//         append_to_op1,
//         ['0-9*']: { append_to_op1 }
//     }
// }

// statechart = {
//     ['OP']: {
//         eff(val) {
//             app_state.op = val;
//             app_state.op2 = app_state.op1;
//         },
//         goto: '$Op1'
//     },
//     ['C']: {
//         effects: restart_state,
//         goto: '$Op1'
//     },
//     _$Start: {
//         eff() {
//             app_state = {op1: null, op: null, op2: null}
//         },
//         goto: '$Op1'
//     },
//     $Op1: {
//         ['1-9']: {
//             effects: replace_op1,
//             ['0-9*']: {
//                 append_to_op1,
//                 ...DOT
//             },
//             ...DOT
//         },
//         ['.']: {
//             effects(_) {
//                 app_state.op1 = '0.'
//             },
//             ['0-9*']: {
//                 append_to_op1
//             }
//         },
//         ['OP']: {
//             effects(val) { app_state.op1 = '0'; app_state.op = val },
//             goto: '$Op1'
//         },
//         ['0']: {
//             effects(_) { app_state.op1 = '0' },
//             goto: '$Op1'
//         }
//     },
//     __after_each(state_history) {
//         console.log('hist', state_history);
//         render();

//         function render() {
//             if (app_state == init_state) {
//                 screen_input.textContent = '0';
//                 screen_result.textContent += '';
//                 return
//             }
//             const {op1, op, op2} = app_state;
//             screen_input.textContent = op1;
//             screen_result.textContent = op === '' ? '\xa0' :
//                     `${op1} ${op}`;

//         }
//     }
// }

//     // helpers
//     function append_to_op1(val) {
//         app_state.op1 += val;
//     }
//     function replace_op1(val) {
//         app_state.op1 = val;
//     }
//     function restart_state() {
//         app_state = {...init_state};
//     }
// }
//
// interpret(statechart)

/* v2 Imperative with CSP-ish Select (with do/while hack to avoid
declaring all events you need to await a priori) */
// async function spec_api_2(val = null) {
//     anytime({
//         ['C']: {
//             restart_state,
//             goto: '$Op1'
//         }
//     })

//     app_state = {op1: null, op: null, op2: null};

//     do {
//     if (val = await inp('1-9')) {
//         app_state.op1 = val;

//         do {
//         if (val = await inp('.')) {
//             app_state.op1 = '0';
//         }
//         if (val = await inp('.')) {
//             app_state.op1 = '0';

//         }} while (await c())
//     }
//     if (val = await inp('.')) {
//         app_state.op1 = '0';
//     }
//     if (val = await inp('OP')) {
//         app_state.op1 = '0';
//         app_state.op = val;

//     }} while (await c())
// }

// async function c() {
// }

// function anytime(spec) {
// }

/* v3: mix v1 + v2 */
// function spec_api_3() {
//     app_state = {op1: null, op: null, op2: null};

//     await or({
//         ['1-9'](val) {
//             app_state.op1 = val;

//             await or({
//                 ['0-9*'](val) {
//                     app_state.op1 += val;
//                 },
//                 ['.'](_) {
//                     app_state.op1 += '.';
//                 }
//             })
//         },
//         ['.']() {
//             app_state.op1 = '0';

//             await or({
//                 ['0-9*'](val) {
//                     app_state.op1 += val;
//                 }
//             })
//         }
//     })
// }

/* v4: statecharts with async/await -avoiding explicitliy naming states */
// let state = [];
// let inp;
// let global_events = [];

// async function $Start() {
//     global(inp => {
//         if (inp === 'C') {
//             state = [];
//         }
//     });

//     inp = await ui_in();

//     while (inp('0-9')) {
//         state_append(inp())

//         inp = await ui_in();
//         if (inp('.')) {
//             state_append(inp())

//             inp = await ui_in();
//             while (inp('0-9')) {
//                 state_append(inp())

//                 inp = await ui_in();
//             }

//             if (inp('OP')) {

//             }

//         }
//     }
//     if (inp('.')) {
//         let operator = '0.';
//         state.push(operator);
//         $Op1(operator);
//     }
//     else if (inp('OP')) {
//         state.push('0');
//         state.push(inp());
//         let operand = inp();
//         // $OP(operand);
//     }
//     else {
//         $Start();
//     }

//     async function $Op1(operator) {
//         inp = await ui_in();

//     }

//     async function $OP() {
//     }

//     /* helpers  */
//     function global(new_fn) {
//         if (global_events.length === 0) {
//             global_events.push(new_fn);
//         }
//     }

//     function state_append(inp) {
//         let last = state.pop() || '';
//         last = last.concat(inp);
//         state.push(last);
//     }
//     function eff(eff_fn) {
//         eff_fn();
//         render();
//     }
// }
// $Start();

// // HELPERS

// async function ui_in() {
//     render();

//     const ev = await events.take();
//     const inp_val = ev.target.textContent;

//     test_global_events();

//     return test;

//     function test(query) {
//         if (query === undefined) return inp_val;

//         if (query.includes('-')) {
//             const regex = new RegExp(`[${query}]`);
//             return regex.test(inp_val);
//         }

//         if (query === 'OP') {
//             return /[+|\-|x|÷]/.test(inp_val);
//         }

//         if (query === inp_val) {
//             return true;
//         }
//     }

//     function test_global_events() {
//         for (const fn of global_events) {
//             fn(inp_val);
//         }
//     }
// }

// function render() {
//     console.log('rendering, hist: ', state);
//     screen_input.textContent = state.reduce(
//         (acc, x) => acc.concat(' ', x),
//         '\xa0'
//     );
//     screen_result.textContent = '\xa0';
// }




/// Helpers
// function asyncProducer() {
//     let resolve;
//     const queue = [];

//     return {
//         async take() {
//             if (queue.length === 0) {
//                 await new Promise(res => (resolve = res));
//             }
//             return queue.shift();
//         },
//         push(event) {
//             queue.push(event);
//             resolve();
//         },
//     };
// }