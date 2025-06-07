import Link from "next/link";

const Siderbar = () => {
  return (
    <div className="w-40 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      {/* <div className="text-2xl font-bold p-4 border-b border-gray-700">CMS</div> */}
      <Link
        href="/"
        className="text-2xl font-bold p-4 border-b border-gray-700"
      >
        CMS
      </Link>
      <nav className="flex flex-col p-4 gap-2">
        <Link href="/cms" className="hover:bg-gray-700 p-2 rounded">
          Dashboard
        </Link>
        <Link href="/cms/posts" className="hover:bg-gray-700 p-2 rounded">
          Post
        </Link>
        <Link href="/cms/category" className="hover:bg-gray-700 p-2 rounded">
          Category
        </Link>
        <Link href="/cms/media" className="hover:bg-gray-700 p-2 rounded">
          Media
        </Link>
      </nav>
    </div>
  );
};

export default Siderbar;
