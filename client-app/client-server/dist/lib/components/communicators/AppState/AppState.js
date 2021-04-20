"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
let AppState = class AppState {
    initPsi() {
        this.isPending = true;
        this.timeStarted = Date.now();
        this.timeEnded = undefined;
        this.intersectionResult = undefined;
    }
    completePsi(intersectionResult, resultsRetrievalReq) {
        this.isPending = false;
        this.intersectionResult = intersectionResult;
        this.timeEnded = Date.now();
        this.resultsRetrievalReq = resultsRetrievalReq;
    }
    getIntersectionResult() {
        if (this.isPending) {
            return 'isPending';
        }
        else if (this.intersectionResult && this.timeEnded && this.timeStarted && this.resultsRetrievalReq) {
            return { intersectionResult: this.intersectionResult, timeTaken: this.timeEnded - this.timeStarted, resultsRetrievalReq: this.resultsRetrievalReq };
        }
    }
};
AppState = __decorate([
    typedi_1.Service()
], AppState);
exports.default = AppState;
