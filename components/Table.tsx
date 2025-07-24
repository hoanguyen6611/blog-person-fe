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
  nameModalDelete?: string;
}
const TableCMS = ({
  buttonCreate,
  columns,
  dataSource,
  nameButtonCreate,
  onDelete,
  nameModalDelete,
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
    <div className="h-[calc(100vh-32px)] md:h-[calc(100vh-80px)] flex flex-col gap-6 ml-8 mr-6 mb-4">
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
        className="mt-4 w-full h-full dark:text-gray-400 dark:bg-gray-800"
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
        title={`Delete ${nameModalDelete}`}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isShowFormDelete}
        onOk={handleOkFormDelete}
        onCancel={handleCancelFormDelete}
      >
        <p>Are you sure you want to {`Delete ${nameModalDelete}`}?</p>
      </Modal>
    </div>
  );
};

export default TableCMS;
