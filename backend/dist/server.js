"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const health_routes_1 = __importDefault(require("./routes/health.routes"));
app_1.app.use('/api', health_routes_1.default);
const PORT = Number(process.env.PORT) || 4000;
app_1.app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`TMBC backend running at http://localhost:${PORT}`);
});
