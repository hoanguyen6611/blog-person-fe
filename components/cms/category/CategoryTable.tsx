"use client";
import { fetcherUseSWR } from "@/api/useswr";
import { TableColumnsType } from "antd";
import { format } from "date-fns";
import useSWR from "swr";
import { Modal, Space, Table } from "antd";
import { Category } from "@/interface/Category";
import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Replace } from "lucide-react";

interface DataType {
  _id: string;
  title: string;
  status: boolean;
  createdAt: string;
}
const CategoryTable = () => {
  const [isShowFormDelete, setIsShowFormDelete] = useState(false);
  const [idCategoryDelete, setIdCategoryDelete] = useState("");
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const isAdmin = user?.publicMetadata?.role === "admin" || false;
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
  const showFormDeleteCategory = (id: string) => {
    setIsShowFormDelete(true);
    setIdCategoryDelete(id);
  };
  const { data: categories, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcherUseSWR
  );
  const dataSource =
    categories?.categories?.map((category: Category) => ({
      key: category._id,
      ...category,
    })) || [];
  const handleOkFormDelete = async () => {
    const token = await getToken();
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/category/${idCategoryDelete}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      setIsShowFormDelete(false);
      toast.success("Delete category successfully");
      await mutate();
      router.push(`/cms/category`);
    }
  };
  const handleCancelFormDelete = () => {
    setIsShowFormDelete(false);
  };
  if (!isAdmin) {
    return <div>You are not admin</div>;
  }
  return (
    <div>
      <Table<DataType> columns={columns} dataSource={dataSource} />
      <Modal
        title="Delete category"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isShowFormDelete}
        onOk={handleOkFormDelete}
        onCancel={handleCancelFormDelete}
      >
        <p>Are you sure you want to delete this category?</p>
      </Modal>
    </div>
  );
};

export default CategoryTable;
