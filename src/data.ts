export type Role = "parent" | "teacher";
export type View = "home" | "updates" | "calendar" | "inbox";
export type Category =
  | "General"
  | "Mathematics"
  | "English"
  | "Natural Sciences"
  | "Sport"
  | "Arts";
export type SchoolUpdate = {
  id: string;
  category: Category;
  kind: "Homework" | "Notice" | "Assessment" | "Event";
  title: string;
  body: string;
  author: string;
  date: string;
  due?: string;
  pinned?: boolean;
};
export type SchoolEvent = {
  id: string;
  title: string;
  date: string;
  category: Category;
  note: string;
};
export type Message = { id: string; from: "parent" | "teacher"; body: string; at: string };
export type Thread = { id: string; title: string; subtitle: string; messages: Message[] };
export type DemoState = {
  updates: SchoolUpdate[];
  events: SchoolEvent[];
  threads: Thread[];
  readIds: string[];
};

const offsetDate = (days: number) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
export const today = () => offsetDate(0);
export const dayLabel = (date: string, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-ZA", options ?? { day: "numeric", month: "short" }).format(
    new Date(`${date}T12:00:00`),
  );
export const categoryColors: Record<Category, string> = {
  General: "purple",
  Mathematics: "blue",
  English: "pink",
  "Natural Sciences": "mint",
  Sport: "orange",
  Arts: "yellow",
};
export const subjects: Category[] = [
  "General",
  "Mathematics",
  "English",
  "Natural Sciences",
  "Sport",
  "Arts",
];

export const initialState = (): DemoState => ({
  updates: [
    {
      id: "u1",
      category: "General",
      kind: "Notice",
      title: "A little note for our families",
      body: "Our spring learning showcase is coming up! We cannot wait to celebrate everything the class has been creating together.",
      author: "Ms. N. Dlamini",
      date: offsetDate(-1),
      pinned: true,
    },
    {
      id: "u2",
      category: "Mathematics",
      kind: "Homework",
      title: "Fractions, made simple",
      body: "Complete Activity 4 on page 28. Use drawings or objects from home to show halves, quarters and eighths.",
      author: "Ms. N. Dlamini",
      date: offsetDate(0),
      due: offsetDate(1),
    },
    {
      id: "u3",
      category: "English",
      kind: "Homework",
      title: "Our reading adventure",
      body: "Read any story for 15 minutes and write three sentences about your favourite character.",
      author: "Mr. J. Mokoena",
      date: offsetDate(0),
      due: offsetDate(2),
    },
    {
      id: "u4",
      category: "Natural Sciences",
      kind: "Assessment",
      title: "Life cycles mini-quiz",
      body: "A short class quiz on plant and butterfly life cycles. Review the diagrams in your workbook.",
      author: "Ms. N. Dlamini",
      date: offsetDate(-1),
      due: offsetDate(5),
    },
    {
      id: "u5",
      category: "Sport",
      kind: "Event",
      title: "Friday sports afternoon",
      body: "Bring your sports shoes, a water bottle and your best team spirit. Parents are welcome to cheer!",
      author: "Coach M. Pillay",
      date: offsetDate(-2),
      due: offsetDate(8),
    },
    {
      id: "u6",
      category: "Arts",
      kind: "Notice",
      title: "Something colourful is coming",
      body: "We are collecting clean cardboard, magazines and empty cereal boxes for our recycled-art activity.",
      author: "Ms. N. Dlamini",
      date: offsetDate(-3),
    },
  ],
  events: [
    {
      id: "e1",
      title: "Fractions homework due",
      category: "Mathematics",
      date: offsetDate(1),
      note: "Activity 4, page 28",
    },
    {
      id: "e2",
      title: "Reading reflection",
      category: "English",
      date: offsetDate(2),
      note: "Three sentences about your favourite character",
    },
    {
      id: "e3",
      title: "Life cycles mini-quiz",
      category: "Natural Sciences",
      date: offsetDate(5),
      note: "Review plant and butterfly life cycles",
    },
    {
      id: "e4",
      title: "Family learning showcase",
      category: "General",
      date: offsetDate(7),
      note: "Classroom exhibition — time to be confirmed",
    },
    {
      id: "e5",
      title: "Sports afternoon",
      category: "Sport",
      date: offsetDate(8),
      note: "Bring trainers and a water bottle",
    },
    {
      id: "e6",
      title: "Recycled art workshop",
      category: "Arts",
      date: offsetDate(10),
      note: "Bring clean recycled materials",
    },
  ],
  threads: [
    {
      id: "t1",
      title: "Ms. N. Dlamini",
      subtitle: "Grade 4 class teacher",
      messages: [
        {
          id: "m1",
          from: "teacher",
          body: "Good afternoon! Thando has been making wonderful progress with reading this week. Keep up the lovely bedtime stories!",
          at: offsetDate(-2),
        },
        {
          id: "m2",
          from: "parent",
          body: "Thank you so much! We have been reading together every evening.",
          at: offsetDate(-1),
        },
        {
          id: "m3",
          from: "teacher",
          body: "It shows! Please feel free to message me if there is anything you need.",
          at: offsetDate(0),
        },
      ],
    },
    {
      id: "t2",
      title: "School office",
      subtitle: "General enquiries",
      messages: [
        {
          id: "m4",
          from: "teacher",
          body: "A friendly reminder: please send any updated emergency contact details to the school office directly.",
          at: offsetDate(-3),
        },
      ],
    },
    {
      id: "t3",
      title: "Coach M. Pillay",
      subtitle: "Sports activities",
      messages: [
        {
          id: "m5",
          from: "teacher",
          body: "We are looking forward to our sports afternoon! Let me know if you have questions about the kit.",
          at: offsetDate(-2),
        },
      ],
    },
  ],
  readIds: [],
});
const KEY = "edx-fictional-demo-v1";
export function loadState(): DemoState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState();
    const stored: unknown = JSON.parse(raw);
    if (!stored || typeof stored !== "object") return initialState();
    const x = stored as Partial<DemoState>;
    if (
      !Array.isArray(x.updates) ||
      !Array.isArray(x.events) ||
      !Array.isArray(x.threads) ||
      !Array.isArray(x.readIds)
    )
      return initialState();
    return x as DemoState;
  } catch {
    return initialState();
  }
}
export function saveState(state: DemoState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* demo remains in memory */
  }
}
export function resetState() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* optional storage */
  }
}
export function unreadCount(state: DemoState) {
  return state.updates.filter((update) => !state.readIds.includes(update.id)).length;
}
export function eventsForDate(events: SchoolEvent[], date: string) {
  return events.filter((event) => event.date === date);
}
