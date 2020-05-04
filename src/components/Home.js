import React from 'react';
import moment from 'moment/moment';

import SharedComponent from './Shared';

const now = moment().format('LLLL');

const HomeComponent = () => (
  <div>
    <h1>This is the home component mohit</h1> 
    {now}
    <SharedComponent />
  </div>
);

export default HomeComponent;