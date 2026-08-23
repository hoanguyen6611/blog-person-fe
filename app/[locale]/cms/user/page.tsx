"use client";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import ImageShow from "@/components/Image";
import TableCMS from "@/components/Table";
import { User } from "@/interface/User";
import { useAuth } from "@clerk/nextjs";
import { TableColumnsType } from "antd";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { useTranslations } from "next-intl";
import { useRequireAuth } from "@/hooks/useRequireAuth";
interface DataType {
  _id: string;
  img: string;
  username: string;
  email: string;
  createdAt: string;
}
const UserCms = () => {
  useRequireAuth();
  const t = useTranslations("UserTable");
  const tCms = useTranslations("Cms");
  const router = useRouter();
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
        `${process.env.NEXT_PUBLIC_API_URL}/users/sumUser?page=${page}&limit=${limit}`,
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
      title: t("username"),
      dataIndex: "username",
      key: "username",
    },
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <>{format(new Date(text), "dd/MM/yyyy")}</>,
      //   defaultSortOrder: 'descend',
      // sorter: (a, b) => format(new Date(a.createdAt), "dd/MM/yyyy") - b.createdAt,
    },
  ];
  const dataSource =
    data?.users?.map((user: User) => ({
      key: user._id,
      ...user,
    })) || [];
  const handleOkFormDelete = async (id: string) => {
    const token = await getToken();
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      toast.success("Delete user successfully");
      await mutate();
      router.push(`/cms/user`);
    }
  };
  if (!isSignedIn)
    return <p data-testid="cms-user-page">{tCms("notLoggedIn")}</p>;
  if (isLoading) return <p data-testid="cms-user-page">Loading...</p>;
  if (error) return <p data-testid="cms-user-page">Failed to load</p>;
  return (
    <div data-testid="cms-user-page">
      <TableCMS
        columns={columns}
        dataSource={dataSource}
        nameButtonCreate={t("newUser")}
        onDelete={handleOkFormDelete}
        nameModalDelete="user"
      />
    </div>
  );
};

export default UserCms;
