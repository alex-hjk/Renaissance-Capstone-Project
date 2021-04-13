"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let CloudUrlCache = class CloudUrlCache {
    constructor() {
        this.setCloudUrl = (cloudUrl) => {
            this.cloudUrl = cloudUrl;
        };
        this.getCloudUrl = () => {
            if (!this.cloudUrl) {
                throw new Error('Cloud Url is undefined!');
            }
            return this.cloudUrl;
        };
    }
};
CloudUrlCache = __decorate([
    typedi_1.Service()
], CloudUrlCache);
exports.default = CloudUrlCache;
