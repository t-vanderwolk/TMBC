"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInviteCode = generateInviteCode;
function generateInviteCode() {
    return 'TMB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}
