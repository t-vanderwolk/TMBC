'use client';

import { ReactNode } from 'react';

type AdminTableRow = {
  id: string;
  cells: ReactNode[];
};

type AdminTableProps = {
  title: string;
  columns: string[];
  rows: AdminTableRow[];
  footnote?: string;
};

export default function AdminTable({ title, columns, rows, footnote }: AdminTableProps) {
  return (
    <div className="rounded-2xl border border-tmBlush/60 bg-gradient-to-br from-white/90 via-tmBlush/50 to-tmIvory p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">{title}</p>
        {footnote && <p className="text-xs text-tmCharcoal/60">{footnote}</p>}
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[400px] w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.4em] text-tmCharcoal/60">
              {columns.map((column) => (
                <th key={column} className="px-3 py-2 text-left">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-tmBlush/40 border-t border-tmBlush/30">
            {rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-tmBlush/30">
                {row.cells.map((cell, index) => (
                  <td key={`${row.id}-${index}`} className="px-3 py-3 align-top text-tmCharcoal">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
