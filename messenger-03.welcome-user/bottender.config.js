module.exports = {
  initialState: {
    didBotWelcomedUser: false,
  },
  channels: {
    messenger: {
      enabled: true,
      path: '/webhooks/messenger',
      pageId: process.env.MESSENGER_PAGE_ID,
      accessToken: process.env.MESSENGER_ACCESS_TOKEN,
      appId: process.env.MESSENGER_APP_ID,
      appSecret: process.env.MESSENGER_APP_SECRET,
      verifyToken: process.env.MESSENGER_VERIFY_TOKEN,
      fields: ['messages', 'messaging_postbacks'],
      profile: {
        getStarted: {
          payload: 'GET_STARTED',
        },
      }
    },
  },
};
