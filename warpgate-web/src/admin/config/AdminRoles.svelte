<script lang="ts">
  import { api, type AdminRole } from 'admin/lib/api'
  import { link } from 'svelte-spa-router'
  import Alert from 'common/sveltestrap-s5-ports/Alert.svelte'
  import ItemList, { type PaginatedResponse } from 'common/ItemList.svelte'
  import { adminPermissions } from '../lib/store.svelte'
  import PermissionGate from 'admin/lib/PermissionGate.svelte'
  import AdminRolePermissionsBadge from './AdminRolePermissionsBadge.svelte'

  async function loadRoles(): Promise<PaginatedResponse<AdminRole>> {
      if (!adminPermissions.value.adminRolesManage) {
          return { items: [], offset: 0, total: 0 }
      }
      const targets = await api.getAdminRoles()
      return {
          items: targets,
          offset: 0,
          total: targets.length,
      }
  }
</script>

<div class="container-max-md">
  <PermissionGate
    perm="adminRolesManage"
    message="You have no permission to manage admin roles."
  >
    <div class="page-summary-bar">
      <div>
        <h1>admin roles</h1>
        <div class="text-muted">permissions for administrators</div>
      </div>
      <a
        class="btn btn-primary ms-auto"
        href="/config/admin-roles/create"
        use:link>Create</a
      >
    </div>

    <ItemList load={loadRoles} showSearch={true}>
      {#snippet item(role)}
        <a
          class="list-group-item list-group-item-action d-flex align-items-center"
          href="/config/admin-roles/{role.id}"
          use:link
        >
          <div>
            <strong class="me-auto">
              {role.name}
            </strong>
            {#if role.description}
              <small class="d-block text-muted">{role.description}</small>
            {/if}
          </div>
          <span class="ms-auto">
            <AdminRolePermissionsBadge {role} />
          </span>
        </a>
      {/snippet}
      {#snippet empty()}
        <Alert color="info">No admin roles defined</Alert>
      {/snippet}
    </ItemList>
  </PermissionGate>
</div>
