import './css/index.css';
import './css/widgets.css';
import registerServiceWorker from './registerServiceWorker';
import history from './history';
import cache from './cache';

cache.init();
history.set('');
registerServiceWorker();
