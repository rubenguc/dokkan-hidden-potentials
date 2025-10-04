import { Github, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t  bg-[#082c09] border-green-400 bottom-0">
      <div className="container mx-auto px-4 py-6 flex justify-center gap-10">
        <a
          href="https://github.com/rubenguc/dokkan-hidden-potentials"
          target="_blank"
          className="text-slate-100 flex items-center gap-1"
        >
          <Github />
          <span>code</span>
        </a>
        <a
          href="https://www.youtube.com/playlist?list=PL96oiZRZyU_Mm3z4WiVp7wfp1H4IFYV9Y"
          target="_blank"
          className="text-slate-100 flex items-center gap-1"
        >
          <Youtube color="#c4302b" size={30} />
          <span>guide source</span>
        </a>
      </div>
    </footer>
  );
}
