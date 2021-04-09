"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = void 0;
const express_1 = __importDefault(require("express"));
const components_1 = __importDefault(require("./lib/components"));
const app = express_1.default();
exports.PORT = process.env.PORT || 5000;
app.use('/api', components_1.default);
app.get('/', (req, res) => {
    res.send('Client endpoint reached');
});
app.listen(exports.PORT, () => console.log(`server started on port ${exports.PORT}`));
