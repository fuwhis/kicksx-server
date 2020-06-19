'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    prices : async (ctx) => {
        let product = await strapi.query('product').model.query(qb =>{
          qb.where({
            name : ctx.params.name,
            size : ctx.params.size
          }).select('id');
        }).fetch();
        let result = await strapi.query('bid').model.query(qb => {
          qb.where({
            idProduct : product.id
          })
          .orderBy('price','desc')
          .limit(1)
          .select('price');
        }).fetch()
        ctx.send(result);
    }
};
