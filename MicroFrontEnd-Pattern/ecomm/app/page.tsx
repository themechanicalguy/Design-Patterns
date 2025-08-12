import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the RemoteComponent (client-side only)
// const RemoteComponent = dynamic(() => import("products/Products"), {
//   ssr: false,
// });

export default function Home() {
  const [sharedData, setSharedData] = useState(null);
  useEffect(() => {
    // Dynamically import the shared utility function
    import("products/Products").then((module) => {
      const getSharedData = module.default;
      setSharedData(getSharedData());
    });
  }, []);
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        Hello To Cart repo
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
