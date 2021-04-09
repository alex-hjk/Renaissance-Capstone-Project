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
let ProfileService = class ProfileService {
    async GetPrivateProfile({ uid }) {
        const queryString = `select profile_pic_url, credentials,questions_count, description, avg_vote_deviation, name, email, users.uid,  avg_answer_score, answer_count, answer_vote_count from(

      (select * from rozzby.users where uid = $1) users
      LEFT JOIN (select answer_scores.answerer_id uid, AVG(answer_scores.answer_score) avg_answer_score, 
      COUNT(*) answer_count from (select answerer_id, answer_score 
                    from rozzby.answers A 
                    where A.answerer_id = $1 and A.answer_score != 0) answer_scores
                    group by (answerer_id)) answer_stats 
                    on users.uid = answer_stats.uid 
      LEFT JOIN (select count(*) answer_vote_count, uid from rozzby.answer_votes where uid = $1 group by(uid)) as answer_count
      on answer_count.uid = users.uid
      LEFT JOIN (select count(*) questions_count, asker_id uid from rozzby.questions where asker_id = $1 group by (asker_id)) questions_count
      on questions_count.uid = users.uid)`;
        const params = [uid];
        const result = await dbAccess_1.query(queryString, params);
        if (result.rows.length) {
            const { profile_pic_url, questions_count, avg_vote_deviation, name, email, uid, avg_answer_score, answer_count, answer_vote_count, description, credentials } = result.rows[0];
            return { profile_pic_url, questions_count, avg_vote_deviation, name, email, uid, avg_answer_score, answer_count, answer_vote_count, description, credentials };
        }
        else {
            throw new Error('No such user');
        }
    }
    async GetPublicProfile({ uid }) {
        const queryString = `select profile_pic_url, credentials,questions_count, description, avg_vote_deviation, name, email, users.uid,  avg_answer_score, answer_count, answer_vote_count from(

      (select * from rozzby.users) users
      LEFT JOIN (select answer_scores.answerer_id uid, AVG(answer_scores.answer_score) avg_answer_score, 
      COUNT(*) answer_count from (select answerer_id, answer_score 
                    from rozzby.answers A 
                    where A.answer_score != 0) answer_scores
                    group by (answerer_id)) answer_stats 
                    on users.uid = answer_stats.uid 
      LEFT JOIN (select count(*) answer_vote_count, uid from rozzby.answer_votes group by(uid)) as answer_count
      on answer_count.uid = users.uid
      LEFT JOIN (select count(*) questions_count, asker_id uid from rozzby.questions group by asker_id) questions_count
      on questions_count.uid = users.uid)
   WHERE users.uid = $1`;
        const params = [uid];
        const result = await dbAccess_1.query(queryString, params);
        if (result.rows.length) {
            const { profile_pic_url, name, uid, avg_answer_score, answer_count, answer_vote_count, description, questions_count, credentials } = result.rows[0];
            return { profile_pic_url, name, uid, avg_answer_score, answer_count, answer_vote_count, description, questions_count, credentials };
        }
        else {
            throw new Error('No such user');
        }
    }
    async UpdateProfile({ uid, ...fields }) {
        const queryString = ['update rozzby.users set'];
        const set = [];
        Object.entries(fields).forEach(([key], index) => {
            set.push(`${key} = $${index + 2}`);
        });
        queryString.push(set.join(', '));
        queryString.push('WHERE uid = $1');
        const params = [uid, ...Object.values(fields)];
        await dbAccess_1.query(queryString.join(' '), params);
    }
    async GetAllSubjects() {
        const queryString = 'Select * from rozzby.subjects';
        const result = await dbAccess_1.query(queryString);
        return result.rows;
    }
    async RegisterSubject({ sid, uid }) {
        const queryString = `insert into rozzby.sid_users(sid, uid) values ($1, $2)
    on conflict do nothing
    returning *
    `;
        const params = [sid, uid];
        const result = await dbAccess_1.query(queryString, params);
        if (!result.rows.length) {
            return { error: 'Already Registered', errorType: 'registered', ok: false };
        }
        else {
            return { ok: true };
        }
    }
};
ProfileService = __decorate([
    typedi_1.Service()
], ProfileService);
exports.default = ProfileService;
