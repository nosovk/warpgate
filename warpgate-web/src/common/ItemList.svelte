<script lang="ts" module>
    export interface LoadOptions {
        search?: string
        offset: number
        limit?: number
    }

    export interface PaginatedResponse<T> {
        items: T[]
        offset: number
        total: number
    }
</script>

<script lang="ts" generics="T, G = unknown, GK = unknown">
    import Pagination from './Pagination.svelte'
    import { Input } from '@sveltestrap/sveltestrap'
    import DelayedSpinner from './DelayedSpinner.svelte'
    import { onMount, type Snippet, untrack } from 'svelte'
    import EmptyState from './EmptyState.svelte'

    interface Props {
        page?: number
        pageSize?: number | undefined
        load: (_: LoadOptions) => Promise<PaginatedResponse<T>>
        groupObject?: (_: T) => G
        groupKey?: (_: G) => GK
        showSearch?: boolean
        header?: Snippet<[]>
        item?: Snippet<[T]>
        footer?: Snippet<[T[]]>
        empty?: Snippet<[]>
        groupHeader?: Snippet<[G]>
    }

    let {
        page = $bindable(0),
        pageSize = undefined,
        load,
        showSearch = false,
        groupObject,
        groupKey,
        header,
        item,
        footer,
        empty,
        groupHeader,
    }: Props = $props()

    let filter = $state('')
    let loaded = $state(false)
    let _items = $state<T[] | null>(null)
    let _total = $state(0)

    let timeout: ReturnType<typeof setTimeout> | undefined

    export function reload(): void {
        fetchData()
    }

    async function fetchData() {
        loaded = false
        try {
            const result = await load({
                search: filter,
                offset: page * (pageSize ?? 0),
                limit: pageSize,
            })
            _items = result.items
            _total = result.total
        } finally {
            loaded = true
        }
    }

    onMount(() => {
        if (groupHeader && (!groupObject || !groupKey)) {
            throw new Error(
                'groupObject and groupKey must be provided when using groupHeader',
            )
        }
    })

    // Reset page when filter changes
    let prevFilter = ''
    $effect(() => {
        if (prevFilter !== filter) {
            page = 0
            prevFilter = filter
        }
    })

    // Debounce the load
    $effect(() => {
    // Track dependencies
        const p = page
        const f = filter
        // eslint-disable-next-line no-empty
        if (p || f || !p || !f) {
        }

        clearTimeout(timeout)
        timeout = setTimeout(() => {
            untrack(() => fetchData())
        }, 200)

        return () => clearTimeout(timeout)
    })
</script>

{#if _items === null}
    <DelayedSpinner />
{:else}
    <div class="d-flex mb-2" hidden={!loaded}>
    <!-- either filtering or not filtering and there are at least some items at all -->
    {#if showSearch && (filter || !!_items?.length)}
        <Input
            bind:value={filter}
            placeholder="Search..."
            class="flex-grow-1 border-0"
        />
    {/if}
    {@render header?.()}
    </div>
    {#if _items}
    <div class="list-group list-group-flush mb-3">
        {#each _items as _item, _index (_item)}
            {#if groupHeader}
                {#if _index === 0 || groupKey!(groupObject!(_item)) !== groupKey!(groupObject!(_items[_index - 1]!))}
                    {@render groupHeader(groupObject!(_item))}
                {/if}
            {/if}
            {@render item?.(_item)}
        {/each}
    </div>
    {@render footer?.(_items)}
    {:else}
    <DelayedSpinner />
    {/if}

    {#if loaded && !_items?.length}
    {#if filter}
        <EmptyState title="Nothing found" />
    {:else}
        {@render empty?.()}
    {/if}
    {/if}
{/if}

{#if _total > 0 && pageSize && _total > pageSize}
    <Pagination total={_total} bind:page {pageSize} />
{/if}

<style lang="scss">
    .list-group:empty {
    display: none
    }
</style>
