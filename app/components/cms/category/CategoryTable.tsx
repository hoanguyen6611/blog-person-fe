"use client";
import { fetcherUseSWR } from "@/app/api/useswr";
import { TableColumnsType } from "antd";
import { Trash } from "lucide-react";
import { format } from "date-fns";
import useSWR from "swr";
import { Modal, Space, Table } from "antd";
import { EditIcon } from "lucide-react";
import { Category } from "@/interface/Category";
import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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
            <EditIcon />
          </button>
          {isAdmin && (
            <button
              className="text-red-500"
              onClick={() => showFormDeleteCategory(record._id)}
            >
              <Trash />
            </button>
          )}
        </Space>
      ),
    },
  ];
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
