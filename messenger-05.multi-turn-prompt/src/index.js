const { chain } = require('bottender');
const { payload } = require('bottender/router');

async function start(context, props) {
  if(context.event.payload === 'GET_STARTED') {
    await context.sendText('Type anything to start!')
  }
  else if(context.state.hasStarted === false) {
    await context.sendText('Please enter your mode of transport.', {
      quickReplies: [
        {
          contentType: 'text',
          title: 'Cars',
          payload: 'TRANSPORT'
        },
        {
          contentType: 'text',
          title: 'Bus',
          payload: 'TRANSPORT'
        },
        {
          contentType: 'text',
          title: 'Bicycle',
          payload: 'TRANSPORT'
        }
      ]
    })
    context.setState({
      hasStarted: true,
    })
  }
  else {
    return props.next;
  }
}

async function transportStep(context, props) {
  if(context.state.enterTransport === false) {
    payload('TRANSPORT', context.setState({
      userProfile: {
        transport: context.event.text
      },
      enterTransport: true
    }));
    await context.sendText('Please enter your name.');
  }
  else {
    return props.next;
  }
}

async function nameStep(context, props) {

  if(context.state.enterName === false) {
    context.setState({
      userProfile: {
        ...context.state.userProfile,
        name: context.event.text,
      }, 
      enterName: true
    })
    await context.sendText(`Thanks ${ context.state.userProfile.name }`);
    await context.sendButtonTemplate('Do you want to give your age?', [
      {
        type: 'postback',
        title: 'Yes',
        payload: 'YES',
      },
      {
        type: 'postback',
        title: 'No',
        payload: 'NO',
      }
    ])
  }
  else{
    return props.next;
  }
}

async function nameConfirmStep(context, props) {
  if(context.state.confirmedAge === false) {
    if(context.event.payload === 'YES') {
      context.setState({
        confirmedAge: true
      })
    }
    else {
      return props.next;
    }
    if(context.state.confirmedAge) {
      await context.sendText('Please enter your age.');
    }
  }
  else { 
    return props.next;
  }
}

async function ageStep(context, props) {
  if(context.state.enterAge === false) {
    if(context.event.text > 0 && context.event.text < 150) {
      context.setState({
        userProfile: {
          ...context.state.userProfile,
          age: context.event.text
        },
        enterAge: true
      })
    }
    else {
      context.setState({
        userProfile: {
          ...context.state.userProfile,
          age: -1 
        },
        enterAge: true
      }) 
    }
    if(context.state.userProfile.age === -1) {
      await context.sendText('No age given.');
      context.setState({
        confirmedAge: true
      })
    }
    else {
      await context.sendText(`I have your age as ${ context.state.userProfile.age }`);
    }
    await context.sendButtonTemplate('Is this ok?', [
      {
        type: 'postback',
        title: 'Yes',
        payload: 'YES',
      },
      {
        type: 'postback',
        title: 'No',
        payload: 'NO',
      }
    ])
  }
  else {
    return props.next;
  }
}

async function confirmStep(context) {
  if(context.state.confirmed === false) {
    if(context.event.payload === 'YES') {
      let transport = context.state.userProfile.transport;
      let name = context.state.userProfile.name;
      let age = context.state.userProfile.age;

      let msg = `I have your mode of transport as ${ transport } and your name as ${ name }`;
      if (age !== -1) {
          msg += ` and your age as ${ age }`;
      }
      msg += '.';

      await context.sendText(msg);
    }
    else {
      await context.sendText('Thanks. Your profile will not be kept.');
    }
  }
}

module.exports = async function App() {
  return chain([
    start,
    transportStep,
    nameStep,
    nameConfirmStep,
    ageStep,
    confirmStep
  ])
};
