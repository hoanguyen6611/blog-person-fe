"use client";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import TableCMS from "@/components/Table";
import { useAuth } from "@clerk/nextjs";
import { Space, TableColumnsType } from "antd";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { format } from "date-fns";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTableStore } from "@/store/useTableStore";
import axios from "axios";
import { toast } from "react-toastify";
import { Tag } from "@/interface/Tag";

interface DataType {
  _id: string;
  name: string;
  createdAt: string;
  slug: string;
}
const TagPage = () => {
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();
  const { setIsShowFormDelete, setIdDelete } = useTableStore();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
            <EditOutlined
              className="cursor-pointer"
              style={{ fontSize: "16px" }}
            />
          </button>
          <button
            className="text-red-500"
            onClick={() => showFormDelete(record._id)}
          >
            <DeleteOutlined
              className="cursor-pointer"
              style={{ fontSize: "16px" }}
            />
          </button>
        </Space>
      ),
    },
  ];
  const { data, error, isLoading, mutate } = useSWR(
    isSignedIn
      ? [`fetch-user-posts`, pagination.current, pagination.pageSize]
      : null,
    async ([_, page, limit]) => {
      const token = await getToken();
      return fetcherWithTokenUseSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/tags`,
        token!
      );
    }
  );
  const dataSource =
    data?.tags?.map((tag: Tag) => ({
      key: tag._id,
      ...tag,
    })) || [];
  const handleDeletePost = async (id: string) => {
    const token = await getToken();
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/tags/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      setIsShowFormDelete(false);
      toast.success("Delete tag successfully");
      await mutate();
      router.push(`/cms/tag`);
    }
  };
  const showFormDelete = (id: string) => {
    setIsShowFormDelete(true);
    setIdDelete(id);
  };
  if (!isSignedIn) return <p>You are not logged in</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;
  return (
    <TableCMS
      columns={columns}
      dataSource={dataSource}
      nameButtonCreate="New Tag"
      onDelete={handleDeletePost}
      nameModalDelete="tag"
    />
  );
};

export default TagPage;
