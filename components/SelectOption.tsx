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
  testId?: string;
  categories: SelectOption[];
  value?: string;
  onChangeCategory?: (value: string) => void;
  direction?: "row" | "col";
  className?: string;
  // Lets a caller take over search (e.g. to search a full dataset while
  // only a paginated slice of it is passed in `categories`) instead of
  // antd's default client-side filtering over the options actually
  // rendered — pair with filterOption={false}.
  onSearch?: (value: string) => void;
  filterOption?: boolean;
  // Appended below the option list inside the dropdown — e.g. a "load
  // more" button — without affecting antd's own selection/close behavior.
  popupRender?: React.ComponentProps<typeof Select>["popupRender"];
};

const SelectOption: React.FC<SelectOptionProps> = ({
  name,
  label = "Choose a category",
  testId,
  categories,
  value,
  onChangeCategory,
  direction = "row",
  className,
  onSearch,
  filterOption = true,
  popupRender,
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
        filterOption={filterOption}
        onSearch={onSearch}
        popupRender={popupRender}
        onChange={onChangeCategory}
        options={categories}
        allowClear
        data-testid={testId ?? `select-${name}`}
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
