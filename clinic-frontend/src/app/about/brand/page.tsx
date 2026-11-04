import { publicPageMetadata } from "@/lib/seo/publicMetadata";
import BrandEditorial from "@/components/about/brand/BrandEditorial";

export async function generateMetadata() {
  return publicPageMetadata("/about/brand");
}

export default function BrandPage() {
  return <BrandEditorial />;
}
