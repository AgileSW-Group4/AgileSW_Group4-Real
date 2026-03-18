import { Navbar } from "@/components/Navbar";
import { CreateIncident } from "@/components/createIncident";

export default function CreatePage() {
    return (
        <div className="flex flex-col h-full w-full bg-[#f1f5f9]">
            <Navbar />
            <CreateIncident />
        </div>
    );
}
