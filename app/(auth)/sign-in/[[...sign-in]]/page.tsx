import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { X } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000]">
      <div className="flex w-full max-w-[840px] h-auto min-h-[500px] bg-[#1a1a1a] rounded-[24px] overflow-hidden shadow-2xl mx-4 relative z-10 border border-[#2a2a2a]">

        {/* Left Panel */}
        <div className="w-full md:w-[50%] p-6 md:p-8 flex flex-col justify-start md:pt-14 relative bg-[#0a0a0a]">
          <div className="w-full max-w-[340px] mx-auto flex flex-col items-center">
            <h2 className="text-[22px] font-bold text-white text-center tracking-tight mb-1">
              Welcome back
            </h2>
            <p className="text-[#777] text-[13px] text-center mb-8">
              Sign in to continue
            </p>

            <SignIn
              appearance={{
                // @ts-ignore
                layout: {
                  socialButtonsVariant: "blockButton",
                  socialButtonsPlacement: "top",
                },
                variables: {
                  colorBackground: "transparent",
                  colorForeground: "white",
                  colorPrimary: "#1e61ff",
                  colorInput: "transparent",
                  colorInputForeground: "white",
                  borderRadius: "0.75rem",
                  fontFamily: "Inter, system-ui, sans-serif",
                },
                elements: {
                  cardBox: "shadow-none bg-transparent m-0 p-0",
                  card: "bg-transparent shadow-none border-none p-0 w-full flex flex-col gap-0",
                  header: "!hidden",
                  headerTitle: "!hidden",
                  headerSubtitle: "!hidden",
                  footer: "!hidden",
                  internal: "!hidden",
                  socialButtons: "!flex !flex-col w-full !gap-3",
                  socialButtonsBlockButton: "w-full !bg-white !text-black hover:!bg-neutral-200 !border-none !h-[48px] !rounded-[12px] !transition-colors !m-0 !shadow-none justify-center",
                  socialButtonsBlockButtonText: "!text-black !font-semibold !text-[14px] before:content-['Continue_with_']",
                  socialButtonsBlockButtonArrow: "!hidden",
                  socialButtonsProviderIcon: "w-5 h-5 mr-3 !block !opacity-100",
                  socialButtonsBlockButton__apple: "before:content-[''] before:block before:w-5 before:h-5 before:mr-3 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48cGF0aCBkPSJNMzg4IDM1M2MtMjAtMTItMzEtNDAtdTMxLTY3czExLTU0IDMxLTY3Yy0xOC0yNS00NS0zOS03NS0zOS0zNyAwLTQ5IDI0LTc3IDI0LTI3IDAtNDEtMjQtNzctMjQtNDcgMC0xMDUgNDctMTA1IDEzNCAwIDM5IDE4IDEwNyA0MiAxNDkgMjAgMzUgNTEgNzUgODcgNzUgMjUgMCAzNS0xOCA2Ny0xOCAyOSAwIDQwIDE4IDY3IDE4IDI5IDAgNjMtNDkgODEtOTQtMTktOC0zNS0yNC0zNS00NXpNMjgzIDU5YzAgMzktMzMgNzEtODEgNzEtMS00MiAzNS03MCA4MS03MXoiLz48L3N2Zz4=')] before:bg-no-repeat before:bg-center before:bg-contain",
                  socialButtonsProviderIcon__apple: "!hidden", // Hide original if it shows up empty
                  dividerRow: "!my-5",
                  dividerLine: "!bg-[#222]",
                  dividerText: "!text-[#555] !text-[12px] !font-normal !tracking-wide uppercase before:hidden after:hidden",
                  formFieldInput: "!bg-transparent !border !border-[#333] !text-white focus:!border-[#555] !rounded-[12px] !h-[48px] !px-4 !mt-1.5 !text-[14px] !shadow-none placeholder:!text-[#555]",
                  formFieldLabel: "!hidden",
                  formButtonPrimary: "!bg-[#111827] hover:!bg-[#1f2937] !text-blue-500 !border-none !rounded-[12px] !h-[48px] !w-full !font-semibold !shadow-none !transition-colors !mt-2 !text-[14px]", // Dark blue matched from reference
                }
              }}
            />

            <div className="mt-8 text-center text-[12px] text-[#666] leading-tight flex flex-col gap-1 w-full relative z-20">
              <span>Don't have an account? <Link href="/sign-up" className="text-[#3b82f6] hover:underline font-medium">Sign up</Link></span>
              <div className="mt-2">
                By continuing, you agree to our {" "}
                <Link href="#" className="text-[#3b82f6] hover:underline">Terms of Use</Link>
                <span className="text-[#444] mx-1">&</span>
                <Link href="#" className="text-[#3b82f6] hover:underline">Privacy Policy</Link>.
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel (Image/Video) */}
        <div className="hidden md:flex w-[50%] relative bg-[#0a0a0a]">
          {/* Swirl image matching new reference */}
          <img
            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2940&auto=format&fit=crop"
            alt="Swirl Visual"
            className="w-full h-full object-cover opacity-100"
            style={{
              filter: "hue-rotate(20deg) saturate(150%) brightness(1.1)", // Tweaking to make it vibrant pink/purple/yellow
            }}
          />
          {/* Close Button top-right over image */}
          <Link href="/" className="absolute top-6 right-6 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/50 hover:text-white transition-colors backdrop-blur-md">
            <X size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
