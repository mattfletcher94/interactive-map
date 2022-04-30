export default class UserClient {

    public userId = "";
    public userFirstName = "";
    public userLastName = "";
    public userEmail = "";
    public userRole = "";
    public userCreatedAt = "";
    public userUpdatedAt = "";

    constructor({
        userId = "", 
        userFirstName = "",
        userLastName = "",
        userEmail = "",
        userRole = "",
        userCreatedAt = "",
        userUpdatedAt = "",
    } = {}) {
        this.userId = userId;
        this.userFirstName = userFirstName;
        this.userLastName = userLastName;
        this.userEmail = userEmail;
        this.userRole = userRole;
        this.userCreatedAt = userCreatedAt;
        this.userUpdatedAt = userUpdatedAt;
    }

}