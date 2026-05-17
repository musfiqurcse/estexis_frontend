import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Loader2,
  PlusCircle,
  RefreshCw,
  ShieldAlert,
  Trash2,
  UserCog,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import {
  banAdminUser,
  createAdminUser,
  deleteAdminUser,
  getAdminUser,
  listAdminUsers,
  suspendAdminUser,
  unsuspendAdminUser,
} from "../../lib/adminApi";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700",
  banned: "bg-red-50 text-red-700",
  kyc_pending: "bg-amber-50 text-amber-700",
  kyc_rejected: "bg-red-50 text-red-700",
  kyc_under_review: "bg-blue-50 text-blue-700",
  profile_incomplete: "bg-gray-100 text-gray-600",
  suspended: "bg-orange-50 text-orange-700",
  unverified: "bg-gray-100 text-gray-600",
};

function formatLabel(value) {
  return value ? value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Unknown";
}

function formatDate(value) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status] || "bg-gray-100 text-gray-600"}`}>
      {formatLabel(status)}
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-gray-900">{value || "Not available"}</p>
    </div>
  );
}

export function UserManagementPage() {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState({ items: [], total: 0, page: 1, size: 20 });
  const [selectedId, setSelectedId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ email: "", password: "" });
  const [reasonAction, setReasonAction] = useState("");
  const [reason, setReason] = useState("");
  const [confirmUnsuspendOpen, setConfirmUnsuspendOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const totalPages = useMemo(() => Math.max(1, Math.ceil((users.total || 0) / (users.size || 20))), [users]);

  async function loadUsers(nextPage = page) {
    setListLoading(true);
    setError("");
    try {
      const response = await listAdminUsers(nextPage, 20);
      setUsers(response);
      setPage(response.page || nextPage);
      if (!response.items?.some((item) => item.id === selectedId)) {
        setSelectedId(null);
        setSelectedUser(null);
      }
    } catch (apiError) {
      setError(apiError.message || "Unable to load users.");
    } finally {
      setListLoading(false);
    }
  }

  async function loadUserDetail(userId) {
    setSelectedId(userId);
    setSelectedUser(null);
    setDetailLoading(true);
    setError("");
    setNotice("");

    try {
      setSelectedUser(await getAdminUser(userId));
    } catch (apiError) {
      setError(apiError.message || "Unable to load user details.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function refreshAfterAction(message) {
    setNotice(message);
    await loadUsers(page);
    if (selectedId) {
      try {
        setSelectedUser(await getAdminUser(selectedId));
      } catch {
        setSelectedUser(null);
      }
    }
  }

  async function handleCreateAdmin(event) {
    event.preventDefault();
    setActionLoading("create");
    setError("");
    setNotice("");

    try {
      await createAdminUser(createForm.email.trim(), createForm.password);
      setCreateOpen(false);
      setCreateForm({ email: "", password: "" });
      await refreshAfterAction("Admin user created.");
    } catch (apiError) {
      setError(apiError.message || "Unable to create admin user.");
    } finally {
      setActionLoading("");
    }
  }

  async function handleReasonAction(event) {
    event.preventDefault();
    if (!selectedId || !reasonAction || !reason.trim()) return;
    setActionLoading(reasonAction);
    setError("");
    setNotice("");

    try {
      if (reasonAction === "suspend") {
        await suspendAdminUser(selectedId, reason.trim());
        await refreshAfterAction("User suspended.");
      } else {
        await banAdminUser(selectedId, reason.trim());
        await refreshAfterAction("User banned.");
      }
      setReasonAction("");
      setReason("");
    } catch (apiError) {
      setError(apiError.message || `Unable to ${reasonAction} user.`);
    } finally {
      setActionLoading("");
    }
  }

  async function handleUnsuspend() {
    if (!selectedId) return;
    setActionLoading("unsuspend");
    setError("");
    setNotice("");

    try {
      await unsuspendAdminUser(selectedId);
      setConfirmUnsuspendOpen(false);
      await refreshAfterAction("User unsuspended.");
    } catch (apiError) {
      setError(apiError.message || "Unable to unsuspend user.");
    } finally {
      setActionLoading("");
    }
  }

  async function handleDeleteUser() {
    if (!selectedId) return;
    setActionLoading("delete");
    setError("");
    setNotice("");

    try {
      await deleteAdminUser(selectedId);
      setConfirmDeleteOpen(false);
      setSelectedId(null);
      setSelectedUser(null);
      setNotice("User deleted.");
      await loadUsers(page);
    } catch (apiError) {
      setError(apiError.message || "Unable to delete user.");
    } finally {
      setActionLoading("");
    }
  }

  useEffect(() => {
    loadUsers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <AdminLayout title="User Management">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>
            <p className="mt-1 text-sm text-gray-400">Review accounts, create admins, and manage user status.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary py-2" onClick={() => loadUsers(page)} disabled={listLoading}>
              <RefreshCw className={`h-4 w-4 ${listLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button className="btn-primary py-2" onClick={() => setCreateOpen(true)}>
              <PlusCircle className="h-4 w-4" />
              Create Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}
        {notice && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            {notice}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Email</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Role</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Type</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Status</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Created</th>
                    <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listLoading ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-sm text-gray-400">
                        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                        Loading users
                      </td>
                    </tr>
                  ) : users.items.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-sm text-gray-400">No users found.</td>
                    </tr>
                  ) : (
                    users.items.map((user) => (
                      <tr key={user.id} className={`border-b border-gray-50 last:border-0 ${selectedId === user.id ? "bg-emerald-50/40" : ""}`}>
                        <td className="max-w-[220px] truncate p-4 font-medium text-gray-900">{user.email}</td>
                        <td className="p-4 text-gray-500">{formatLabel(user.role)}</td>
                        <td className="p-4 text-gray-500">{formatLabel(user.account_type)}</td>
                        <td className="p-4"><StatusBadge status={user.status} /></td>
                        <td className="p-4 text-gray-500">{formatDate(user.created_at)}</td>
                        <td className="p-4 text-right">
                          <button
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-forest transition hover:bg-forest hover:text-white"
                            onClick={() => loadUserDetail(user.id)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 p-4 text-sm text-gray-500">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button className="btn-secondary py-1.5 text-xs" disabled={page <= 1 || listLoading} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                  Previous
                </button>
                <button className="btn-secondary py-1.5 text-xs" disabled={page >= totalPages || listLoading} onClick={() => setPage((value) => value + 1)}>
                  Next
                </button>
              </div>
            </div>
          </section>

          <aside className="rounded-xl border border-gray-100 bg-white p-5">
            {!selectedId ? (
              <div className="grid min-h-80 place-items-center text-center text-sm text-gray-400">
                <div>
                  <UserCog className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                  Select a user to review.
                </div>
              </div>
            ) : detailLoading ? (
              <div className="grid min-h-80 place-items-center text-sm text-gray-400">
                <Loader2 className="mb-2 h-5 w-5 animate-spin" />
                Loading details
              </div>
            ) : selectedUser ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">User details</h3>
                    <p className="mt-1 break-all text-xs text-gray-400">{selectedUser.id}</p>
                  </div>
                  <StatusBadge status={selectedUser.status} />
                </div>

                <div className="grid gap-4">
                  <DetailRow label="Email" value={selectedUser.email} />
                  <DetailRow label="Role" value={formatLabel(selectedUser.role)} />
                  <DetailRow label="Account type" value={formatLabel(selectedUser.account_type)} />
                  <DetailRow label="Country" value={selectedUser.country_code} />
                  <DetailRow label="Email verified" value={formatDate(selectedUser.email_verified_at)} />
                  <DetailRow label="Created" value={formatDate(selectedUser.created_at)} />
                  <DetailRow label="Updated" value={formatDate(selectedUser.updated_at)} />
                </div>

                <div className="grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2">
                  <button className="btn-secondary px-3 text-orange-600 hover:border-orange-200 hover:text-orange-700" onClick={() => setReasonAction("suspend")} disabled={Boolean(actionLoading)}>
                    <ShieldAlert className="h-4 w-4" />
                    Suspend
                  </button>
                  <button className="btn-secondary px-3 text-emerald-700 hover:border-emerald-200 hover:text-emerald-800" onClick={() => setConfirmUnsuspendOpen(true)} disabled={Boolean(actionLoading)}>
                    <CheckCircle2 className="h-4 w-4" />
                    Unsuspend
                  </button>
                  <button className="btn-secondary px-3 text-red-600 hover:border-red-200 hover:text-red-700" onClick={() => setReasonAction("ban")} disabled={Boolean(actionLoading)}>
                    <Ban className="h-4 w-4" />
                    Ban
                  </button>
                  <button className="btn-secondary px-3 text-red-700 hover:border-red-200 hover:text-red-800 sm:col-span-2" onClick={() => setConfirmDeleteOpen(true)} disabled={Boolean(actionLoading)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No detail loaded.</p>
            )}
          </aside>
        </div>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl" onSubmit={handleCreateAdmin}>
            <h3 className="text-base font-semibold text-gray-900">Create admin user</h3>
            <div className="mt-4 space-y-3">
              <input
                className="input-field"
                type="email"
                placeholder="Email"
                value={createForm.email}
                onChange={(event) => setCreateForm((value) => ({ ...value, email: event.target.value }))}
                required
              />
              <input
                className="input-field"
                type="password"
                placeholder="Password"
                value={createForm.password}
                onChange={(event) => setCreateForm((value) => ({ ...value, password: event.target.value }))}
                minLength={8}
                required
              />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" className="btn-secondary" onClick={() => setCreateOpen(false)} disabled={Boolean(actionLoading)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={Boolean(actionLoading)}>
                {actionLoading === "create" ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {reasonAction && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl" onSubmit={handleReasonAction}>
            <h3 className="text-base font-semibold text-gray-900">{formatLabel(reasonAction)} user</h3>
            <p className="mt-1 text-sm text-gray-400">Enter a reason for this status change.</p>
            <textarea
              className="input-field mt-4 min-h-28 resize-none"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Reason"
              required
            />
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" className="btn-secondary" onClick={() => { setReasonAction(""); setReason(""); }} disabled={Boolean(actionLoading)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary bg-red-600 hover:bg-red-700" disabled={!reason.trim() || Boolean(actionLoading)}>
                {actionLoading === reasonAction ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmUnsuspendOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">Unsuspend user</h3>
            <p className="mt-1 text-sm text-gray-400">Confirm that this user should be returned from suspended status.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" className="btn-secondary" onClick={() => setConfirmUnsuspendOpen(false)} disabled={Boolean(actionLoading)}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={handleUnsuspend} disabled={Boolean(actionLoading)}>
                {actionLoading === "unsuspend" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Unsuspend
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900">Delete user</h3>
            <p className="mt-1 text-sm text-gray-400">
              This will delete {selectedUser?.email || "this user"}. This action cannot be undone from the admin UI.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" className="btn-secondary" onClick={() => setConfirmDeleteOpen(false)} disabled={Boolean(actionLoading)}>
                Cancel
              </button>
              <button type="button" className="btn-primary bg-red-600 hover:bg-red-700" onClick={handleDeleteUser} disabled={Boolean(actionLoading)}>
                {actionLoading === "delete" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
