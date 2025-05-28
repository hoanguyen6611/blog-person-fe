"use client";
import useSWR from "swr";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "../../../api/useswr";
import { Post } from "@/interface/Post";
import { format } from "date-fns";
import ImageShow from "../../Image";
import { Plus, Trash, EditIcon } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Flex, Modal, Space, Table } from "antd";
import { Category } from "@/interface/Category";
import type { TableColumnsType } from "antd";
import { useEffect, useState } from "react";
import { TableRowSelection } from "antd/es/table/interface";

interface DataType {
  _id: string;
  title: string;
  description: number;
  category: string;
  createdAt: string;
  slug: string;
}
const CmsPostPage = () => {
  const router = useRouter();
  const [isShowFormDelete, setIsShowFormDelete] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [idPostDelete, setIdPostDelete] = useState("");
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
      router.push(`/cms`);
    }
  };
  const columns: TableColumnsType<DataType> = [
    {
      title: "Image",
      dataIndex: "img",
      key: "img",
      render: (text) => (
        <>
          <ImageShow
            src={text}
            alt={text}
            className="w-10 h-10"
            width={100}
            height={100}
          />
        </>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      filters: categories?.categories.map((category: Category) => ({
        text: category.title,
        value: category._id,
      })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <>{format(new Date(text), "dd/MM/yyyy")}</>,
      //   defaultSortOrder: 'descend',
      // sorter: (a, b) => format(new Date(a.createdAt), "dd/MM/yyyy") - b.createdAt,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button
            className="text-blue-500"
            onClick={() => {
              router.push(`/cms/edit/post/${record._id}`);
            }}
          >
            <EditIcon />
          </button>
          <button
            className="text-red-500"
            onClick={() => showFormDelete(record._id)}
          >
            <Trash />
          </button>
        </Space>
      ),
    },
  ];
  const showFormDelete = (id: string) => {
    setIsShowFormDelete(true);
    setIdPostDelete(id);
  };
  const dataSource =
    data?.posts?.map((post: Post) => ({
      key: post._id, // 👈 Cần có 'key' ở đây!
      categoryName: categories?.categories.find(
        (category: Category) => category._id === post.category
      )?.title,
      ...post,
      // thêm các field cần hiển thị
    })) || [];
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
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <>
        <Flex gap="small" wrap>
          <Button type="primary" onClick={() => router.push("/write")}>
            <Plus />
            New Post
          </Button>
        </Flex>
      </>
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

export default CmsPostPage;
