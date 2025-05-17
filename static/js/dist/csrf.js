export function getCSRFToken() {
    var _a;
    const cookieValue = (_a = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))) === null || _a === void 0 ? void 0 : _a.split('=')[1];
    return cookieValue || '';
}
//# sourceMappingURL=csrf.js.map