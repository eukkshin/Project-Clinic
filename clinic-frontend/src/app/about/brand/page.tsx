import BrandEditorial from "@/components/about/brand/BrandEditorial";
import { publicPageMetadata } from "@/lib/seo/publicMetadata";

export async function generateMetadata() {
  return publicPageMetadata("/about/brand");
}

export default function BrandPage() {
  return <BrandEditorial />;
}
