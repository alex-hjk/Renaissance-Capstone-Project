"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsService = void 0;
const typedi_1 = require("typedi");
const dbAccess_1 = require("../../../../common/dataAccess/dbAccess");
const algoliasearch_1 = __importDefault(require("algoliasearch"));
const ALGOLIA_ID = '0PWX34N1QY';
const ALGOLIA_SEARCH_KEY = 'd38bc1130d95c8545a598cc5f067cfcb';
const client = algoliasearch_1.default(ALGOLIA_ID, ALGOLIA_SEARCH_KEY);
const index = client.initIndex('dev_QUESTIONS');
let QuestionsService = class QuestionsService {
    async AddQuestion({ user, text, imageUrl, anonymous, timestamp, sid, tags }) {
        const queryString = `
    BEGIN;
    ${(tags && !!tags.length)
            ? `INSERT INTO rozzby.tags(name) values ${tags && tags.map(({ tagName }) => `
      ('${tagName}' ) 
    `)} on conflict do nothing; with qid as (`
            : ''}
    INSERT INTO rozzby.questions (asker_id, text, image_url, anonymous, timestamp, sid) VALUES ('${user.uid}', 
      '${text}', '${imageUrl}', ${anonymous}, ${timestamp}, ${sid}) returning qid
      
    ${(tags && !!tags.length)
            ? `  ) 
    INSERT INTO rozzby.questions_tags(tagid, qid) values `
            : ''}
    
    ${tags && tags.map(({ tagName }) => `((select id from rozzby.tags where name = '${tagName}'), (select qid from qid))`)};
    ${(tags && !!tags.length)
            ? `
    INSERT INTO rozzby.tag_categorytag(tagid, cid) values ${tags && tags.map(({ tagName, categoryId }) => `((select id from rozzby.tags where name = '${tagName}'), ${categoryId})`)} on conflict do nothing;
    `
            : ''}

    
    END;
    SELECT qid from rozzby.questions where timestamp = ${timestamp};
    `;
        try {
            const queryResult = await dbAccess_1.query(queryString);
            const qid = queryResult[queryResult.length - 1].rows[0].qid;
            await index.saveObject({ user, text, imageUrl, anonymous, timestamp, sid, objectID: qid });
            return { qid };
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
    async GetQuestions({ sid, selectedTopics, answered, selectedTags }) {
        const queryString = `
    select 
    count(QV.qid) as question_vote_count,
    tags.tagid, tags.tag_name, tags.category_name, tags.cid,
    answerer_sid_users.verified,
    answerer_sid_users.credentials answerer_credentials,
    ${answered
            ? `pending_count.pending_count,
    confirmed_count.confirmed_count,`
            : ''}
    AVG(D.score_voted) as difficulty, COUNT(D.score_voted) as difficulty_vote_count, U.tid, U.sid, U.qid,Y.aid, U.text as question_text, Y.text as answer_text, U.image_url as question_image_url, Y.image_url as answer_image_url,
     U.asker_id, U.anonymous question_anonymous ,U.timestamp as question_timestamp, Y.timestamp as answer_timestamp, Y.answerer_id, Y.answer_score, Y.anonymous as answer_anonymous,Y.num_votes_cache, Y.vote_weight_cache,Y.verified_count_cache,
    askers.name as asker_name, answerers.name as answerer_name
    from 
    rozzby.answers Y 
    inner join (select max(aid) as aid from(
    select aid, A.qid, A.answer_score from rozzby.answers A inner join
    (select qid,max(answer_score) as answer_score from rozzby.answers B group by qid) 
    B on A.qid = B.qid and A.answer_score =B.answer_score) X group by qid) Z 
    on Z.aid = Y.aid 
    right join rozzby.questions U 
    on U.qid = Y.qid
    left join rozzby.users askers
    on asker_id = askers.uid
    left join rozzby.sid_users answerer_sid_users 
    on answerer_sid_users.sid = U.sid
    and answerer_sid_users.uid = answerer_id
    left join rozzby.users answerers
    on answerer_id = answerers.uid
    left join rozzby.difficulty_votes D
    on D.qid = U.qid
    left join rozzby.questions_votes QV on QV.qid = U.qid
    left join (select QT.tagid, qid, tags.name tag_name, categorytag.name category_name, categorytag.id cid from rozzby.questions_tags QT
    inner join rozzby.tags on tags.id=QT.tagid
    inner join rozzby.tag_categorytag on tags.id = tag_categorytag.tagid
    inner join rozzby.categorytag on tag_categorytag.cid = categorytag.id) tags
    on tags.qid = U.qid
    ${answered
            ? `left join (select count(qid) pending_count, qid from rozzby.answers where answer_score = 0 group by qid) pending_count
    on pending_count.qid = U.qid
    left join (select count(qid) confirmed_count, qid from rozzby.answers where answer_score != 0 group by qid) confirmed_count
    on confirmed_count.qid = U.qid`
            : ''}
    ${sid ? ' where U.sid = $1 ' : ''}
    ${(sid && selectedTopics) ? `and tid in (${selectedTopics.map((num) => `${num}`)})` : ''}
    ${(sid && selectedTags) ? `and tags.tagid in (${selectedTags.map((num) => `${num}`)})` : ''}
    ${answered ? 'and Z.aid is not null' : 'and Z.aid is null'}
    group by (U.tid, U.sid, U.qid,Y.aid, U.text, Y.text, U.image_url, Y.image_url,
    U.difficulty, U.asker_id, U.anonymous,U.timestamp, Y.timestamp, Y.answerer_id, answerer_sid_users.verified, answerer_sid_users.credentials,
    askers.name, answerers.name ${answered
            ? ',pending_count, confirmed_count'
            : ''}
    ,tags.tagid, tags.tag_name, tags.category_name, tags.cid, QV.qid)
    order by question_timestamp desc
    `;
        const params = [];
        if (sid) {
            params.push(sid);
        }
        const queryResult = await dbAccess_1.query(queryString, params);
        const results = queryResult.rows;
        const questionHashTable = {};
        results.forEach(({ qid, tagid, tag_name, category_name, cid, ...props }) => {
            if (questionHashTable[qid]) {
                questionHashTable[qid].tags.push({ tagid, tag_name, category_name, cid });
            }
            else {
                questionHashTable[qid] = { qid, ...props, tags: [{ tagid, tag_name, category_name, cid }] };
            }
        });
        const output = Object.values(questionHashTable).map(({ tags, answerer_verified, question_vote_count, answerer_credentials, qid, aid, question_text, answer_text, question_image_url, answer_image_url, difficulty, difficulty_vote_count, asker_id, question_anonymous, question_timestamp, answer_timestamp, answerer_id, asker_name, answerer_name, tid, sid, answer_score, answer_anonymous, pending_count, confirmed_count, num_votes_cache, vote_weight_cache, verified_count_cache }) => {
            const questionInfo = { question_vote_count, tags, question_timestamp, question_anonymous, difficulty_vote_count, question_text, tid, sid, asker_id, qid, difficulty, question_image_url, asker_name, pending_count, confirmed_count };
            const r = { questionInfo };
            if (aid) {
                const answerInfo = { answerer_credentials, answerer_verified, aid, answer_timestamp, answerer_id, answerer_name, answer_text, answer_score, answer_image_url, answer_anonymous, num_votes_cache, vote_weight_cache, verified_count_cache };
                r.answerInfo = [answerInfo];
            }
            return r;
        });
        return output;
    }
    async GetQuestionAndAnswerById({ qid, uid }) {
        const queryString = `
    select answer_sid_users.verified answerer_verified,answer_sid_users.credentials answerer_credentials, vote.score_voted answer_vote, AVG(D.score_voted) as difficulty, COUNT(D.score_voted) as difficulty_vote_count, 
    A.text question_text, A.image_url question_image_url, A.asker_id asker_id, A.anonymous question_anonymous, 
    A.qid, A.timestamp question_timestamp, A.sid, tid,
    B.answerer_id answerer_id, B.image_url answer_image_url, B.answer_score answer_score, B.anonymous answer_anonymous, B.aid,B.num_votes_cache, B.vote_weight_cache, B.verified_count_cache,
    B.text answer_text, 
    B.timestamp answer_timestamp,
    askers.name asker_name, answerers.name answerer_name
    from rozzby.questions A
    left join rozzby.answers B on A.qid=B.qid and A.qid = $1
    left join rozzby.difficulty_votes D
    on D.qid = A.qid  
    inner join rozzby.users askers
    on askers.uid = A.asker_id
    left join rozzby.users answerers
    on answerers.uid = B.answerer_id
    left join (select score_voted, aid from rozzby.answer_votes v where v.uid = $2) as vote
    on vote.aid = B.aid
    left join rozzby.sid_users answer_sid_users 
    on answer_sid_users.uid = B.answerer_id
    and answer_sid_users.sid = A.sid
    where A.qid = $1
    group by(answer_sid_users.verified, answer_sid_users.credentials, A.text, A.image_url, A.asker_id, A.anonymous, B.num_votes_cache, B.vote_weight_cache, B.verified_count_cache,
    A.qid, A.timestamp, A.difficulty, A.sid, tid,
    B.answerer_id, B.image_url, B.answer_score, B.anonymous, B.text, B.qid,
    B.timestamp, B.aid,askers.name, answerers.name, vote.score_voted)
    order by B.answer_score desc,
    B.timestamp asc
    `;
        const queryStringTags = `
    select QT.tagid, qid, tags.name tag_name, categorytag.name category_name, categorytag.id cid from rozzby.questions_tags QT
    inner join rozzby.tags on tags.id=QT.tagid
    inner join rozzby.tag_categorytag on tags.id = tag_categorytag.tagid
    inner join rozzby.categorytag on tag_categorytag.cid = categorytag.id
    where qid= $1
    `;
        const queryStringQuestionVotes = `
    select count(*) question_vote_count from rozzby.questions_votes where qid = $1 
    `;
        const params = [qid, uid];
        const queryResults = await dbAccess_1.query(queryString, params);
        const queryResultsTags = await dbAccess_1.query(queryStringTags, [qid]);
        const queryQuestionVotes = await dbAccess_1.query(queryStringQuestionVotes, [qid]);
        const results = queryResults.rows;
        let confirmed_count = 0;
        let pending_count = 0;
        const answerResults = results.map(({ verified_count_cache, answerer_verified, answerer_credentials, answer_vote, answer_text, answerer_id, answer_anonymous, answer_image_url, answer_score, answer_timestamp, aid, answerer_name, vote_weight_cache, num_votes_cache }) => {
            if (answer_score !== null) {
                if (answer_score === 0) {
                    pending_count++;
                }
                else {
                    confirmed_count++;
                }
            }
            return ({
                answerer_credentials, verified_count_cache, answerer_verified, answer_vote, answer_anonymous, answer_timestamp, answer_image_url, answer_score, answer_text, answerer_id, aid, answerer_name, vote_weight_cache, num_votes_cache
            });
        });
        const { asker_name, difficulty, asker_id, sid, tid, question_image_url, question_text, difficulty_vote_count, question_anonymous, question_timestamp, qid: resultQid } = results[0];
        const tags = queryResultsTags.rows;
        const { question_vote_count } = queryQuestionVotes.rows[0];
        const questionResults = { question_vote_count, tags, asker_name, difficulty, qid: resultQid, asker_id, sid, tid, question_image_url, question_text, difficulty_vote_count, question_anonymous, question_timestamp, pending_count, confirmed_count };
        const output = {
            questionInfo: questionResults,
            ...(answerResults[0].aid ? { answerInfo: answerResults } : null)
        };
        return output;
    }
    async DeleteQuestion({ qid, uid }) {
        const queryString = 'delete from rozzby.questions where qid = $1 and asker_id = $2';
        const params = [qid, uid];
        try {
            await dbAccess_1.query(queryString, params);
        }
        catch (e) {
            throw Error(e.message);
        }
    }
    async UpvoteQuestion({ qid, uid }) {
        const queryString = `
    BEGIN;
    insert into rozzby.questions_votes (qid, uid) values (${qid},'${uid}') on conflict do nothing;
    END;
    `;
        try {
            await dbAccess_1.query(queryString);
        }
        catch (e) {
            throw Error(e.message);
        }
    }
};
QuestionsService = __decorate([
    typedi_1.Service()
], QuestionsService);
exports.QuestionsService = QuestionsService;
