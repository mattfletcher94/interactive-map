export default interface MapMarkerCreate {
    mapMarkerMap?: string;
    mapMarkerKey?: string;
    mapMarkerOrder?: number;
    mapMarkerName?: string;
    mapMarkerPositionX: number;
    mapMarkerPositionY: number;
    mapMarkerLocked?: boolean;
    mapMarkerTitle?: string;
    mapMarkerTitleDisplayType?: string;
    mapMarkerDescription?: string;
    mapMarkerPitchedUnitSelection?: string;
    mapMarkerButtonEnabled?: boolean;
    mapMarkerButtonLabel?: string;
    mapMarkerButtonURL?: string;
    mapMarkerImagesEnabled?: boolean;
    mapMarkerImages?: string[];
}