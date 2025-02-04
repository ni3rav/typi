import {TypingContainer} from "@/components/Typing/TypingContainer";

function page() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="w-full h-[14vh] bg-green-600"></div>
      <TypingContainer />
      <div className="w-full h-[6vh] bg-green-600"></div>
    </div>
  );
}
export default page;
