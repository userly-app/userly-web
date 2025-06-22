import {GeoEntity} from "@/user/model/geo.entity.js";

export class AddressEntity {
    constructor(
        street = '',
        suite = '',
        city = '',
        zipcode = '',
        geo = new GeoEntity()
    ) {
        this.street = street;
        this.suite = suite;
        this.city = city;
        this.zipcode = zipcode;
        this.geo = geo;
    }

    static fromJson(json) {
        if (!json) return new AddressEntity();
        return new AddressEntity(
            json.street,
            json.suite,
            json.city,
            json.zipcode,
            GeoEntity.fromJson(json.geo)
        );
    }
}