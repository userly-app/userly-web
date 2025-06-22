/*
* JSON:
* {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
      "street": "Kulas Light",
      "suite": "Apt. 556",
      "city": "Gwenborough",
      "zipcode": "92998-3874",
      "geo": {
        "lat": "-37.3159",
        "lng": "81.1496"
      }
    },
    "phone": "1-770-736-8031 x56442",
    "website": "hildegard.org",
    "company": {
      "name": "Romaguera-Crona",
      "catchPhrase": "Multi-layered client-server neural-net",
      "bs": "harness real-time e-markets"
    }
  },
* */

import {AddressEntity} from "@/user/model/address.entity.js";
import {CompanyEntity} from "@/user/model/company.entity.js";

export class UserEntity {
    constructor(
        id = 0,
        name = '',
        username = '',
        email = '',
        address = new AddressEntity(),
        phone = '',
        website = '',
        company = new CompanyEntity()
    ) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.address = address;
        this.phone = phone;
        this.website = website;
        this.company = company;
    }

    static fromJson(json) {
        if (!json) return new UserEntity();
        return new UserEntity(
            json.id,
            json.name,
            json.username,
            json.email,
            AddressEntity.fromJson(json.address),
            json.phone,
            json.website,
            CompanyEntity.fromJson(json.company)
        );
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            username: this.username,
            email: this.email,
            address: {
                street: this.address.street,
                suite: this.address.suite,
                city: this.address.city,
                zipcode: this.address.zipcode,
                geo: {
                    lat: this.address.geo.lat,
                    lng: this.address.geo.lng
                }
            },
            phone: this.phone,
            website: this.website,
            company: {
                name: this.company.name,
                catchPhrase: this.company.catchPhrase,
                bs: this.company.bs
            }
        };
    }
}