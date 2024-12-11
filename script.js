let inputDisplay = document.getElementById('input-display');
let inputCalc = document.getElementById('input-calc');


// Disable autocomplete to prevent history from being saved
inputDisplay.setAttribute('autocomplete', 'off');
function input(value) {
    if (value === '*') {
        // value = 'x';
        value = "\u202Fx\u202F"
    }
    // Prevent multiple consecutive operators
    let currentDisplay = inputDisplay.value;
    if (isOperator(value) && isOperator(currentDisplay[currentDisplay.length - 1])) {
        // If the last character is also an operator, don't append the new one
        return;
    }
    inputDisplay.style.color = "hsl(0, 0%, 0%)"
    inputCalc.style.color = "hsl(0, 0%, 25%)"
    inputCalc.style.fontSize = '2.3rem';
    inputCalc.style.transition = '0.3s';
    this.blur();
    // Add the new value to the display
    inputDisplay.value += value;
    scrollToRight(inputDisplay);
    // Calculate the result whenever the input changes
    calculate();
}


function calculate() {
    let expression = inputDisplay.value;
    // Ensure the expression is valid before evaluating
    // expression = expression.replace(/x/g, '*');
    expression = expression.replace(/\u202Fx\u202F/g, '*');
    if (isValidExpression(expression)) {
        let result = evaluateExpression(expression);
        inputCalc.value = result;
    }
}

function onEqualClick() {
    calculate();  // Calculate the result
    // Clear the inputDisplay after calculation
    inputDisplay.value = inputCalc.value;
    inputDisplay.style.color = "hsl(0, 0%, 93%)"
    inputCalc.style.color = "hsl(0, 0%, 0%)"
    inputCalc.style.fontSize = '3rem';
}

function evaluateExpression(expression) {
    // This function will manually evaluate the expression string using switches
    // expression = expression.replace(/x/g, '*');
    expression = expression.replace(/\u202Fx\u202F/g, '*');
    let operands = [];
    let operators = [];
    let currentNumber = '';

    for (let i = 0; i < expression.length; i++) {
        let char = expression[i];

        if (isDigit(char) || char === '.') {
            currentNumber += char;
        } else if (isOperator(char)) {
            if (currentNumber) {
                operands.push(parseFloat(currentNumber));
                currentNumber = '';
            }
            operators.push(char);
        }
    }

    // Push the last number if any
    if (currentNumber) {
        operands.push(parseFloat(currentNumber));
    }

    // Start calculating based on operator precedence
    while (operators.length > 0) {
        let operator = operators.shift();
        let operand1 = operands.shift();
        let operand2 = operands.shift();
        let result = performCalculation(operand1, operand2, operator);
        operands.unshift(result);
    }

    return operands[0];
}

function performCalculation(operand1, operand2, operator) {
    switch (operator) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand1 - operand2;
        case '*':
            return operand1 * operand2;
        case '/':
            return operand1 / operand2;
        case '%':
            return operand1 % operand2;
        default:
            return 0;
    }
}

function clearDisplay() {
    inputDisplay.value = '';
    inputCalc.value = '';
    inputCalc.style.color = "hsl(0, 0%, 25%)"
    inputCalc.style.fontSize = '2.3rem';
    inputCalc.style.transition = '0.3s';
}



function deleteLast() {
    if (inputCalc.style.fontSize !== '3rem') {
        inputDisplay.value = inputDisplay.value.slice(0, -1);
        if (inputDisplay.value === '') {
            inputCalc.value = '';
        }
    }
    calculate();
}

function isDigit(char) {
    return /\d/.test(char);
}

function isOperator(char) {
    return ['+', '-', '*', '/', '%'].includes(char);
}

function isValidExpression(expression) {
    // Basic validation to avoid invalid expressions
    let lastChar = expression[expression.length - 1];
    return !isOperator(lastChar) && expression.length > 0;
}


function scrollToRight(element) {
    element.scrollLeft = element.scrollWidth;
}

document.addEventListener('keydown', function (event) {
    const key = event.key;

    // Blur the currently focused element
    if (document.activeElement) {
        document.activeElement.blur();
    }

    if (isDigit(key) || isOperator(key) || key === '.') {
        input(key);
    } else if (key === 'Enter') {
        onEqualClick();  // Simulate pressing the equal button when Enter is hit
    } else if (key === 'Backspace') {
        deleteLast();  // Simulate backspace to delete the last character
    } else if (key === 'Delete') {
        clearDisplay();
    }
});
//=======================================================