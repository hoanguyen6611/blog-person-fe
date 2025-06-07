import Siderbar from "../components/Sidebar";
import "./cms.css";

export default function CMSLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64">
      <Siderbar />
      <div className="mt-4 flex flex-col gap-4 ml-[100px] w-full">
        {children}
      </div>
    </div>
  );
}
