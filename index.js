"use strict"

// let string1 = '123 * ';
// console.log(string1.match(/\d+\s[*+/-]\s(?!(\d+))/));

const displayN = document.querySelector('.display > p#number');
const numeros = [...document.querySelectorAll("div[id^='n'][class*='div-buttons']")];
let pilha = '';

// ------------------------------ NUMERO -------------------------------
numeros.forEach((e) => {
    e.addEventListener('click', (event) => {
        let numero = event.target.innerText;
        displayN.innerText += numero;
        pilha += numero;
    });
});

// ------------------------------ OPERADOR -------------------------------
const displayO = document.querySelector('.display > p#operator');
const operadores = [...document.querySelectorAll('div.operator-class')];
operadores.forEach((e) => {
    e.addEventListener('click', (event) => {
        if (pilha.length === 0) return;

        let operador = event.target.innerText;

        if (pilha.match(/(\d|\.)+\s[+/*-]\s\d+/) !== null) {
            realizarCalculo();
        }

        if (pilha.match(/.+[*+/-]\s(?!(\d+))/) !== null) //lookahead negativo (?!'expressao')
            pilha = pilha.substring(0, pilha.length - 3);

        pilha += ' ' + operador + ' ';
        displayN.innerText = '';
        displayO.innerText = `${pilha}`;
    })
});

// ------------------------------ CALCULO -------------------------------
function realizarCalculo() {
    let calculo = calcular(pilha);
    if (calculo - Math.floor(calculo) !== 0) {
        calculo = parseFloat(calculo.toFixed(5));
    }
    displayN.innerText = calculo;
    displayO.innerText = '';

    pilha = String(calculo);
}

const equals = document.querySelector('#equals');
equals.addEventListener('click', () => {
    realizarCalculo();
});

const mapFunctions = new Map();
mapFunctions.set('*', (n1, n2) => { return n1 * n2 });
mapFunctions.set('+', (n1, n2) => { return n1 + n2 });
mapFunctions.set('-', (n1, n2) => { return n1 - n2 });
mapFunctions.set('/', (n1, n2) => {
    if (n2 === 0) {
        return 0;
    }
    return n1 / n2;
});

function calcular(pilha) {
    let temp = pilha.split(' ');
    let n1 = Number(temp[0]);
    let n2 = Number(temp[2]);
    let operator = temp[1];

    return mapFunctions.get(operator)(n1, n2);
}

// ------------------------------ DESFAZER -------------------------------
const c = document.querySelector('#c');
const ce = document.querySelector('#ce');

c.addEventListener('click', () => {
    let substring = pilha.substring(0, pilha.length - 1);
    let temp = substring.split(' ');

    if (temp[1] && temp[2] === undefined) {
        displayN.innerText = '';
        return;
    }

    pilha = substring;

    if (temp[2] !== undefined) {
        displayN.innerText = temp[2];
    }
    else {
        displayN.innerText = pilha;
    }
});

ce.addEventListener('click', () => {
    pilha = '';
    displayN.innerText = '';
    displayO.innerText = '';
});

// ------------------------------ PONTO -------------------------------
const period = document.querySelector('#period');

period.addEventListener('click', () => {
    let temp = pilha.split(' ');

    if (temp[2] !== undefined) {
        if (temp[2].indexOf('.') !== -1) return;
        if (temp[2] === '') {
            pilha += '0';
            displayN.innerText += '0';
        }

    } else {
        if (temp[0].indexOf('.') !== -1) return;
        if (temp[0] === '') {
            pilha += '0';
            displayN.innerText += '0';
        }
    }

    pilha += '.';
    displayN.innerText += '.';
})

// ------------------------------ EXIBIDOR -------------------------------
const btn_mostrador = document.querySelector("button#btn-exibidor");
btn_mostrador.addEventListener("click", (event) => {
    const corpo_externo = document.querySelector('.corpo-externo');
    corpo_externo.classList.toggle('exibir-calculadora');
    if (corpo_externo.classList.contains('exibir-calculadora')) {
        event.target.innerText = '<';
    } else {
        event.target.innerText = '>';
    }
});

// ------------------------------ COPIAR CONTEUDO -------------------------------
const cpy = document.querySelector('#cpy');
cpy.addEventListener('click', () => {
    // displayN.select(); so funciona com input
    navigator.clipboard.writeText(displayN.innerText);
});