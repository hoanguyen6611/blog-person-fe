"use client";
import { Select } from "antd";

interface SelectOption {
  label: string;
  value: string;
}
type SelectOptionProps = {
  categories: SelectOption[];
  value?: any;
  onChangeCategory?: (value: string) => void;
};

const SelectOption: React.FC<SelectOptionProps> = ({
  categories,
  value,
  onChangeCategory,
}) => {
  const onSearch = (value: string) => {};

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
    </div>
  );
};

export default SelectOption;
