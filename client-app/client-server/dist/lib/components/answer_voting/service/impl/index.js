"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerVoteService = void 0;
const typedi_1 = require("typedi");
const dbAccess_1 = require("../../../../common/dataAccess/dbAccess");
let AnswerVoteService = class AnswerVoteService {
    async AddVote({ aid, uid, vote }) {
        const queryString = `
    DO 
    $do$
    DECLARE mean_score double precision;
    BEGIN

    INSERT INTO rozzby.answer_votes (uid, score_voted, aid) 
        VALUES ('${uid}',${vote},${aid})
        ON CONFLICT (uid, aid) DO UPDATE 
          SET uid = excluded.uid,
          aid = excluded.aid,
          score_voted = excluded.score_voted;

    -- Caching is for easy retreival of vote weights when querying for answers. Note: This design can possibly be improved
    UPDATE rozzby.answers
  set (verified_count_cache, num_votes_cache, vote_weight_cache) =
  (select COUNT(D.verified) filter (where D.verified = true) verified_count_cache, COUNT(A.aid) num_votes_cache, SUM((1/C.avg_vote_deviation)) vote_weight_cache
  from rozzby.answers A, rozzby.answer_votes B, rozzby.users C, rozzby.sid_users D, rozzby.questions E
  where A.aid = B.aid and C.uid=B.uid and B.aid = ${aid} and D.uid = C.uid and E.sid = D.sid and A.qid = E.qid
    group by (A.aid)
  )
  where aid = ${aid}
  ;
    IF
    (select sum(1/(avg_vote_deviation)) from rozzby.answer_votes A, rozzby.users B 
    where A.committed = false and A.uid = B.uid and aid = ${aid} group by (aid)) > (select threshold from rozzby.subjects A, rozzby.answers B, rozzby.questions C where B.qid = C.qid and A.id = C.sid and B.aid = ${aid})
    THEN 
    
    select SUM(A.SCORE_VOTED * (1/B.avg_vote_deviation))/ SUM((1/B.avg_vote_deviation)) as mean_score
    into mean_score
    from rozzby.answer_votes A, rozzby.users B where A.uid = B.uid and aid =${aid};

    update rozzby.users A
    set avg_vote_deviation = ((deviation + A.avg_vote_deviation*A.num_votes)/(A.num_votes+1) ),
    num_votes = num_votes+1
    from (
    select ABS(A.score_voted- mean_score) as deviation, B.uid
    from rozzby.answer_votes A, rozzby.users B where aid = ${aid} and A.uid=B.uid
    ) as B
    where A.uid = B.uid;
    
    update rozzby.answer_votes
    set committed=true
    where aid=${aid};

    update rozzby.answers 
    set answer_score = mean_score
    where aid = ${aid};

    ELSE 
    
    END IF;
    
    COMMIT;
    
    END 
    $do$
    `;
        try {
            await dbAccess_1.query(queryString);
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
};
AnswerVoteService = __decorate([
    typedi_1.Service()
], AnswerVoteService);
exports.AnswerVoteService = AnswerVoteService;
