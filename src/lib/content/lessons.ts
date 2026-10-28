import type { Lesson } from "@/lib/types";

export const LESSONS: Lesson[] = [
  {
    id: "l1",
    module_id: "m1",
    module_slug: "anapana",
    slug: "breath-basics",
    title_mm: "ထွက်သက်ဝင်သက်",
    title_en: "Breath Basics",
    content: `## အာနာပါန အခြေခံ

ထိုင်ရာတွင် ကျောရိုးကို တည့်မတ်စွာ ထားပါ။ နှာခေါင်းဖျားတွင် လေထွက်လေဝင်ကို သတိပြုပါ။

1. ဝင်သက်ကို သိ
2. ထွက်သက်ကို သိ
3. စိတ်လွင့်သွားလျှင် ပြန်ယူလာပါ

နေ့စဉ် ၅–၁၀ မိနစ် စတင်ပါ။`,
    duration_mins: 8,
    order_index: 1,
  },
  {
    id: "l2",
    module_id: "m1",
    module_slug: "anapana",
    slug: "counting-breath",
    title_mm: "ရေတွက်ခြင်း",
    title_en: "Counting Breath",
    content: `## ရေတွက်နည်း

ဝင်သက်–ထွက်သက် တစ်စုံကို ၁ ဟု ရေတွက်ပါ။ ၁ မှ ၁၀ အထိ ရောက်လျှင် ၁ သို့ ပြန်စပါ။

ရေတွက်မှားလျှင် ပြန်စပါ—ဒေါသမထားဘဲ ပြန်စတင်ခြင်းသည် လေ့ကျင့်မှု ဖြစ်သည်။`,
    duration_mins: 10,
    order_index: 2,
  },
  {
    id: "l3",
    module_id: "m2",
    module_slug: "kaya",
    slug: "posture-awareness",
    title_mm: "ကိုယ်အနေအထား",
    title_en: "Posture Awareness",
    content: `## ကာယာနုပဿနာ

ထိုင်၊ ရပ်၊ လမ်းလျှောက်၊ လဲလျောင်း—ကိုယ်အနေအထားကို သိအောင် ရှုပါ။

“ထိုင်နေသည်”, “လမ်းလျှောက်နေသည်” ဟု စိတ်ထဲတွင် တိတိကျကျ သိပါ။`,
    duration_mins: 12,
    order_index: 1,
  },
  {
    id: "l4",
    module_id: "m3",
    module_slug: "vedana",
    slug: "feeling-tone",
    title_mm: "ခံစားမှုအရသာ",
    title_en: "Feeling Tone",
    content: `## ဝေဒနာ

သုခ၊ ဒုက္ခ၊ ဥပေက္ခာ—ခံစားမှု သုံးမျိုးကို စောင့်ကြည့်ပါ။

မဖမ်းမဆုပ်။ ပေါ်လာသည်ကို မြင်၊ ပျောက်သွားသည်ကို မြင်။`,
    duration_mins: 15,
    order_index: 1,
  },
  {
    id: "l5",
    module_id: "m4",
    module_slug: "abhidhamma-intro",
    slug: "citta-overview",
    title_mm: "စိတ် အကျဉ်း",
    title_en: "Citta Overview",
    content: `## စိတ် (Citta)

အဘိဓမ္မာတွင် စိတ်သည် အာရုံကို သိသော သဘောဖြစ်သည်။ စေတသိက်များနှင့် အတူတကွ ဖြစ်ပေါ်သည်။

ယနေ့ — “သိခြင်း” ကို သတိပြုပါ။`,
    duration_mins: 10,
    order_index: 1,
  },
  {
    id: "l6",
    module_id: "m5",
    module_slug: "pali-basics",
    slug: "greetings",
    title_mm: "နှုတ်ဆက်စကား",
    title_en: "Greetings",
    content: `## ပါဠိ စကားလုံး

- **Namo** — ရှိခိုးပါ၏
- **Buddho** — ဘုရား
- **Dhammo** — တရား
- **Sangho** — သံဃာ

“Namo tassa bhagavato arahato sammāsambuddhassa” ကို ဖြည်းဖြည်း ရွတ်ဆို ကြည့်ပါ။`,
    duration_mins: 8,
    order_index: 1,
  },
];
