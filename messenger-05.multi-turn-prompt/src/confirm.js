exports.yes = async(context) => {
    let transport = context.state.transport;
    let name = context.state.name;
    let age = context.state.age;

    let msg = `I have your mode of transport as ${ transport } and your name as ${ name }`;
    if (age !== -1) {
        msg += ` and your age as ${ age }`;
    }
    msg += '.';

    await context.sendText(msg);
}

exports.no = async(context) => {
    await context.sendText('Thanks. Your profile will not be kept.');
}