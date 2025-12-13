"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const health_routes_2 = __importDefault(require("./routes/mvp/health.routes"));
const onboarding_routes_1 = __importDefault(require("./routes/onboarding.routes"));
const chat_server_1 = require("./ws/chat.server");
app_1.app.use('/api', health_routes_1.default);
app_1.app.use('/api/health', health_routes_2.default);
app_1.app.use('/api/onboarding', onboarding_routes_1.default);
const PORT = Number(process.env.PORT) || 4000;
const server = http_1.default.createServer(app_1.app);
(0, chat_server_1.initChatWebSocket)(server);
server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`TMBC backend running at http://localhost:${PORT}`);
});
