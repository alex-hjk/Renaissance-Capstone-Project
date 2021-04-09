"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryIsDifficultyVoteRequest = void 0;
const queryIsDifficultyVoteRequest = (query) => {
    if (query.qid && query.vote && query.vote <= 5) {
        return true;
    }
    else {
        return false;
    }
};
exports.queryIsDifficultyVoteRequest = queryIsDifficultyVoteRequest;
