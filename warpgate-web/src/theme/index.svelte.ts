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
    const themeContent = (await loadThemeFile(name)).default
    styleElement.innerHTML = themeContent
}

window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
        if (theme.current === 'auto') {
            loadTheme(event.matches ? 'dark' : 'light')
        }
    })

export function setCurrentTheme(themeName: ThemeName): void {
    localStorage.setItem('theme', themeName)
    theme.current = themeName
    if (themeName === 'auto') {
        if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
            loadTheme('dark')
        } else {
            loadTheme('light')
        }
    } else {
        loadTheme(themeName)
    }
}

setCurrentTheme(savedTheme)
