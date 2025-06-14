"use client";
import { Select } from "antd";

interface SelectOption {
  label: string;
  value: string;
}
type SelectOptionProps = {
  name: string;
  categories: SelectOption[];
  value?: any;
  onChangeCategory?: (value: string) => void;
};

const SelectOption: React.FC<SelectOptionProps> = ({
  name,
  categories,
  value,
  onChangeCategory,
}) => {
  const onSearch = (value: string) => {};

  return (
    <div className="flex gap-2">
      <div className="flex flex-row gap-2">
        <label htmlFor="" className="text-sm">
          Choose a category:
        </label>
        <Select
          showSearch
          value={value}
          placeholder={name}
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
