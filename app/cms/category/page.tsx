"use client";
import { fetcherUseSWR } from "@/api/useswr";
import TableCMS from "@/components/Table";
import { Category } from "@/interface/Category";
import { Space, TableColumnsType } from "antd";
import useSWR from "swr";
import { format } from "date-fns";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useAuth, useUser } from "@clerk/nextjs";
import { Replace } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useTableStore } from "@/store/useTableStore";
import { useState } from "react";
import CategoryTable from "@/components/cms/category/CategoryTable";

interface DataType {
  _id: string;
  title: string;
  status: boolean;
  createdAt: string;
}
const CategoryPage = () => {
  const { user } = useUser();
  const { getToken, isSignedIn } = useAuth();
  const isAdmin = user?.publicMetadata?.role === "admin" || false;
  const { setIsShowFormDelete, setIdDelete } = useTableStore();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { data: categories, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  // const { data: categories, mutate } = useSWR(
  //   isSignedIn
  //     ? [`fetch-user-posts`, pagination.current, pagination.pageSize]
  //     : null,
  //   async ([_, page, limit]) => {
  //     return fetcherUseSWR(
  //       `${process.env.NEXT_PUBLIC_API_URL}/posts/user?page=${page}&limit=${limit}`
  //     );
  //   }
  // );
  const columns: TableColumnsType<DataType> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => <>{text ? "Active" : "Inactive"}</>,
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
            // onClick={() => {
            //   router.push(`/cms/edit/post/${record._id}`);
            // }}
          >
            <EditOutlined
              className="cursor-pointer"
              style={{ fontSize: "16px" }}
            />
          </button>
          {isAdmin && (
            <button
              className="text-red-500"
              onClick={() => showFormDeleteCategory(record._id)}
            >
              <DeleteOutlined
                className="cursor-pointer"
                style={{ fontSize: "16px" }}
              />
            </button>
          )}
          {isAdmin && (
            <button
              className="text-green-300"
              onClick={() => changeStatusCategory(record._id)}
            >
              <Replace
                className="cursor-pointer"
                style={{ fontSize: "16px" }}
              />
            </button>
          )}
        </Space>
      ),
    },
  ];
  const showFormDeleteCategory = (id: string) => {
    setIsShowFormDelete(true);
    setIdDelete(id);
  };
  const changeStatusCategory = async (id: string) => {
    const token = await getToken();
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/category/changeStatus/${id}`,
      {
        categoryId: id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      toast.success("Change status category successfully");
      await mutate();
    }
  };

  const dataSource =
    categories?.categories?.map((category: Category) => ({
      key: category._id,
      ...category,
    })) || [];
  // return (
  //   <TableCMS
  //     columns={columns}
  //     dataSource={dataSource}
  //     buttonCreate={true}
  //     nameButtonCreate="New Category"
  //   />
  // );
  return <CategoryTable />;
};

export default CategoryPage;
