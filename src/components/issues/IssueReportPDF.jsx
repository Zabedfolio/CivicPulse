"use client";

import React from "react";

/**
 * IssueReportPDF
 * Formal A4 printable / Save-as-PDF municipal dossier for official recordkeeping.
 * Visible only during @media print.
 */
export function IssueReportPDF({ issue, history = [], feedback = null, ticketId = "CP-2026" }) {
  if (!issue) return null;

  const coords = issue.location?.coordinates || [];
  const hasCoords = coords.length === 2;
  const generatedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <article
      aria-label="Printable Official Municipal Issue Dossier"
      className="hidden print:block w-full bg-white text-slate-900 font-sans text-xs leading-relaxed"
    >
      {/* Official GovTech Letterhead */}
      <header className="border-b-2 border-teal-700 pb-4 mb-5 flex items-start justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-teal-700">
            Chattogram Municipal Infrastructure Command
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
            CivicPulse Official Incident Dossier
          </h1>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Smarter Cities, Faster Fixes — Certified Municipal Record
          </p>
        </div>

        <div className="text-right">
          <div className="inline-block px-3 py-1 rounded border border-teal-700 bg-teal-50 text-teal-800 font-mono font-extrabold text-xs">
            TICKET #{ticketId}
          </div>
          <div className="text-[10px] text-slate-500 mt-1.5">
            Generated: {generatedAt}
          </div>
        </div>
      </header>

      {/* Primary Summary Box */}
      <section className="mb-5 p-4 rounded-lg border border-slate-300 bg-slate-50">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 className="text-base font-extrabold text-slate-900">{issue.title}</h2>
          <span className="px-2.5 py-0.5 rounded border border-slate-400 bg-white font-bold uppercase text-[10px] shrink-0">
            Status: {issue.status}
          </span>
        </div>
        <p className="text-slate-700 whitespace-pre-line">{issue.description}</p>
      </section>

      {/* Metadata Grid */}
      <section className="mb-5 break-inside-avoid">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2.5">
          1. Incident Classification &amp; Location Metadata
        </h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
          <div className="flex justify-between border-b border-slate-200 py-1">
            <span className="font-bold text-slate-600">Category:</span>
            <span className="font-semibold text-slate-900">{issue.category}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 py-1">
            <span className="font-bold text-slate-600">Priority Level:</span>
            <span className="font-bold uppercase text-slate-900">{issue.priority}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 py-1">
            <span className="font-bold text-slate-600">Assigned Division:</span>
            <span className="font-semibold text-slate-900">
              {issue.department?.name || "Pending Triage Assignment"}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-200 py-1">
            <span className="font-bold text-slate-600">Assigned Technician:</span>
            <span className="font-semibold text-slate-900">
              {issue.assignedTo?.name || "Unassigned"}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-200 py-1">
            <span className="font-bold text-slate-600">Reporter:</span>
            <span className="font-semibold text-slate-900">
              {issue.reporter?.name || "Verified Citizen"}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-200 py-1">
            <span className="font-bold text-slate-600">Submitted Date:</span>
            <span className="font-semibold text-slate-900">
              {new Date(issue.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
          <div className="col-span-2 flex justify-between border-b border-slate-200 py-1">
            <span className="font-bold text-slate-600">Municipal Address:</span>
            <span className="font-semibold text-slate-900">{issue.address}</span>
          </div>
          {hasCoords && (
            <div className="col-span-2 flex justify-between border-b border-slate-200 py-1">
              <span className="font-bold text-slate-600">GIS Coordinates (Lng, Lat):</span>
              <span className="font-mono font-semibold text-slate-900">
                {coords[0].toFixed(6)}, {coords[1].toFixed(6)}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Photographic Evidence */}
      {issue.image?.url && (
        <section className="mb-5 break-inside-avoid">
          <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2.5">
            2. Photographic Evidence
          </h3>
          <div className="border border-slate-300 rounded-lg overflow-hidden p-2 bg-white">
            <img
              src={issue.image.url}
              alt={`Evidence for ${issue.title}`}
              className="w-full max-h-64 object-cover rounded"
            />
            <p className="text-[10px] text-slate-500 mt-1.5 font-mono">
              Source: CivicPulse Evidence Vault ({issue.image.publicId || "verified"})
            </p>
          </div>
        </section>
      )}

      {/* Chronological Status Audit Table */}
      <section className="mb-5 break-inside-avoid">
        <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2.5">
          3. Chronological Resolution Audit Trail
        </h3>
        {history.length === 0 ? (
          <p className="text-slate-500 italic">No status transitions recorded.</p>
        ) : (
          <table className="w-full border-collapse border border-slate-300 text-[11px]">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th scope="col" className="border border-slate-300 px-2.5 py-1.5 font-bold">
                  Timestamp
                </th>
                <th scope="col" className="border border-slate-300 px-2.5 py-1.5 font-bold">
                  Stage Transition
                </th>
                <th scope="col" className="border border-slate-300 px-2.5 py-1.5 font-bold">
                  Authorized By
                </th>
                <th scope="col" className="border border-slate-300 px-2.5 py-1.5 font-bold">
                  Audit Note
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, idx) => (
                <tr key={entry._id || idx}>
                  <td className="border border-slate-300 px-2.5 py-1.5 whitespace-nowrap font-mono text-[10px]">
                    {new Date(entry.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="border border-slate-300 px-2.5 py-1.5 font-bold">
                    {entry.fromStatus ? `${entry.fromStatus} → ${entry.toStatus}` : entry.toStatus}
                  </td>
                  <td className="border border-slate-300 px-2.5 py-1.5">
                    {entry.changedBy?.name || "System"}
                  </td>
                  <td className="border border-slate-300 px-2.5 py-1.5 text-slate-700">
                    {entry.note || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Citizen Post-Resolution Feedback */}
      {feedback && (
        <section className="mb-6 p-3.5 rounded-lg border border-slate-300 bg-slate-50 break-inside-avoid">
          <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
            4. Verified Citizen Satisfaction Review
          </h3>
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold">Rating: {feedback.rating} / 5 Stars</span>
            <span className="text-slate-500">
              Submitted {new Date(feedback.createdAt).toLocaleDateString()}
            </span>
          </div>
          {feedback.comment && (
            <p className="mt-1.5 text-slate-700 italic">&ldquo;{feedback.comment}&rdquo;</p>
          )}
        </section>
      )}

      {/* Official Sign-off Footer */}
      <footer className="mt-8 pt-4 border-t border-slate-300 flex items-end justify-between text-[10px] text-slate-600 break-inside-avoid">
        <div>
          <p className="font-bold text-slate-800">CivicPulse Smart City Governance Platform</p>
          <p>Chattogram City Corporation — Municipal Public Works Audit</p>
        </div>
        <div className="text-right">
          <div className="w-44 border-b border-slate-400 mb-1 h-6" />
          <p className="font-semibold">Authorized Municipal Officer Signature</p>
        </div>
      </footer>
    </article>
  );
}

export default IssueReportPDF;
