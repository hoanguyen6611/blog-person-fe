"use client";
import { fetcherWithTokenUseSWR } from "@/api/useswr";
import UserTable from "@/components/cms/user/UserTable";
import ImageShow from "@/components/Image";
import TableCMS from "@/components/Table";
import { User } from "@/interface/User";
import { useAuth } from "@clerk/nextjs";
import { TableColumnsType } from "antd";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface DataType {
  _id: string;
  img: string;
  username: string;
  email: string;
  createdAt: string;
}
const UserCms = () => {
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
  // const handleDeletePost = async (id: string) => {
  //   const token = await getToken();
  //   const res = await axios.delete(
  //     `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   if (res.status === 200) {
  //     setIsShowFormDelete(false);
  //     toast.success("Delete post successfully");
  //     await mutate();
  //     router.push(`/cms`);
  //   }
  // };
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
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <>{format(new Date(text), "dd/MM/yyyy")}</>,
      //   defaultSortOrder: 'descend',
      // sorter: (a, b) => format(new Date(a.createdAt), "dd/MM/yyyy") - b.createdAt,
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <button
    //         className="text-blue-500"
    //         onClick={() => {
    //           router.push(`/cms/edit/post/${record._id}`);
    //         }}
    //       >
    //         <EditOutlined
    //           className="cursor-pointer"
    //           style={{ fontSize: "16px" }}
    //         />
    //       </button>
    //       <button
    //         className="text-red-500"
    //         onClick={() => showFormDelete(record._id)}
    //       >
    //         <DeleteOutlined
    //           className="cursor-pointer"
    //           style={{ fontSize: "16px" }}
    //         />
    //       </button>
    //     </Space>
    //   ),
    // },
  ];
  // const showFormDelete = (id: string) => {
  //   setIsShowFormDelete(true);
  //   setIdPostDelete(id);
  // };
  const dataSource =
    data?.users?.map((user: User) => ({
      key: user._id,
      ...user,
    })) || [];
  if (!isSignedIn) return <p>You are not logged in</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load</p>;
  // return <TableCMS columns={columns} dataSource={dataSource} />;
  return <UserTable />;
};

export default UserCms;
