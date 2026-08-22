"use client";
import { Select } from "antd";
import { cn } from "@/lib/utils";

interface SelectOption {
  label: string;
  value: string;
}
type SelectOptionProps = {
  name: string;
  label?: string;
  categories: SelectOption[];
  value?: string;
  onChangeCategory?: (value: string) => void;
  direction?: "row" | "col";
  className?: string;
};

const SelectOption: React.FC<SelectOptionProps> = ({
  name,
  label = "Choose a category",
  categories,
  value,
  onChangeCategory,
  direction = "row",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex gap-2",
        direction === "col" ? "flex-col" : "flex-row items-center",
        className
      )}
    >
      <label
        htmlFor=""
        className={cn(
          "text-sm",
          direction === "col" &&
            "font-medium text-gray-700 dark:text-gray-300"
        )}
      >
        {label}
      </label>
      <Select
        showSearch
        value={value}
        placeholder={name}
        optionFilterProp="label"
        onChange={onChangeCategory}
        options={categories}
        allowClear
        data-testid={`select-${name}`}
        className={
          direction === "col"
            ? "[&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!rounded-xl"
            : undefined
        }
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default SelectOption;
