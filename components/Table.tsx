"use client";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Flex, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import { TableRowSelection } from "antd/es/table/interface";
import { PlusOutlined } from "@ant-design/icons";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "@/api/useswr";
import { usePostStore } from "@/store/usePostStore";

interface DataType {
  _id: string;
  title: string;
  description: number;
  category: string;
  createdAt: string;
  slug: string;
  visit: number;
}
interface TableCMSProps {
  buttonCreate?: boolean;
  nameButtonCreate?: string;
  columns: any;
  dataSource: any;
}
const TableCMS = ({
  buttonCreate,
  columns,
  dataSource,
  nameButtonCreate,
}: TableCMSProps) => {
  const router = useRouter();
  // const [isShowFormDelete, setIsShowFormDelete] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const [idPostDelete, setIdPostDelete] = useState("");
  const {
    isShowFormDelete,
    setIsShowFormDelete,
    idPostDelete,
    setIdPostDelete,
  } = usePostStore();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { getToken, isSignedIn } = useAuth();
  const { data, error, isLoading, mutate } = useSWR(
    isSignedIn
      ? [`fetch-user-posts`, pagination.current, pagination.pageSize]
      : null,
    async ([_, page, limit]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/user?page=${page}&limit=${limit}`,
        token!
      );
    }
  );
  useEffect(() => {
    if (data?.totalPosts) {
      setPagination((prev) => ({
        ...prev,
        total: data.totalPosts,
      }));
    }
  }, [data]);
  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  const handleDeletePost = async (id: string) => {
    const token = await getToken();
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      setIsShowFormDelete(false);
      toast.success("Delete post successfully");
      await mutate();
      router.push(`/cms/posts`);
    }
  };

  const showFormDelete = (id: string) => {
    setIsShowFormDelete(true);
    setIdPostDelete(id);
  };
  const handleCancelFormDelete = () => {
    setIsShowFormDelete(false);
  };
  const handleOkFormDelete = () => {
    handleDeletePost(idPostDelete);
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  if (!isSignedIn) return <p>You are not logged in</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;
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
      <Table<DataType>
        columns={columns}
        dataSource={dataSource}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data?.totalPosts || 0,
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
