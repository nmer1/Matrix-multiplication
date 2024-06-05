let matrix1 = [
    [0, 0],
    [0, 0]
];
let matrix2 = [
    [0, 0],
    [0, 0]
];
let resultMatrix = [];
let steps = [];
let currentStep = 0;

function changeMatrixSize(matrixId, dimension, change) {
    let matrix = matrixId === 'matrix1' ? matrix1 : matrix2;
    if (dimension === 'rows') {
        if (change > 0) {
            matrix.push(Array(matrix[0].length).fill(0));
        } else if (matrix.length > 1) {
            matrix.pop();
        }
    } else if (dimension === 'cols') {
        if (change > 0) {
            matrix.forEach(row => row.push(0));
        } else if (matrix[0].length > 1) {
            matrix.forEach(row => row.pop());
        }
    }
    if (matrixId === 'matrix1') {
        matrix1 = matrix;
    } else {
        matrix2 = matrix;
    }
    updateMatrixInfo();
    displayMatrices();
    checkCompatibility();
}

function updateMatrixInfo() {
    document.getElementById('matrix1-info').textContent = `Matrix 1 Dimensions: (${matrix1.length}, ${matrix1[0].length})`;
    document.getElementById('matrix2-info').textContent = `Matrix 2 Dimensions: (${matrix2.length}, ${matrix2[0].length})`;
}

function checkCompatibility() {
    const compatibilityInfo = document.getElementById('compatibility-info');
    if (matrix1[0].length !== matrix2.length) {
        compatibilityInfo.textContent = 'Matrices are not compatible for multiplication!';
    } else {
        compatibilityInfo.textContent = 'Matrices are compatible for multiplication.';
    }
}

function displayMatrices() {
    const container = document.getElementById('matrices-input');
    container.innerHTML = '';

    const matrix1Table = createMatrixTable(matrix1, 'matrix1');
    const matrix2Table = createMatrixTable(matrix2, 'matrix2');

    container.appendChild(matrix1Table);
    const timesSign = document.createElement('span');
    timesSign.textContent = ' x ';
    timesSign.style.fontSize = '24px';
    container.appendChild(timesSign);
    container.appendChild(matrix2Table);

    const calculateButton = document.createElement('button');
    calculateButton.textContent = 'Calculate Dot Product';
    calculateButton.onclick = calculateDotProduct;
    container.appendChild(calculateButton);
}

function createMatrixTable(matrix, matrixId) {
    const table = document.createElement('table');
    matrix.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((value, colIndex) => {
            const td = document.createElement('td');
            td.id = `${matrixId}-${rowIndex}-${colIndex}`;
            const input = document.createElement('input');
            input.type = 'number';
            input.value = value;
            input.onchange = (e) => {
                matrix[rowIndex][colIndex] = parseInt(e.target.value);
            };
            td.appendChild(input);
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    return table;
}

function calculateDotProduct() {
    const matrix1Rows = matrix1.length;
    const matrix1Cols = matrix1[0].length;
    const matrix2Cols = matrix2[0].length;

    if (matrix1Cols !== matrix2.length) {
        alert('Number of columns in Matrix 1 must equal number of rows in Matrix 2');
        return;
    }

    resultMatrix = Array.from({ length: matrix1Rows }, () => Array(matrix2Cols).fill(0));
    steps = [];
    currentStep = 0;

    for (let i = 0; i < matrix1Rows; i++) {
        for (let j = 0; j < matrix2Cols; j++) {
            let sum = 0;
            let description = `Calculating element (${i + 1}, ${j + 1}) = `;
            for (let k = 0; k < matrix1Cols; k++) {
                sum += matrix1[i][k] * matrix2[k][j];
                description += `${matrix1[i][k]} * ${matrix2[k][j]}`;
                if (k < matrix1Cols - 1) {
                    description += ' + ';
                }
                resultMatrix[i][j] = sum;
                steps.push({
                    step: steps.length + 1,
                    description: description + (k === matrix1Cols - 1 ? ` = ${sum}` : ''),
                    matrix1: JSON.parse(JSON.stringify(matrix1)),
                    matrix2: JSON.parse(JSON.stringify(matrix2)),
                    resultMatrix: JSON.parse(JSON.stringify(resultMatrix)),
                    highlight: {
                        matrix1: [i, k],
                        matrix2: [k, j],
                        result: [i, j]
                    }
                });
            }
        }
    }

    displayStep();
}

function displayStep() {
    const stepContainer = document.getElementById('steps-container');
    stepContainer.innerHTML = '';

    if (steps.length > 0) {
        const step = steps[currentStep];
        const description = document.createElement('p');
        description.textContent = step.description;
        stepContainer.appendChild(description);

        const resultTable = createMatrixTable(step.resultMatrix, 'resultMatrix');
        stepContainer.appendChild(resultTable);

        highlightStep(step.highlight);
    } else {
        stepContainer.textContent = 'No steps to display.';
    }
}

function highlightStep(highlight) {
    document.querySelectorAll('td').forEach(td => td.style.backgroundColor = '');
    const { matrix1, matrix2, result } = highlight;
    document.getElementById(`matrix1-${matrix1[0]}-${matrix1[1]}`).style.backgroundColor = 'yellow';
    document.getElementById(`matrix2-${matrix2[0]}-${matrix2[1]}`).style.backgroundColor = 'yellow';
    document.getElementById(`resultMatrix-${result[0]}-${result[1]}`).style.backgroundColor = 'lightgreen';
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        displayStep();
    }
}

function nextStep() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        displayStep();
    }
}

// Initial display
updateMatrixInfo();
checkCompatibility();
displayMatrices();
