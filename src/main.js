import './app.css';
import App from './App.svelte';
import pym from "pym.js";

const app = new App({
  target: document.getElementById('app'),
})

new pym.Child({ polling: 500 }); //for the embed into CMS

export default app
