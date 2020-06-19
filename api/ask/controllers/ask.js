'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
    index: async function (ctx) {
        console.log("hi");
        ctx.send('Hello World!');
      },
    prices : async (ctx) => {
        let product = await strapi.query('product').model.query(qb =>{
          qb.where({
            name : ctx.params.name,
            size : ctx.params.size
          }).select('id');
        }).fetch();
        let lowestAsk = await strapi.query('ask').model.query(qb => {
          qb.where({
            idProduct : product.id
          })
          .orderBy('price')
          .limit(1)
          .select('price');
        }).fetch();
        let highestBid = await strapi.query('bid').model.query(qb => {
          qb.where({
            idProduct : product.id
          })
          .orderBy('price','desc')
          .limit(1)
          .select('price');
        }).fetch();
        let result = [lowestAsk,highestBid];
        ctx.send(result);
    }
};
