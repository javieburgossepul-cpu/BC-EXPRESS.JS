"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ============================================
// SERVER — Entry point
// ============================================
const app_1 = __importDefault(require("./app"));
const PORT = parseInt(process.env['PORT'] ?? '3000', 10);
app_1.default.listen(PORT, () => {
    console.log(`[server] Running on http://localhost:${PORT}`);
    console.log(`[server] Health: http://localhost:${PORT}/health`);
    console.log(`[server] API v1: http://localhost:${PORT}/api/v1/items`);
});
