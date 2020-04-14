const { router, payload, route, text } = require('bottender/router');
let options = [];

async function SayHi(context) {
  await context.sendSenderAction('typing_on');
  
  context.getUserProfile().then(user => {
    context.sendText(`Hi! ${user.name}`);
  })
}

async function welcomeMessage(context) {
  await context.sendSenderAction('typing_on');
  await context.sendText('Welcome to "What Should Eat for Lunch!"');
}

async function checkAddDeleteOptions(context) {
  await context.sendSenderAction('typing_on');
  context.sendText('What do you want?', {
    quickReplies: [
      {
        contentType: 'text',
        title: 'Check Options',
        payload: 'CHECK_OPTIONS',
      },
      {
        contentType: 'text',
        title: 'Add Options',
        payload: 'ADD_OPTIONS',
      },
      {
        contentType: 'text',
        title: 'Delete Options',
        payload: 'DELETE_OPTIONS',
      }
    ]
  })
}

async function addOptions(context) {
  await context.sendSenderAction('typing_on');
  await context.sendText('Please enter your lunch choice.');
  optionsStatus = 1;
  context.setState({optionsStatus});
}

async function addOrDeleteArray(context) {
  await context.sendSenderAction('typing_on');
  // add
  if(context.state.optionsStatus === 1) {
    options.push(context.event.text);
    await context.sendText(`${context.event.text} has been added!`);
  }
  // delete
  else if(context.state.optionsStatus === 2) {
    let index = options.indexOf(context.event.text);
    if(index >= 0) {
      options.splice(index, 1);
      await context.sendText(`${context.event.text} has been deleted!`);
    }
    else {
      await context.sendText(`There is no ${context.event.text} to delete!`);
    }
  }
  else {
    await context.sendText('Sorry. I do not understand what you say.');
  }
  optionsStatus = 0;
  context.setState({optionsStatus}); 
}

async function checkOptions(context) {
  await context.sendSenderAction('typing_on');
  optionsStatus = 0;
  context.setState({optionsStatus});
  if(options.length == 0) {
    await context.sendText('You have no choice for lunch.');
  }
  else {
    let allOptions = '';
    for (let i = 0; i < options.length; i++) {
      allOptions = allOptions + options[i];
      allOptions += (i == options.length - 1) ? '' : '\n';
    }
    await context.sendText(`Here's your options:\n${allOptions}`);
  }
}
async function deleteOptions(context) {
  await context.sendSenderAction('typing_on');
  optionsStatus = 0;
  context.setState({optionsStatus});
  if(options.length == 0) {
    await context.sendText('You have no choice for lunch.');
  }
  else {
    await checkOptions(context);
    await context.sendText('Which option do you wanna delete?');
    optionsStatus = 2;
    context.setState({optionsStatus});
    // let optionJSON = [];
    // for (let i = 0; i < options.length; i++) {
    //   optionJSON.push({
    //     contentType: "text",
    //     title: options[i],
    //     payload: "OPTION_" + (i+1)
    //   })
    // }
    // console.log(optionJSON);
    // await context.sendText('Choose one option to delete:', {
    //   quickReplies: [
    //     optionJSON
    //   ]
    // });
  } 
}

async function decide(context) {
  await context.sendSenderAction('typing_on');
  optionsStatus = 0;
  context.setState({optionsStatus})
  if(options.length == 0) {
    await context.sendText('You have no choice for lunch. Go to add some options!');
  }
  else {
    const finalDecision = options[Math.floor(Math.random() * options.length)];
    await context.sendText(`Let's eat ${finalDecision}!`);
  }
}

async function App() {
  return router([
    payload('GET_STARTED', welcomeMessage),
    payload('CHECK_ADD_DELETE_OPTIONS', checkAddDeleteOptions),
    payload('ADD_OPTIONS', addOptions),
    payload('DELETE_OPTIONS', deleteOptions),
    payload('CHECK_OPTIONS', checkOptions),
    payload('DECIDE', decide),
    text(/hi/i, SayHi),
    route('*', addOrDeleteArray),
  ]);
}
module.exports = App;