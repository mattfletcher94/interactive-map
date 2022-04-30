"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserClient {
    constructor({ userId = "", userFirstName = "", userLastName = "", userEmail = "", userRole = "", userCreatedAt = "", userUpdatedAt = "", } = {}) {
        this.userId = "";
        this.userFirstName = "";
        this.userLastName = "";
        this.userEmail = "";
        this.userRole = "";
        this.userCreatedAt = "";
        this.userUpdatedAt = "";
        this.userId = userId;
        this.userFirstName = userFirstName;
        this.userLastName = userLastName;
        this.userEmail = userEmail;
        this.userRole = userRole;
        this.userCreatedAt = userCreatedAt;
        this.userUpdatedAt = userUpdatedAt;
    }
}
exports.default = UserClient;
