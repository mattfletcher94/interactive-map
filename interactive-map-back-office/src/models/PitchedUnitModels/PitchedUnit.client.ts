export default class PitchedUnitClient {

    public holidayTypeId = "";
    public holidayTypeName = "";
    public unitId = 0;
    public unitName = "";
    public userRole = "";
    constructor({
        holidayTypeId = "",
        holidayTypeName = "",
        unitId = 0,
        unitName = "",
    } = {}) {
        this.holidayTypeId = holidayTypeId;
        this.holidayTypeName = holidayTypeName;
        this.unitId = unitId;
        this.unitName = unitName;
    }

}