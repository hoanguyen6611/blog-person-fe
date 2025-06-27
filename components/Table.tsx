"use client";
import { useRouter } from "next/navigation";
import { Button, Flex, Modal, Table } from "antd";
import { useState } from "react";
import { TableRowSelection } from "antd/es/table/interface";
import { PlusOutlined } from "@ant-design/icons";
import { useTableStore } from "@/store/useTableStore";

interface TableCMSProps {
  buttonCreate?: boolean;
  nameButtonCreate?: string;
  columns: any;
  dataSource: any;
  onDelete: (id: string) => void;
}
const TableCMS = ({
  buttonCreate,
  columns,
  dataSource,
  nameButtonCreate,
  onDelete,
}: TableCMSProps) => {
  const router = useRouter();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { isShowFormDelete, setIsShowFormDelete, idDelete } = useTableStore();
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

  return (
    <div className="h-[calc(100vh-32px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      {buttonCreate && (
        <>
          <Flex gap="small" wrap>
            <Button type="primary" onClick={() => router.push("/write")}>
              <PlusOutlined
                className="cursor-pointer"
                style={{ fontSize: "16px" }}
              />
              {nameButtonCreate}
            </Button>
          </Flex>
        </>
      )}
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: dataSource?.totalPosts || 0,
          onChange: (page, pageSize) => {
            setPagination({ ...pagination, current: page, pageSize });
          },
        }}
        rowSelection={rowSelection}
      />
      <Modal
        title="Delete post"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isShowFormDelete}
        onOk={handleOkFormDelete}
        onCancel={handleCancelFormDelete}
      >
        <p>Are you sure you want to delete this post?</p>
      </Modal>
    </div>
  );
};

export default TableCMS;
