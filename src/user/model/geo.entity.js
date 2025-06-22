export class GeoEntity {
    constructor(
        lat = '',
        lng = ''
    ) {
        this.lat = lat;
        this.lng = lng;
    }

    static fromJson(json) {
        if (!json) return new GeoEntity();
        return new GeoEntity(json.lat, json.lng);
    }
}