export default class UserClient {

    public userId : string = "";
    public userFirstName : string = "";
    public userLastName : string = "";
    public userEmail: string = "";
    public userRole: string = "";
    public userCreatedAt: string = "";
    public userUpdatedAt: string = "";

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