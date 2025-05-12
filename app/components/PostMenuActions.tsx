import { Save, Trash } from "lucide-react";

const PostMenuActions = () => {
  return (
    <div>
      <h1 className="mt-8 mb-4 text-sm font-bold">Actions</h1>
      <div className="flex items-center gap-2 py-2 text-sm cursor-pointer">
        <Save />
        <span>Save this Post</span>
      </div>
      <div className="flex items-center gap-2 py-2 text-sm cursor-pointer text-red-500">
        <Trash />
        <span>Delete this Post</span>
      </div>
    </div>
  );
};

export default PostMenuActions;
