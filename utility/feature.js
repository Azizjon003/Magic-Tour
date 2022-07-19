class FeatureAPI {
  constructor(clientQuery, databaseQuery) {
    this.clientQuery = clientQuery;
    this.databaseQuery = databaseQuery;
  }

  filter() {
    const querys = { ...this.clientQuery };
    let queryStr = JSON.stringify(querys);

    let arr = ["field", "sort", "page", "limit"];

    arr.forEach((val) => delete queryStr[val]);

    queryStr = queryStr.replace(/\bgt|gte|lt|lte\b/g, (val) => `$${val}`);
    //advenced Filter

    const queryDb = JSON.parse(queryStr);
    this.databaseQuery = this.databaseQuery.find(queryDb);
    return this;
  }

  sorting() {
    if (this.clientQuery.sort) {
      let sortReq = this.clientQuery.sort.split(",").join(" ");
      this.databaseQuery = this.databaseQuery.sort(sortReq);
    } else {
      this.databaseQuery = this.databaseQuery.sort("starDates");
    }

    return this;
  }

  field() {
    if (this.clientQuery.field) {
      let fieldReq = this.clientQuery.field.split(",").join(" ");
      this.databaseQuery = this.databaseQuery.select(fieldReq);
    } else {
      this.databaseQuery = this.databaseQuery.select("-__v");
    }
    return this;
  }

  pagination() {
    const page = this.clientQuery.page * 1 || 1;
    const limit = this.clientQuery.limit * 1 || 3;
    const skip = (page - 1) * limit;

    // if (this.clientQuery.page) {
    //   // const result = await this.databaseQuery.numberDocuments();
    //   if (skip > result) {
    //     throw new Error("This page does not exist");
    //   }
    // }

    this.databaseQuery = this.databaseQuery.skip(skip).limit(limit);
    return this;
  }
}

module.exports = FeatureAPI;
