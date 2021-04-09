"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryIsAnswerVoteRequest = void 0;
const queryIsAnswerVoteRequest = (query) => {
    if (query.aid && (query.vote || query.vote === 0) && query.vote <= 10) {
        return true;
    }
    else {
        return false;
    }
};
exports.queryIsAnswerVoteRequest = queryIsAnswerVoteRequest;
