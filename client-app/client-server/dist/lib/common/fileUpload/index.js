"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_secret_1 = require("../../../aws-secret");
const s3 = new s3_1.default({ secretAccessKey: aws_secret_1.secretAccessKey, accessKeyId: aws_secret_1.accessKeyId, region: aws_secret_1.region });
exports.upload = multer_1.default({
    storage: multer_s3_1.default({
        s3,
        bucket: aws_secret_1.bucketName,
        acl: 'public-read',
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: 'TESTING METADATA' });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        }
    })
});
