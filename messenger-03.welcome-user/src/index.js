const {route, router, text, payload} = require('bottender/router');

async function welcomeMessage(context) {
  await context.sendText('Welcome to the \'Welcome User\' Bot. This bot will introduce you to welcoming and greeting users.');
  await context.sendText('You are seeing this message because you press \'Get Started\' button,\
        indicating messenger bot received GET_STARTED payload and you join the conversation.\
        You can read more infomation at https://bottender.js.org/docs/en/channel-messenger-profile#setting-get-started-button');
  await context.sendText('It is a good pattern to use this event to send general greeting to user, explaining what your bot can do.\
        In this example, the bot handles \'hello\', \'hi\', \'help\' and \'intro\'.\
        Try it now, type \'hi\'');
}

async function onMessage(context) {
  if(context.state.didBotWelcomedUser === false) {
    // const userName = {user_full_name};
    await context.sendText('You are seeing this message because this was your first message ever sent to this bot.');
    // await context.sendText(`It is a good practice to welcome the user and provide personal greeting. For example, welcome ${ userName }.`);

    context.setState({didBotWelcomedUser: true});
  }
  else {
    context.sendText(`You said ${context.event.text}`);
  }
}

async function sendIntroCard(context) {
  await context.sendGenericTemplate([
    {
      title: "Welcome to Bottender!",
      // imageUrl: 'https://petersfancybrownhats.com/company_image.png',
      subtitle: "This Introduction card introduces your Bot to the user to get them started.",
      buttons: [ 
        {
          type: 'web_url',
          url: 'https://bottender.js.org/docs/en/getting-started',
          title: 'Get an overview',
        },
        {
          type: 'web_url',
          url: 'https://github.com/Yoctol/bottender/issues',
          title: 'Ask a question',
        },
        {
          type: 'web_url',
          url: 'https://bottender.js.org/docs/en/advanced-guides-deployment',
          title: 'Learn how to deploy',
        }, 
      ],
    }
  ]);
}

async function introduction(context) {
  await context.sendText(`This is a simple Welcome Bot sample. You can say 'intro' to see the introduction card.`)
}

async function App() {
  return router([
    payload('GET_STARTED', welcomeMessage),
    text(/^hi|hello$/i, onMessage),
    text(/^intro|help$/i, sendIntroCard),
    route('*', introduction),
  ])
};

module.exports = App;