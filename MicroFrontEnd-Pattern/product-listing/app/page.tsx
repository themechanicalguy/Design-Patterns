import { faker } from "@faker-js/faker";
import products from "./utils/product-helper";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {products?.map((item) => (
        <p>{item}</p>
      ))}
    </div>
  );
}
