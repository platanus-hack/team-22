import { Route, Switch } from 'wouter';
import HomePage from '../pages/home';
import ProfilePage from '@/pages/profile';
import JournalPage from '@/pages/journal';
import ChatPage from '@/pages/chat';

const RoutesConfig = () => (
  <Switch>
    <Route path='/' component={HomePage} />
    <Route path='/journal' component={JournalPage} />
    <Route path='/profile' component={ProfilePage} />
    <Route path='/chat' component={ChatPage} />
  </Switch>
);

export default RoutesConfig;
