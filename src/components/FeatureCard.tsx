import Image from "next/image";

export default function FeatureCard( {icon,title,description} : {icon:string,title:string,description:string}) {
  return (
    <div className="flex flex-col text-center items-center p-2 bg-[#F5F5DC]/10 shadow-xl backdrop-blur border border-[#D9C89C]/90 w-60 h-75 py-2 border rounded-xl transition-all duration-300 hover:scale-105">
        {/* <div className="border h-30">ICON</div> */}

        <div className="relative w-28 h-28">
            <Image  src={icon} alt={title} fill className="object-cover"/>
        </div>
        
        <div className="text-3xl mt-3 text-[#D9C89C] whitespace-pre-line">{title}</div>
        <div className="text-sm mt-2">{description}</div>
    </div>
  );
}