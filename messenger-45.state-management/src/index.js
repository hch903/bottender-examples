const { router, payload, text } = require('bottender/router');
async function getStarted(context) {
  await context.sendText('Welcome to State Bot Sample. Type anything to get started.');
}
async function onMessage(context) {
  
  if (!context.state.userProfile) {
    // First time around this is undefined, so we will prompt user for name.
    if (context.state.promptedForUserName) {
      // Set the name to what the user provided.
      context.setState({
        userProfile: {
          name: context.event.text,
        }
      })

      // Acknowledge that we got their name.
      await context.sendText(`Thanks ${ context.state.userProfile.name }. To see conversation data, type anything.`);
      
      // Reset the flag to allow the bot to go though the cycle again.
      context.setState({
        promptedForUserName: false
      });
    }
    else {
      // Prompt the user for their name.
      await context.sendText('What is your name?');

      // Set the flag to true, so we don't prompt in the next turn.
      context.setState({
        promptedForUserName: true
      })
    }
  }
  else {
    context.setState({
      timestamp: Date(context.event._rawEvent.timestamp).toLocaleString(),
      channel: context.platform
    })
    await context.sendText(`${ context.state.userProfile.name } sent: ${ context.event.text }`);
    await context.sendText(`Message received at: ${ Date(context.event._rawEvent.timestamp).toLocaleString() }`);
    await context.sendText(`Message received from: ${ context.platform }`)
  }
}
module.exports = async function App() {
  return router([
    payload('GET_STARTED', getStarted),
    text('*', onMessage)
  ])
}