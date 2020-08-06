/* tslint:disable:ordered-imports */
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import './App.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Site } from "./Site";
import { setupDarkMode } from "./DarkMode";
import './Socket';

setupDarkMode();

ReactDOM.render(<Site />, document.getElementById('root'));
