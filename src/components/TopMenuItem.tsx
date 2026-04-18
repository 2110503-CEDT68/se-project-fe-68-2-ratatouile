import Link from "next/link";

export default function TopMenuItem({
  title,
  pageRef,
}: {
  title: string;
  pageRef: string;
}) {
  return (
    <Link className="ds-nav-link" href={pageRef}>
      {title}
    </Link>
  );
}
