import { notFound } from "next/navigation";

// Unknown paths inside a valid locale segment render the localized 404.
export default function CatchAllPage() {
  notFound();
}
