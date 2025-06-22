export class CompanyEntity {
    constructor(
        name = '',
        catchPhrase = '',
        bs = ''
    ) {
        this.name = name;
        this.catchPhrase = catchPhrase;
        this.bs = bs;
    }

    static fromJson(json) {
        if (!json) return new CompanyEntity();
        return new CompanyEntity(json.name, json.catchPhrase, json.bs);
    }
}