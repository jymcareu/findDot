import React from 'react';
import {Router, Route, IndexRoute} from 'dva/router';
// 登录页
import IndexPage from './routes/IndexPage';
import CreateTemp from './routes/createTemp/CreateTemp';

function RouterConfig ({history}) {
  return (
    <Router history={history}>
      <Route path="/" component={CreateTemp}> </Route>
    </Router>
  );
}

export default RouterConfig;
