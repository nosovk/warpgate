import { mount } from 'svelte'
import '../theme/index.svelte'
import App from './App.svelte'

mount(App, {
    target: document.getElementById('app')!,
})

export {}
