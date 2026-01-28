import Header from "@/components/header";
import HomeClient from "./homeClient";
export const dynamic = 'force-dynamic';

export default async function Home() {
    return (
        <div className="flex flex-col items-center w-full bg-mainBgcolor min-h-[100vh]">
            <Header />
            <HomeClient />
        </div>
    );
}
