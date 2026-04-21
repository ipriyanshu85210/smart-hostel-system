import { MdEdit, MdDelete, MdSearchOff } from 'react-icons/md';

const DataTable = ({ columns, data, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface-card overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 animate-shimmer border-b border-border last:border-b-0" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface-card p-12 text-center">
        <MdSearchOff className="text-text-muted mx-auto mb-3" size={48} />
        <p className="text-text-secondary text-sm font-medium">No records found</p>
        <p className="text-text-muted text-xs mt-1">Add a new entry to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-4"
                >
                  {col.label}
                </th>
              ))}
              <th className="text-right text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row._id || idx}
                className="border-b border-border last:border-b-0 hover:bg-surface-hover/50 transition-colors duration-150"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-4 text-text-primary whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(row)}
                      className="p-2 rounded-lg bg-primary/10 text-primary-light hover:bg-primary/20 transition-all duration-200 cursor-pointer"
                      title="Edit"
                    >
                      <MdEdit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(row._id)}
                      className="p-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-all duration-200 cursor-pointer"
                      title="Delete"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Row count footer */}
      <div className="px-5 py-3 border-t border-border bg-surface/30">
        <p className="text-xs text-text-muted">
          Showing <span className="font-semibold text-text-secondary">{data.length}</span> record{data.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default DataTable;
