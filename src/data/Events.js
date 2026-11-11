// Upcoming readings & signings. Dates must be "YYYY-MM-DD".
export const EVENTS = [
  {
    id: "translation-evening",
    date: "2026-11-05",
    time: "6:30 PM BST",
    category: "Author reading & conversation",
    title: "An Evening of Translation with Andrew Hurley",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    link: "/events/translation-evening",
  },
  {
    id: "autumn-verse",
    date: "2026-11-19",
    time: "7:00 PM BST",
    category: "Poetry & live music",
    title: "Autumn Verse: Selected Readings from Rainer Maria Rilke",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    link: "/events/autumn-verse",
  },
  {
    id: "publishers-panel",
    date: "2026-12-03",
    time: "6:00 PM BST",
    category: "Industry panel discussion",
    title: "Independent Publishers Council Panel Curation",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    link: "/events/publishers-panel",
  },
];

// Upcoming events only, soonest first.
export const getUpcomingEvents = (limit = 3) => {
  const today = new Date().toISOString().slice(0, 10);
  return [...EVENTS]
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
};