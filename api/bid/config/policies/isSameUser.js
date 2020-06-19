'use strict';

/**
 * `isAuthenticated` policy.
 */

module.exports = async (ctx, next) => {
  if (ctx.state.user.id == ctx.request.body.idBuyUser) {
    // Go to next policy or will reach the controller's action.
    return await next();
  }
  ctx.unauthorized(`You're not logged in!`);
};
