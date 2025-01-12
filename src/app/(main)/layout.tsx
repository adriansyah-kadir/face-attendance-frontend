import Sidebar from "@/lib/ui/widgets/sidebar";
import { Divider } from "@nextui-org/react";

export default function Layout1({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-screen flex">
      <Sidebar />
      <Divider orientation="vertical" />
      <div className="w-full h-full overflow-auto">
        {children}
      </div>
    </div>
  );
}
