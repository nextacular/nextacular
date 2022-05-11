import { LogSnag } from 'logsnag';

const logsnag = new LogSnag(process.env.LOGSNAG_API_TOKEN);

export const log = (channel, event, description, icon) =>
  logsnag.publish({
    project: 'nextacular',
    channel,
    event,
    description,
    icon: icon || '🔥',
    notify: true,
  });
