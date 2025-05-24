"use client";
import useSWR from "swr";
import { fetcherUseSWR } from "../api/useswr";
import { Post } from "@/interface/Post";
import { format } from "date-fns";
import ImageShow from "../components/Image";
import { Plus, Trash, Wrench } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Flex, Space, Table } from "antd";
import type { TableProps } from "antd";
import { Category } from "@/interface/Category";

const CMSPage = () => {
  interface DataType {
    _id: string;
    title: string;
    description: number;
    category: string;
    createdAt: string;
    slug: string;
  }

  const { user } = useUser();
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();
  const isAdmin = user?.publicMetadata?.role === "admin" || false;
  const urlAdmin = `${process.env.NEXT_PUBLIC_API_URL}/posts`;
  const urlUser = `${process.env.NEXT_PUBLIC_API_URL}/posts?author=${user?.username}`;
  const { data, error, isLoading, mutate } = useSWR(
    `${isAdmin ? urlAdmin : urlUser}`,
    fetcherUseSWR
  );
  const {
    data: categories,
    error: errorCategories,
    isLoading: isLoadingCategories,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/category`, fetcherUseSWR);
  const handleDelete = async (id: string) => {
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
      toast.success("Delete post successfully");
      await mutate();
      setTimeout(() => {
        router.push(`/cms`);
      }, 3000);
    }
  };
  const columns: TableProps<DataType>["columns"] = [
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
      // render: (text) => <a>{text}</a>,
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
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <>{format(new Date(text), "dd/MM/yyyy")}</>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button
            className="text-blue-500"
            onClick={() => {
              router.push(`/cms/edit/post/${record.slug}`);
            }}
          >
            <Wrench />
          </button>
          <button
            className="text-red-500"
            onClick={() => handleDelete(record._id)}
          >
            <Trash />
          </button>
        </Space>
      ),
    },
  ];
  const dataSource =
    data?.posts?.map((post: Post) => ({
      key: post._id, // 👈 Cần có 'key' ở đây!
      categoryName: categories?.categories.find(
        (category: Category) => category._id === post.category
      )?.title,
      ...post,
      // thêm các field cần hiển thị
    })) || [];

  if (!isSignedIn) return <p>Bạn chưa đăng nhập</p>;
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
      <Table<DataType> columns={columns} dataSource={dataSource} />
    </div>
  );
};

export default CMSPage;
