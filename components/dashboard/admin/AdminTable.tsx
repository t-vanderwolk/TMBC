"use client";

import { type ReactNode } from "react";

export type AdminTableColumn<T> = {
  header: string;
  accessor?: keyof T;
  render?: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
};

type AdminTableProps<T> = {
  columns: AdminTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  className?: string;
};

export default function AdminTable<T extends Record<string, any>>({
  columns,
  rows,
  rowKey,
  className = "",
}: AdminTableProps<T>) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-[#E7D9E1] text-sm">
        <thead className="text-[0.65rem] uppercase tracking-[0.45em] text-[#C8A1B4]">
          <tr>
            {columns.map((column) => {
              const alignClass =
                column.align === "center"
                  ? "text-center"
                  : column.align === "right"
                  ? "text-right"
                  : "text-left";
              return (
                <th
                  key={column.header}
                  className={`px-3 py-3 ${alignClass} ${column.className ?? ""}`}
                  scope="col"
                >
                  {column.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E7D9E1]">
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="bg-white transition hover:bg-[#F9F6F7]"
            >
              {columns.map((column) => {
                const alignClass =
                  column.align === "center"
                    ? "text-center"
                    : column.align === "right"
                    ? "text-right"
                    : "text-left";
                const value =
                  column.render ??
                  ((rowInstance: T) => {
                    if (!column.accessor) return null;
                    const cellValue = rowInstance[column.accessor];
                    if (typeof cellValue === "string" || typeof cellValue === "number") {
                      return cellValue;
                    }
                    return JSON.stringify(cellValue);
                  });

                return (
                  <td
                    key={`${rowKey(row)}-${column.header}`}
                    className={`px-3 py-3 text-[0.85rem] text-[#3E2F35] ${alignClass} ${column.className ?? ""}`}
                  >
                    {(typeof column.render === "function"
                      ? column.render(row)
                      : value(row)) ?? "—"}
                  </td>
                );
              })}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-6 text-center text-xs uppercase tracking-[0.4em] text-[#C8A1B4]"
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
