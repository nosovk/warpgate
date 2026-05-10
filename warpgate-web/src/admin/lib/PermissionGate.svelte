<script lang="ts">
  import Alert from 'common/sveltestrap-s5-ports/Alert.svelte'
  import { adminPermissions, type AdminPermissionKey } from './store.svelte'


  interface Props {
      /**
   * Render children only if the given admin permission is granted.
   * If not, the content placed in the `fallback` slot will be shown
   * instead (defaults to nothing).
   */
      perm: AdminPermissionKey;
      message: string | undefined;
      children?: import('svelte').Snippet;
  }

  let { perm, message, children }: Props = $props()
</script>

{#if adminPermissions.value[perm]}
  {@render children?.()}
{:else if message}
  <Alert color="warning">
    {message}
  </Alert>
{/if}
