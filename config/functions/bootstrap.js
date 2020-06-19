'use strict';

const _ = require('lodash');
module.exports = async cb => {
  const pluginStore = strapi.store({
    environment: '',
    type: 'plugin',
    name: 'users-permissions'
  });

  const grantConfig = {
    facebook: {
      enabled: false,
      icon: 'facebook-official',
      key: '',
      secret: '',
      callback: '/auth/facebook/callback',
      redirect_uri: 'http://localhost:8000/connect/facebook/callback',
      scope: ['email']
    }
  };
  const prevGrantConfig = (await pluginStore.get({ key: 'grant' })) || {};
  // store grant auth config to db
  // when plugin_users-permissions_grant is not existed in db
  // or we have added/deleted provider here.
  if (
    !prevGrantConfig ||
    !_.isEqual(_.keys(prevGrantConfig), _.keys(grantConfig))
  ) {
    // merge with the previous provider config.
    _.keys(grantConfig).forEach(key => {
      if (key in prevGrantConfig) {
        grantConfig[key] = _.merge(grantConfig[key], prevGrantConfig[key]);
      }
    });
    await pluginStore.set({ key: 'grant', value: grantConfig });
  }
  cb();
};

module.exports = () => {};
