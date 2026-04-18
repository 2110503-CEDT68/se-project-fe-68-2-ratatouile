import Link from "next/link";

export default function TopMenuItem( {title,pageRef} : {title:string, pageRef:string}) {
  return (
    <Link className="text-lg hover:text-[#8C442D] hover:scale-95 transition-all duration-200" href={pageRef}>
        {title}
    </Link>
  );
}