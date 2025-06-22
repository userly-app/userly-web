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


export class UserEntity {
    constructor(
        id = 0,
        name = '',
        username = '',
        email = '',
        phone = '',
    ) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.phone = phone;
    }

    static fromJson(json) {
        return new UserEntity(
            json.id,
            json.name,
            json.username,
            json.email,
            json.phone
        );
    }
    static fromJsonArray(jsonArray) {
        return jsonArray.map(json => UserEntity.fromJson(json));
    }
    toJson() {
        return {
            id: this.id,
            name: this.name,
            username: this.username,
            email: this.email,
            phone: this.phone
        };
    }
}