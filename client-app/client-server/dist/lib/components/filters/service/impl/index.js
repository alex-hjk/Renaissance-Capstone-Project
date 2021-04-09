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
let FilterService = class FilterService {
    async GetTopicsBySubjectId({ sid }) {
        const queryString = 'select A.tid, B.name from rozzby.subject_topic A, rozzby.topics B where A.tid=B.id and sid = $1';
        const params = [sid];
        const result = await dbAccess_1.query(queryString, params);
        const topics = result.rows;
        return topics;
    }
    async GetCatogoriesAndTagsBySubjectId({ sid }) {
        const queryString = `
    select A.id category_id, A.name category_name, tagid, C.name tag_name  from rozzby.categorytag A 
    left join rozzby.tag_categorytag B on A.id = B.cid 
    left join rozzby.tags C on C.id = B.tagid
    where sid = $1 `;
        const params = [sid];
        const result = await dbAccess_1.query(queryString, params);
        const categoriesAndTags = {};
        result.rows.forEach(({ category_id, category_name, tagid, tag_name }) => {
            if (!categoriesAndTags[category_id]) {
                categoriesAndTags[category_id] = {
                    categoryName: category_name,
                    tags: (tagid && tag_name) ? [{ tagId: tagid, tagName: tag_name }] : []
                };
            }
            else {
                if (tagid && tag_name) {
                    categoriesAndTags[category_id].tags.push({ tagId: tagid, tagName: tag_name });
                }
            }
        });
        return categoriesAndTags;
    }
};
FilterService = __decorate([
    typedi_1.Service()
], FilterService);
exports.default = FilterService;
