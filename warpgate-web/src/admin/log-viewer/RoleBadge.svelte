<script lang="ts">
    import { link } from 'svelte-spa-router'
    import Badge from 'common/sveltestrap-s5-ports/Badge.svelte'
    import Fa from 'svelte-fa'
    import { faCog } from '@fortawesome/free-solid-svg-icons'

    interface Props {
        id: string
        name: string
        type?: 'access' | 'admin'
    }

    let { id, name, type = 'access' }: Props = $props()

    const path = type === 'admin' ? 'admin-roles' : 'access-roles'
    const color = type === 'admin' ? 'info' : 'warning'
</script>

<Badge {color} class="d-flex align-items-center">
    <Fa icon={faCog} class="me-2" />
    <a href="/config/{path}/{id}" use:link>{name}</a>
</Badge>
