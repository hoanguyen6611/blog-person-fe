"use client";
import { useRouter } from "@/i18n/navigation";
import { Modal, Table } from "antd";
import { useMemo, useState } from "react";
import { TableRowSelection } from "antd/es/table/interface";
import { Plus, Search, Trash2, X } from "lucide-react";
import { useTableStore } from "@/store/useTableStore";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface BulkAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "danger";
  onClick: (selectedKeys: React.Key[], done: () => void) => void;
}

interface TableCMSProps {
  buttonCreate?: boolean;
  nameButtonCreate?: string;
  showToolbar?: boolean;
  columns: any;
  dataSource: any;
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => Promise<void> | void;
  extraBulkActions?: BulkAction[];
  nameModalDelete?: string;
}
const TableCMS = ({
  buttonCreate,
  columns,
  dataSource,
  nameButtonCreate,
  showToolbar = true,
  onDelete,
  onBulkDelete,
  extraBulkActions,
  nameModalDelete,
}: TableCMSProps) => {
  const router = useRouter();
  const t = useTranslations("Cms");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const { isShowFormDelete, setIsShowFormDelete, idDelete } = useTableStore();
  const [query, setQuery] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleCancelFormDelete = () => {
    setIsShowFormDelete(false);
  };
  const handleOkFormDelete = () => {
    onDelete(idDelete);
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const filteredSource = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dataSource;
    return (dataSource ?? []).filter((row: Record<string, unknown>) =>
      JSON.stringify(row).toLowerCase().includes(q)
    );
  }, [dataSource, query]);

  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    if (onBulkDelete) {
      await onBulkDelete(selectedRowKeys.map(String));
    } else {
      for (const key of selectedRowKeys) {
        await onDelete(String(key));
      }
    }
    setIsBulkDeleting(false);
    setIsBulkDeleteOpen(false);
    setSelectedRowKeys([]);
  };

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl border border-line-soft bg-surface p-4 shadow-sm md:p-6"
      data-testid="cms-table-card"
    >
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-9 min-w-[220px] flex-1 items-center gap-2 rounded-[10px] bg-surface-2 px-3">
            <Search size={15} className="text-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
              data-testid="cms-table-search-input"
            />
          </div>
          {buttonCreate && (
            <button
              type="button"
              onClick={() => router.push("/write")}
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-[10px] bg-gradient-to-b from-accent to-accent-dark px-3.5 font-cta text-sm font-medium text-white hover:opacity-90"
              data-testid="cms-table-create-button"
            >
              <Plus size={15} />
              {nameButtonCreate}
            </button>
          )}
        </div>
      )}

      {selectedRowKeys.length > 0 && (
        <div
          className="flex items-center gap-3 rounded-[10px] bg-surface-2 px-3.5 py-2.5"
          data-testid="cms-table-bulk-toolbar"
        >
          <span className="text-sm font-semibold text-ink">
            {t("selectedCount", { count: selectedRowKeys.length })}
          </span>
          {extraBulkActions?.map((action) => (
            <button
              key={action.key}
              type="button"
              onClick={() =>
                action.onClick(selectedRowKeys, () => setSelectedRowKeys([]))
              }
              className={cn(
                "flex h-7 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium",
                action.variant === "danger"
                  ? "border-red-200 text-red-500"
                  : "border-line text-muted hover:text-ink"
              )}
              data-testid={`cms-table-bulk-${action.key}-button`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsBulkDeleteOpen(true)}
            className="flex h-7 items-center gap-1.5 rounded-lg border border-red-200 px-2.5 text-xs font-medium text-red-500"
            data-testid="cms-table-bulk-delete-button"
          >
            <Trash2 size={12} />
            {t("bulkDelete")}
          </button>
          <button
            type="button"
            onClick={() => setSelectedRowKeys([])}
            className="ml-auto flex items-center gap-1 text-xs font-medium text-muted hover:text-ink"
            data-testid="cms-table-clear-selection-button"
          >
            <X size={12} />
            {t("clearSelection")}
          </button>
        </div>
      )}

      <Table
        data-testid="cms-table"
        columns={columns}
        dataSource={filteredSource}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: filteredSource?.length || 0,
          onChange: (page, pageSize) => {
            setPagination({ ...pagination, current: page, pageSize });
          },
        }}
        rowSelection={rowSelection}
      />
      <Modal
        title={`Delete ${nameModalDelete}`}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isShowFormDelete}
        onOk={handleOkFormDelete}
        onCancel={handleCancelFormDelete}
        okButtonProps={{ "data-testid": "cms-table-delete-confirm-button" }}
        cancelButtonProps={{ "data-testid": "cms-table-delete-cancel-button" }}
      >
        <p>Are you sure you want to {`Delete ${nameModalDelete}`}?</p>
      </Modal>
      <Modal
        title={t("bulkDeleteConfirmTitle", { count: selectedRowKeys.length })}
        open={isBulkDeleteOpen}
        onOk={handleBulkDelete}
        onCancel={() => setIsBulkDeleteOpen(false)}
        confirmLoading={isBulkDeleting}
        okButtonProps={{ "data-testid": "cms-table-bulk-delete-confirm-button" }}
        cancelButtonProps={{ "data-testid": "cms-table-bulk-delete-cancel-button" }}
      >
        <p>{t("bulkDeleteConfirmBody", { nameModalDelete: nameModalDelete ?? "" })}</p>
      </Modal>
    </div>
  );
};

export default TableCMS;
