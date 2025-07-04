"use client";
import { fetcherUseSWR, fetcherWithTokenUseSWR } from "@/api/useswr";
import ImageShow from "@/components/Image";
import TableCMS from "@/components/Table";
import { useAuth } from "@clerk/nextjs";
import { Space, TableColumnsType } from "antd";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { format } from "date-fns";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Category } from "@/interface/Category";
import { Post } from "@/interface/Post";
import { useTableStore } from "@/store/useTableStore";
import { User } from "@/interface/User";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

interface DataType {
  _id: string;
  title: string;
  description: number;
  category: string;
  createdAt: string;
  slug: string;
  visit: number;
  user: User;
}
const PostPage = () => {
  const pathname = usePathname();
  const t = useTranslations("PostTable");
  const router = useRouter();
  const { getToken, isSignedIn } = useAuth();
  const { setIsShowFormDelete, setIdDelete } = useTableStore();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { data: categories } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  const columns: TableColumnsType<DataType> = [
    {
      title: t("image"),
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
      title: t("title"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("description"),
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: t("author"),
      dataIndex: "user",
      key: "user",
      render: (text) => <>{text.username}</>,
    },
    {
      title: t("visit"),
      dataIndex: "visit",
      key: "visit",
    },
    {
      title: t("category"),
      dataIndex: "categoryName",
      key: "categoryName",
      filters: categories?.categories.map((category: Category) => ({
        text: category.title,
        value: category._id,
      })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <>{format(new Date(text), "dd/MM/yyyy")}</>,
      //   defaultSortOrder: 'descend',
      // sorter: (a, b) => format(new Date(a.createdAt), "dd/MM/yyyy") - b.createdAt,
    },
    {
      title: t("action"),
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
        `${process.env.NEXT_PUBLIC_API_URL}/posts/user?page=${page}&limit=${limit}`,
        token!
      );
    }
  );
  useEffect(() => {
    mutate(); // force revalidation
  }, [pathname]);
  const dataSource =
    data?.posts?.map((post: Post) => ({
      key: post._id,
      categoryName: categories?.categories.find(
        (category: Category) => category._id === post.category
      )?.title,
      ...post,
    })) || [];
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
    setIdDelete(id);
  };
  if (!isSignedIn) return <p>You are not logged in</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;
  return (
    <TableCMS
      columns={columns}
      dataSource={dataSource}
      buttonCreate={true}
      nameButtonCreate={t("newPost")}
      onDelete={handleDeletePost}
      nameModalDelete="post"
    />
  );
};

export default PostPage;
