"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const dbAccess_1 = require("../../../../common/dataAccess/dbAccess");
let AnswersService = class AnswersService {
    async AddAnswer({ answerer_id, total_vote_weight, answer_score, anonymous, qid, text, timestamp, image_url }) {
        const queryString = 'INSERT INTO rozzby.answers (answerer_id, text, qid, anonymous,answer_score,total_vote_weight, timestamp, image_url) VALUES ($1, $2, $3, $4, $5, $6,$7, $8)';
        const params = [answerer_id, text, qid, anonymous, answer_score, total_vote_weight, timestamp, image_url];
        try {
            await dbAccess_1.query(queryString, params);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
    async DeleteAnswer({ aid, uid }) {
        const queryString = 'DELETE FROM rozzby.answers where aid=$1 and answerer_id=$2';
        const params = [aid, uid];
        try {
            await dbAccess_1.query(queryString, params);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
};
AnswersService = __decorate([
    typedi_1.Service()
], AnswersService);
exports.default = AnswersService;
