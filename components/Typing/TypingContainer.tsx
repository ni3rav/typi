import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypingText } from "./TypingText";

export function TypingContainer() {
  return (
    <div className="w-full h-[85vh] flex flex-col justify-start items-center">
      {/* for adjusting text and stuff */}
      <div className="w-9/12 bg-yellow-200 h-12"></div>
      {/* for adjusting text and stuff */}

      {/* the text and stuff */}
      <TypingText />
      {/* the text and stuff */}

      {/* restart button */}
      <Button
        size={"lg"}
        variant={"ghost"}
        className="hover:bg-transparent text-gray-600 hover:text-gray-300"
      >
        <RotateCcw className="scale-[2]" />
      </Button>
      {/* restart button */}
    </div>
  );
}
