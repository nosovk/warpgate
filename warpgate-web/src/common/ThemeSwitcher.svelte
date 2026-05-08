<script lang="ts">
  import Fa from 'svelte-fa'
  import { faCloudSun, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
  import { Button } from '@sveltestrap/sveltestrap'

  import { theme, setCurrentTheme } from 'theme/index.svelte'
  import Tooltip from './sveltestrap-s5-ports/Tooltip.svelte'

  function toggle() {
      if (theme.current === 'auto') {
          setCurrentTheme('dark')
      } else if (theme.current === 'dark') {
          setCurrentTheme('light')
      } else {
          setCurrentTheme('auto')
      }
  }
</script>

<Button color="link" on:click={toggle} id="button" title="Switch theme">
  {#if theme.current === 'dark'}
    <Fa fw icon={faMoon} />
  {:else if theme.current === 'light'}
    <Fa fw icon={faSun} />
  {:else}
    <Fa fw icon={faCloudSun} />
  {/if}
</Button>
<Tooltip target="button" animation>
  {#if theme.current === 'dark'}
    Dark theme
  {:else if theme.current === 'light'}
    Light theme
  {:else}
    Automatic theme
  {/if}
</Tooltip>
