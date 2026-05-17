import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, ExternalLink, FileCheck2, FileText, Loader2, RefreshCw, XCircle } from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import {
  approveKycSubmission,
  getKycSubmission,
  listPendingKyc,
  rejectKycSubmission,
} from "../../lib/adminApi";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  under_review: "bg-blue-50 text-blue-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
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

function isImageFile(url = "", contentType = "") {
  return contentType.startsWith("image/") || /\.(avif|gif|jpe?g|png|webp)(\?|#|$)/i.test(url);
}

function FileLink({ label, url, fileName, contentType, uploadedAt }) {
  if (!url) {
    return (
      <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-400">
        {label}: Not provided
      </div>
    );
  }

  const displayName = fileName || label;
  const imageLike = isImageFile(url, contentType);

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block overflow-hidden rounded-lg border border-gray-100 bg-white transition hover:border-forest/30 hover:shadow-sm"
    >
      {imageLike ? (
        <img src={url} alt={displayName} className="aspect-video w-full bg-gray-50 object-cover" />
      ) : (
        <div className="grid aspect-video place-items-center bg-gray-50 text-gray-400">
          <FileText className="h-8 w-8" />
        </div>
      )}
      <div className="flex items-start justify-between gap-3 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
          {contentType && <p className="mt-0.5 text-xs text-gray-400">{contentType}</p>}
          {uploadedAt && <p className="mt-0.5 text-xs text-gray-400">{formatDate(uploadedAt)}</p>}
        </div>
        <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
      </div>
    </a>
  );
}

function SectionCard({ title, children }) {
  return (
    <section className="border-t border-gray-100 pt-5">
      <h4 className="mb-4 text-sm font-semibold text-gray-900">{title}</h4>
      {children}
    </section>
  );
}

