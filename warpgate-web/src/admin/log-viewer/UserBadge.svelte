<script lang="ts">
    import { link } from 'svelte-spa-router'
    import Badge from 'common/sveltestrap-s5-ports/Badge.svelte'
    import Fa from 'svelte-fa'
    import { faUser } from '@fortawesome/free-regular-svg-icons'

    interface Props {
        id: string
        name: string
    }

    let { id, name }: Props = $props()
</script>

<Badge color="success" class="d-flex align-items-center">
    <Fa icon={faUser} class="me-2" />
    <a href="/config/users/{id}" use:link>{name}</a>
</Badge>
