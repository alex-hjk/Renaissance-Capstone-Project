"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marshallGaloisMatrix = exports.unmarshallGaloisMatrix = void 0;
const unmarshallGaloisMatrix = (data) => {
    const matrix = JSON.parse(data).values;
    for (let i = 0; i < matrix.length; i++) {
        matrix[i].forEach((att, j) => {
            matrix[i][j] = BigInt(att);
        });
    }
    return matrix;
};
exports.unmarshallGaloisMatrix = unmarshallGaloisMatrix;
const marshallGaloisMatrix = (matrix) => {
    return JSON.stringify(matrix, (key, value) => typeof value === 'bigint'
        ? value.toString()
        : value);
};
exports.marshallGaloisMatrix = marshallGaloisMatrix;
