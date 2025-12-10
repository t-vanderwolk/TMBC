"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardForRole = dashboardForRole;
// Single source of truth for all role → dashboard mappings
function dashboardForRole(role) {
    const r = (role || "MEMBER").toUpperCase().trim();
    switch (r) {
        case "ADMIN":
            return "/dashboard/admin";
        case "MENTOR":
            return "/dashboard/mentor";
        case "MEMBER":
        default:
            return "/dashboard";
    }
}
