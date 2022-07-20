module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        'semi': ['error', 'always'],
        'no-constant-condition': ["error", { "checkLoops": false }],
        'no-inner-declarations': 0

    }
};
