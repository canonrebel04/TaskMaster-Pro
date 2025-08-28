import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => {
  const messages = (await import(`./i18n/${locale}.json`)).default;
  return {
    messages
  };
  return {
    messages: messages.default
  };
});
