import '@anito/site-kit/base.css';
import * as sapper from '@sapper/app';
import { startClient } from './i18n';

startClient();

sapper.start({
  target: document.querySelector('#sapper'),
});
