'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    searchBar: async(ctx) =>{
        let result = await strapi.query('product').model.query(qb => {
            qb.select('name');
          }).fetchAll();
        ctx.send(result);
    }
    
};