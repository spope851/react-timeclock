# One component that adds a timeclock to any react project
- clock in/out
- record what you've accomplished in each working session
- view total number of hours logged to your project
- remove time stamps

### This feature uses classes from [Animate.css](https://animate.style)
if you want the animation, follow their documentation to import their stylesheet at the root of your project, or use the cdn

```javascript
// _app.tsx
import 'animate.css'
```

### I recommend using `react-router-dom` to render this component on a separate page in any project you're working on

```javascript
import { Timeclock } from 'react-timeclock'
import { Router, Route } from 'react-router-dom'

const App = () => 
    <Router>
        <Route exact path="timeclock" component={Timeclock} />
        {... project pages}
    </Router>
```

### Then go to that page to clock in/out when working on your project

### It's a great way to stay accountable to yourself and reach for the goals you've set for your project
