import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";


export default function Home() {
  return (
    <div className="flex flex-col h-full w-full">
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
          <Sidebar/>
      </div>
    </div>
  );
}
