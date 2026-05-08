import '@fontsource/work-sans'
import './fonts.css'

type ThemeFileName = 'dark' | 'light'
type ThemeName = ThemeFileName | 'auto'

const savedTheme = (localStorage.getItem('theme') ?? 'auto') as ThemeName

class ThemeState {
    current = $state<ThemeName>(savedTheme)
    currentFile = $state<ThemeFileName>('dark')
}
export const theme = new ThemeState()

const styleElement = document.createElement('style')
document.head.appendChild(styleElement)

function loadThemeFile(name: ThemeFileName) {
    theme.currentFile = name
    if (name === 'dark') {
        return import('./theme.dark.scss?inline')
    }
    return import('./theme.light.scss?inline')
}

async function loadTheme(name: ThemeFileName) {
    const loadedTheme = (await loadThemeFile(name)).default
    styleElement.innerHTML = loadedTheme
}

window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
        if (theme.current === 'auto') {
            loadTheme(event.matches ? 'dark' : 'light')
        }
    })

export function setCurrentTheme(themeInput: ThemeName): void {
    localStorage.setItem('theme', themeInput)
    theme.current = themeInput
    if (themeInput === 'auto') {
        if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
            loadTheme('dark')
        } else {
            loadTheme('light')
        }
    } else {
        loadTheme(themeInput)
    }
}

setCurrentTheme(savedTheme)
