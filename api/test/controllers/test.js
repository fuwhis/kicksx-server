/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const bodyParser = require("body-parser");
const Nexmo = require("nexmo");
const dotenv = require("dotenv").config();
// response products limitation for each "brand"
const PRODUCT_LIMIT = 6;

const nexmo = new Nexmo({
  // Don't forget to add your keys to the .env file!
  // You can find yours once you log into your Nexmo dashboard
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET
});

module.exports = {
  index: async ctx => {
    var phoneNumber = ctx.request.body.number;
    console.log(phoneNumber);
    ctx.send(phoneNumber);
    ctx.send("Hello World!");
  },
  requests: async ctx => {
    // A user registers with a mobile phone number
    var phoneNumber = ctx.request.body.number;
    console.log(phoneNumber);
    nexmo.verify.request(
      { number: phoneNumber, brand: "Kicksx" },
      (err, result) => {
        if (err) {
          console.log(err);
          // Oops! Something went wrong, respond with 500: Server Error
          ctx.respone.status(500).send({ error_text: err.message });
        } else {
          console.log(result);
          if (result && result.status == "0") {
            // A status of 0 means success! Respond with 200: OK
            ctx.respone.status(200).send(result);
          } else {
            // A status other than 0 means that something is wrong with the request. Respond with 400: Bad Request
            // The rest of the status values can be found here: https://developer.nexmo.com/api/verify#status-values
            ctx.respone.status(400).send(result);
          }
        }
      }
    );
  },
  testsss: async ctx => {
    var phoneNumber = ctx.body.number;
    console.log(phoneNumber);
    ctx.send(phoneNumber);
  },
  checks: async ctx => {
    let code = ctx.request.body.code;
    let requestId = ctx.request.body.request_id;

    console.log("Code: " + code + " Request ID: " + requestId);

    nexmo.verify.check({ request_id: requestId, code: code }, (err, result) => {
      if (err) {
        console.log(err);
        // Oops! Something went wrong, respond with 500: Server Error
        ctx.respone.status(500).send({ error_text: err.message });
      } else {
        console.log(result);
        if (result && result.status == "0") {
          // A status of 0 means success! Respond with 200: OK
          ctx.respone.status(200).send(result);
          console.log("Account verified!");
        } else {
          // A status other than 0 means that something is wrong with the request. Respond with 400: Bad Request
          // The rest of the status values can be found here: https://developer.nexmo.com/api/verify#status-values
          ctx.respone.status(400).send(result);
          console.log("Error verifying account");
        }
      }
    });
  },
  // GET /landingProducts
  landingProducts: async (ctx) => {
    // if(Object.entries(ctx.request.query).length === 0) {
    //   ctx.request.query = { _limit: 10, _start: 10 };
    // }
    // let data = await strapi.query('product').find(ctx.request.query);

    //brands data for each query
    let sneakerBrand = ["Most Popular Sneakers", "NIKE", "JORDAN", "ADIDAS", "YEEZY"];
    let sneakerFlag = 0;
    let streetwBrand = ["Most Popular Streetwears", "ELSE", "KAWS", "Supreme", "ASSC"];
    let streetwFlag = 1;
    let respondDTO = [
        {
          type: "SNEAKER",
          products: []
        },
        {
          type:"STREETWEAR",
          products: []
        }
      ];
    async function getData(brands, flag) {
        for(let data of brands) {
            let result = await strapi.query('product').model.query( qb => {
                //qb.where('brand', 'nike').orWhere('brand','JORDAN');
                qb.select('id', 'name', 'brand', 'img', 'sellPrice', 'buyPrice');
                if(data === "Most Popular Sneakers") {
                    qb.where('type', 'Sneaker').limit(PRODUCT_LIMIT);
                }
                else if(data === "Most Popular Streetwears") {
                    qb.where('type', 'Streetwear').limit(PRODUCT_LIMIT);
                }
                else {
                qb.where('brand', `${data}`).limit(PRODUCT_LIMIT);
                }
            }).fetchAll();
      
            respondDTO[flag].products.push({
                name: `${data}`,
                detail: [ ...result ]
            });
        };
      }

    await getData(sneakerBrand, sneakerFlag);
    await getData(streetwBrand, streetwFlag);

    return respondDTO;
  }
};
