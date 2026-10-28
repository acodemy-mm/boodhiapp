"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BodhiTree } from "@/components/brand/bodhi-tree";
import { Surface } from "@/components/ui/gamification-ui";
import { useAppStore } from "@/lib/store";

export default function LandingPage() {
  const { profile, ready } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (profile?.onboarding_complete) router.replace("/home");
    else if (profile) router.replace("/onboarding");
  }, [ready, profile, router]);

  return (
    <section className="gamify-page min-h-[80dvh] content-center text-center animate-grow-in">
      <p className="gamify-kicker">BODHI PATH</p>
      <h1 className="font-display text-5xl text-accent-merit-soft md:text-6xl">
        ဗောဓိလမ်း
      </h1>
      <p className="mx-auto max-w-md text-sm leading-7 text-text-secondary">
        ဝိပဿနာ၊ အဘိဓမ္မာနှင့် နေ့စဉ် လေ့ကျင့်မှုကို ကုသိုလ်အမှတ်နှင့်
        ဗောဓိပင်ကြီးထွားမှုဖြင့် ပေါင်းစပ်ထားသော လမ်းကြောင်း။
      </p>
      <Surface strong className="mx-auto w-full max-w-sm p-4">
        <BodhiTree stage={0} merit={0} />
      </Surface>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/auth"
          className="gamify-button gamify-button--primary"
        >
          စတင်ရန် · Begin
        </Link>
      </div>
    </section>
  );
}
