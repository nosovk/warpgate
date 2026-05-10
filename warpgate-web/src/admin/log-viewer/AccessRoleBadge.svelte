<script lang="ts">
    import { link } from 'svelte-spa-router'
    import Badge from 'common/sveltestrap-s5-ports/Badge.svelte'
    import Fa from 'svelte-fa'
    import { faCog } from '@fortawesome/free-solid-svg-icons'

    interface Props {
        id: string
        name: string
    }

    let { id, name }: Props = $props()
</script>

<Badge color="warning" class="d-flex align-items-center">
    <Fa icon={faCog} class="me-2" />
    <a href="/config/access-roles/{id}" use:link>{name}</a>
</Badge>