export function KycReviewPage() {
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState({ items: [], total: 0, page: 1, size: 20 });
  const [selectedId, setSelectedId] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const totalPages = useMemo(() => Math.max(1, Math.ceil((pending.total || 0) / (pending.size || 20))), [pending]);

  async function loadPending(nextPage = page) {
    setListLoading(true);
    setError("");
    try {
      const response = await listPendingKyc(nextPage, 20);
      setPending(response);
      setPage(response.page || nextPage);
      if (!response.items?.some((item) => item.id === selectedId)) {
        setSelectedId(null);
        setSelectedSubmission(null);
      }
    } catch (apiError) {
      setError(apiError.message || "Unable to load pending KYC submissions.");
    } finally {
      setListLoading(false);
    }
  }

  async function loadDetails(kycId) {
    setSelectedId(kycId);
    setSelectedSubmission(null);
    setDetailLoading(true);
    setError("");
    setNotice("");

    try {
      const submission = await getKycSubmission(kycId);
      setSelectedSubmission(submission);
    } catch (apiError) {
      setError(apiError.message || "Unable to load KYC details.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleApprove() {
    if (!selectedId) return;
    setActionLoading("approve");
    setError("");
    setNotice("");

    try {
      await approveKycSubmission(selectedId);
      setNotice("KYC submission approved.");
      await loadPending(page);
    } catch (apiError) {
      setError(apiError.message || "Unable to approve KYC submission.");
    } finally {
      setActionLoading("");
    }
  }

  async function handleReject(e) {
    e.preventDefault();
    if (!selectedId || !rejectReason.trim()) return;
    setActionLoading("reject");
    setError("");
    setNotice("");

    try {
      await rejectKycSubmission(selectedId, rejectReason.trim());
      setRejectOpen(false);
      setRejectReason("");
      setNotice("KYC submission rejected.");
      await loadPending(page);
    } catch (apiError) {
      setError(apiError.message || "Unable to reject KYC submission.");
    } finally {
      setActionLoading("");
    }
  }

  useEffect(() => {
    loadPending(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <AdminLayout title="KYC Reviews">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pending submissions</h2>
            <p className="mt-1 text-sm text-gray-400">Review user KYC submissions and approve or reject them.</p>
          </div>
          <button className="btn-secondary py-2" onClick={() => loadPending(page)} disabled={listLoading}>
            <RefreshCw className={`h-4 w-4 ${listLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
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
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Method</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Status</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Attempt</th>
                    <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Submitted</th>
                    <th className="p-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listLoading ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-sm text-gray-400">
                        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                        Loading pending submissions
                      </td>
                    </tr>
                  ) : pending.items.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-sm text-gray-400">No pending KYC submissions.</td>
                    </tr>
                  ) : (
                    pending.items.map((item) => (
                      <tr key={item.id} className={`border-b border-gray-50 last:border-0 ${selectedId === item.id ? "bg-emerald-50/40" : ""}`}>
                        <td className="p-4 font-medium text-gray-900">{formatLabel(item.method)}</td>
                        <td className="p-4"><StatusBadge status={item.status} /></td>
                        <td className="p-4 text-gray-500">{item.attempt_number}</td>
                        <td className="p-4 text-gray-500">{formatDate(item.submitted_at)}</td>
                        <td className="p-4 text-right">
                          <button
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-forest transition hover:bg-forest hover:text-white"
                            onClick={() => loadDetails(item.id)}
                          >
                            Review
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
                  <FileCheck2 className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                  Select a submission to review.
                </div>
              </div>
            ) : detailLoading ? (
              <div className="grid min-h-80 place-items-center text-sm text-gray-400">
                <Loader2 className="mb-2 h-5 w-5 animate-spin" />
                Loading details
              </div>
            ) : selectedSubmission ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Submission details</h3>
                    <p className="mt-1 break-all text-xs text-gray-400">{selectedSubmission.id}</p>
                  </div>
                  <StatusBadge status={selectedSubmission.status} />
                </div>

                <div className="grid gap-4">
                  <DetailRow label="Method" value={formatLabel(selectedSubmission.method)} />
                  <DetailRow label="Attempt" value={selectedSubmission.attempt_number} />
                  <DetailRow label="Submitted" value={formatDate(selectedSubmission.submitted_at)} />
                  <DetailRow label="Reviewed" value={formatDate(selectedSubmission.reviewed_at)} />
                  <DetailRow label="Rejection reason" value={selectedSubmission.rejection_reason} />
                </div>

                <SectionCard title="User">
                  <div className="grid gap-4">
                    <DetailRow label="Email" value={selectedSubmission.user?.email} />
                    <DetailRow label="Role" value={formatLabel(selectedSubmission.user?.role)} />
                    <DetailRow label="Account type" value={formatLabel(selectedSubmission.user?.account_type)} />
                    <DetailRow label="User status" value={formatLabel(selectedSubmission.user?.status)} />
                    <DetailRow label="User id" value={selectedSubmission.user?.id || selectedSubmission.user_id} />
                    <DetailRow label="Country" value={selectedSubmission.user?.country_code} />
                  </div>
                </SectionCard>

                <SectionCard title="ID Document">
                  {selectedSubmission.id_document ? (
                    <div className="grid gap-4">
                      <DetailRow label="Document type" value={formatLabel(selectedSubmission.id_document.document_type)} />
                      <DetailRow label="Date of birth" value={selectedSubmission.id_document.date_of_birth} />
                      <DetailRow label="Expiry date" value={selectedSubmission.id_document.expiry_date} />
                      <DetailRow label="Country of issue" value={selectedSubmission.id_document.country_of_issue} />
                      <div className="grid gap-3">
                        {(selectedSubmission.id_document.files || []).length > 0 ? (
                          selectedSubmission.id_document.files.map((file, index) => (
                            <FileLink
                              key={file.id || file.url || index}
                              label={`Document file ${index + 1}`}
                              url={file.url}
                              fileName={file.file_name}
                              contentType={file.content_type}
                              uploadedAt={file.uploaded_at}
                            />
                          ))
                        ) : (
                          <FileLink label="Document files" />
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Not provided</p>
                  )}
                </SectionCard>

                <SectionCard title="Bank Detail">
                  {selectedSubmission.bank_detail ? (
                    <div className="grid gap-4">
                      <DetailRow label="Bank name" value={selectedSubmission.bank_detail.bank_name} />
                      <DetailRow label="Account holder" value={selectedSubmission.bank_detail.account_holder_name} />
                      <FileLink label="Bank statement" url={selectedSubmission.bank_detail.statement_url} />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Not provided</p>
                  )}
                </SectionCard>

                <SectionCard title="Business Documents">
                  {selectedSubmission.business_document ? (
                    <div className="grid gap-3">
                      <FileLink label="Business registration" url={selectedSubmission.business_document.business_reg_doc_url} />
                      <FileLink label="Tax document" url={selectedSubmission.business_document.tax_doc_url} />
                      <FileLink label="Director ID" url={selectedSubmission.business_document.director_id_doc_url} />
                      <FileLink label="Proof of address" url={selectedSubmission.business_document.proof_of_address_url} />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Not provided</p>
                  )}
                </SectionCard>

                <SectionCard title="Face Liveness">
                  {selectedSubmission.face_liveness ? (
                    <div className="grid gap-4">
                      <DetailRow label="Uploaded" value={formatDate(selectedSubmission.face_liveness.uploaded_at)} />
                      <div className="grid gap-3">
                        <FileLink label="Left image" url={selectedSubmission.face_liveness.left_image_url} />
                        <FileLink label="Straight image" url={selectedSubmission.face_liveness.straight_image_url} />
                        <FileLink label="Right image" url={selectedSubmission.face_liveness.right_image_url} />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Not provided</p>
                  )}
                </SectionCard>

                <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
                  <button className="btn-primary px-3" onClick={handleApprove} disabled={Boolean(actionLoading)}>
                    {actionLoading === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Approve
                  </button>
                  <button className="btn-secondary px-3 text-red-600 hover:border-red-200 hover:text-red-700" onClick={() => setRejectOpen(true)} disabled={Boolean(actionLoading)}>
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No detail loaded.</p>
            )}
          </aside>
        </div>
      </div>

      {rejectOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl" onSubmit={handleReject}>
            <h3 className="text-base font-semibold text-gray-900">Reject KYC submission</h3>
            <p className="mt-1 text-sm text-gray-400">Enter the rejection reason that should be stored with this submission.</p>
            <textarea
              className="input-field mt-4 min-h-28 resize-none"
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              placeholder="Reason"
              required
            />
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" className="btn-secondary" onClick={() => setRejectOpen(false)} disabled={Boolean(actionLoading)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary bg-red-600 hover:bg-red-700" disabled={!rejectReason.trim() || Boolean(actionLoading)}>
                {actionLoading === "reject" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                Reject
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
