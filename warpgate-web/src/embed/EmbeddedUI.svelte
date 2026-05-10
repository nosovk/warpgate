<script lang="ts">
    import { api } from 'gateway/lib/api'
    import { onMount } from 'svelte'
    import logo from '../../public/assets/favicon.svg'

    let ready = $state(false)
    let menuVisible = $state(false)
    let dragging = $state(false)
    let savedPosition = { x: 0.1, y: 0.8 }
    let position = $state({ x: 0.1, y: 0.8 })
    let dragStartCoords = { x: 0, y: 0 }
    let externalHost: string | undefined = undefined

    if (localStorage.warpgateMenuLocation) {
        position = JSON.parse(localStorage.warpgateMenuLocation)
        savedPosition = position
    }

    onMount(async () => {
        ready = true
        const info = await api.getInfo()
        externalHost = info.externalHost
    })

    function drag (e: MouseEvent) {
        if (!dragging) {
            return
        }
        const { x, y } = dragStartCoords
        const { clientX, clientY } = e
        const dx = clientX - x
        const dy = clientY - y
        position = {
            x: Math.max(
                0,
                Math.min(1, savedPosition.x + dx / window.innerWidth),
            ),
            y: Math.max(
                0,
                Math.min(1, savedPosition.y + dy / window.innerHeight),
            ),
        }
    }

    function startDragging (e: MouseEvent) {
        dragStartCoords = { x: e.clientX, y: e.clientY }
        dragging = true
    }

    function stopDragging () {
        dragging = false
        savedPosition = position
        localStorage.warpgateMenuLocation = JSON.stringify(position)
    }

    function goHome () {
        if (externalHost) {
            location.href = `https://${externalHost}/@warpgate`
        } else {
            location.href = '/@warpgate'
        }
    }

    async function logout () {
        await api.logout()
        location.reload()
    }
</script>

<svelte:window
    onmousemove={drag}
    onmouseup={() => {
        menuVisible = false
        stopDragging()
    }}
/>

<div
    class="embedded-ui"
    class:wg-hidden={!ready}
    style="left: {position.x * 100}%; top: {position.y * 100}%"
>
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <img
        class="menu-toggle"
        src={logo}
        alt="Warpgate"
        onmouseup={(e: MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
            if (!dragging) {
                menuVisible = !menuVisible
            } else {
                stopDragging()
            }
        }}
        onmousedown={(e: MouseEvent) => {
            e.preventDefault()
        }}
        onmousemove={(e: MouseEvent) => {
            e.preventDefault()
            if (e.buttons && !dragging) {
                startDragging(e)
            }
        }}
    />

    {#if menuVisible}
        <div class="menu">
            <button onmouseup={goHome}>Home</button>
            <button onmouseup={logout}>Log out</button>
        </div>
    {/if}
</div>

<style lang="scss">
    .embedded-ui {
        position: fixed;
        z-index: 9999;
        color: #555;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        &.wg-hidden > img.menu-toggle {
            opacity: 0;
        }

        > img.menu-toggle {
            transition: 0.5s ease-out opacity;
            opacity: 1;
            cursor: pointer;
            width: 40px;
            height: 40px;
            border: none;
            padding: 0;
        }

        .menu {
            position: absolute;
            left: 0;
            bottom: calc(100% + 10px);
            min-width: 200px;
            max-height: 50vh;
            overflow-y: auto;
            border-radius: 7px;
            border: 1px solid rgba(128, 128, 128, 0.25);
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(4px);
            padding: 5px;
            > button {
                display: flex;
                align-items: center;
                width: 100%;
                padding: 5px 10px;
                background: transparent;
                border: 0;
                border-radius: 4px;
                color: rgba(0, 0, 0, 0.5);
                &:not(:first-child) {
                    margin-top: 5px;
                }

                &:hover {
                    color: #555;
                    background: rgba(255, 255, 255, 0.25);
                }
            }
        }
    }
</style>
