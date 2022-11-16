const Station = require("./station");

const findAll = async (param) => {

    const {page, size} = param;
    const filter = {};
    if (param.region) filter.region = "서울 " + param.region;
    if (param.brand) filter.brand = param.brand;
    if (param.isSelf) filter.isSelf = param.isSelf ? true : false;

    return Station.find(filter)
        .skip(page * size)
        .limit(size);
};

const findOneById = async (id) => {
    return Station.find({station_id: id});
}

const findOneLowestPrice = async (param) => {

    const type_mapper = {
        pg: "price_premium_gasoline",
        g: "price_gasoline",
        d: "price_diesel",
        k: "price_kerosene"
    };

    const filter = {};
    if (param.region) filter.region = "서울 " + param.region;

    return Station.findOne(filter)
        .sort(type_mapper[param.oil_type]);
}

module.exports = {findAll, findOneById, findOneLowestPrice};