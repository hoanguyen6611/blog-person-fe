"use client";
import { Modal, Select } from "antd";
import { Plus } from "lucide-react";
import { useState } from "react";

interface SelectOption {
  label: string;
  value: string;
}
type SelectOptionProps = {
  categories: SelectOption[];
  modal: boolean;
  value?: any;
  handleOk?: () => void;
  handleCancel?: () => void;
  onChangeCategory?: (value: string) => void;
};

const SelectOption: React.FC<SelectOptionProps> = ({
  categories,
  modal,
  value,
  handleOk,
  handleCancel,
  onChangeCategory,
}) => {
  const [idCategory, setIdCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
    setIdCategory(value);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-2">
        <label htmlFor="" className="text-sm">
          Choose a category:
        </label>
        <Select
          showSearch
          value={value}
          placeholder="Select a category"
          optionFilterProp="label"
          onChange={onChangeCategory}
          onSearch={onSearch}
          options={categories}
          style={{ width: "100%" }}
        />
      </div>
      <div>
        <button
          onClick={showModal}
          className="flex items-center gap-2 w-max p-3 px-5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm"
          type="button"
        >
          <Plus />
          New Category
        </button>
        {modal && (
          <Modal
            title="Create New Category"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <input
              className="text-4xl font-semibold bg-transparent outline-none"
              type="text"
              placeholder="My Awesome Category"
              name="nameCategory"
              // onChange={(e) => setNameCategory(e.target.value)}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default SelectOption;
