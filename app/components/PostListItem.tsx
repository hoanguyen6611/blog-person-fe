import Link from "next/link";
import ImageShow from "./Image";

const PostListItem = () => {
  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* image */}
      <div className="md:hidden xl:block xl:w-1/3">
        <ImageShow
          src="featured1.jpg"
          className="rounded-2xl object-cover"
          width={600}
          height={400}
          alt="featured1"
        />
      </div>
      {/* details */}
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link href="/posts/1" className="text-4xl font-semibold">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Written by</span>
          <Link href="" className="text-blue-800">
            John Doe
          </Link>
          <span>on</span>
          <Link href="" className="text-blue-800">
            Web Design
          </Link>
          <span>2 days ago</span>
        </div>
        <p className="">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quos.
        </p>
        <Link href="" className="underline text-blue-800">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;
