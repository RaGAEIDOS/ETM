import NotFoundContent from "@/components/NotFoundContent";

// Note: app/[locale]/[...rest]/page.tsx calls notFound() so this file renders
// for unknown paths inside a valid locale.
export default function LocaleNotFound() {
  return <NotFoundContent />;
}
