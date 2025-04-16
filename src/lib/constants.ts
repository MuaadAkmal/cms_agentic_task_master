export const Notices = [
  {
    id: 1,
    title: "New Feature Release 🚀",
    content: "Check out our latest productivity tools 😊",
    date: "2023-07-14",
  },
  {
    id: 2,
    title: "System Maintenance 😓",
    content: "Scheduled downtime on Saturday, 10 PM - 2 AM",
    date: "2023-07-15",
  },
];


export type TEventStatus = "official" | "restricted";

export type TEventValue = {
  name: string;
  status: TEventStatus;
};

export type TEvent = {
  date: string;
  values: TEventValue[];
};

export const events: TEvent[] = [
  {
    date: "2024-11-01",
    values: [{ status: "official", name: "Rajyotsava Day (Bangalore only)" }],
  },
  {
    date: "2024-11-15",
    values: [{ status: "official", name: "Guru Nanak's Birthday" }],
  },
  {
    date: "2024-12-25",
    values: [{ status: "official", name: "Christmas 🎄" }],
  },
  {
    date: "2024-12-24",
    values: [{ status: "restricted", name: "Christmas eve" }],
  },

  // Holidays for 2025
  {
    date: "2025-01-01",
    values: [{ status: "restricted", name: "New Year's Day" }],
  },
  {
    date: "2025-01-06",
    values: [
      {
        status: "restricted",
        name: "Guru Gobind Singh's Birthday",
      },
    ],
  },
  {
    date: "2025-01-14",
    values: [
      { status: "official", name: "Pongal (Bangalore only)" },
      {
        status: "restricted",
        name: "Makar Sankranti/Magha Bihu/Pongal/Hazarat Ali's Birthday",
      },
    ],
  },
  {
    date: "2025-01-26",
    values: [{ status: "official", name: "Republic Day" }],
  },
  {
    date: "2025-02-02",
    values: [
      {
        status: "restricted",
        name: "Basant Panchami/Sri Panchami",
      },
    ],
  },
  {
    date: "2025-02-12",
    values: [
      {
        status: "restricted",
        name: "Guru Ravi Das's Birthday",
      },
    ],
  },
  {
    date: "2025-02-19",
    values: [{ status: "restricted", name: "Shivaji Jayanti" }],
  },
  {
    date: "2025-02-23",
    values: [
      {
        status: "restricted",
        name: "Birthday of Swami Dayananda Saraswati",
      },
    ],
  },

  {
    date: "2025-03-13",
    values: [{ status: "restricted", name: "Holika Dahan" }],
  },
  {
    date: "2025-03-14",
    values: [{ status: "restricted", name: "Dolyatra" }],
  },
  {
    date: "2025-03-28",
    values: [{ status: "restricted", name: "Jamat-Ul-Vida" }],
  },
  {
    date: "2025-03-30",
    values: [
      {
        status: "restricted",
        name: "Chaitra Sukladi/Gudi Padava/Ugadi/Cheti Chand",
      },
    ],
  },
  { date: "2025-03-31", values: [{ status: "official", name: "Id-ul-Fitr" }] },
  {
    date: "2025-04-06",
    values: [{ status: "restricted", name: "Ram Navmi" }],
  },
  {
    date: "2025-04-10",
    values: [{ status: "official", name: "Mahavir Jayanthi" }],
  },
  {
    date: "2025-04-13",
    values: [{ status: "restricted", name: "Vaisakhi/Vishu" }],
  },
  {
    date: "2025-04-14",
    values: [
      {
        status: "restricted",
        name: "Meshadi (Tamil New Year's Day)",
      },
    ],
  },
  {
    date: "2025-04-15",
    values: [
      {
        status: "restricted",
        name: "Vaisakhadi (Bengal)/Bahag Bihu (Assam)",
      },
    ],
  },
  { date: "2025-04-18", values: [{ status: "official", name: "Good Friday" }] },
  {
    date: "2025-04-20",
    values: [{ status: "restricted", name: "Easter Sunday" }],
  },
  {
    date: "2025-04-17",
    values: [
      {
        name: "System Maintenance",
        status: "restricted",
      },
    ],
  },
  {
    date: "2025-04-22",
    values: [
      {
        name: "Server Migration",
        status: "official",
      },
    ],
  },
  {
    date: "2025-04-25",
    values: [
      {
        name: "Staff Training Day",
        status: "official",
      },
    ],
  },
  {
    date: "2025-05-01",
    values: [
      {
        name: "Labor Day",
        status: "official",
      },
    ],
  },
  {
    date: "2025-05-09",
    values: [
      {
        status: "restricted",
        name: "Guru Rabindranath's Birthday",
      },
    ],
  },
  {
    date: "2025-05-10",
    values: [
      {
        name: "Network Upgrade",
        status: "restricted",
      },
    ],
  },
  {
    date: "2025-05-12",
    values: [{ status: "official", name: "Buddha Purnima" }],
  },
  {
    date: "2025-06-07",
    values: [{ status: "official", name: "Id-ul-Zuha (Bakrid)" }],
  },
  {
    date: "2025-06-27",
    values: [{ status: "restricted", name: "Rath Yatra" }],
  },
  { date: "2025-07-06", values: [{ status: "official", name: "Muharram" }] },
  {
    date: "2025-08-09",
    values: [{ status: "restricted", name: "Raksha Bandhan" }],
  },
  {
    date: "2025-08-15",
    values: [
      { status: "official", name: "Independence Day" },
      {
        status: "restricted",
        name: "Parsi New Year's Day/Nauraj",
      },
      { status: "restricted", name: "Janmashtami (Smarta)" },
    ],
  },
  {
    date: "2025-08-27",
    values: [
      { status: "official", name: "Ganesh Chaturthi (Bangalore only)" },
      {
        status: "restricted",
        name: "Ganesh Chaturthi/Vinayaka Chaturthi",
      },
    ],
  },
  {
    date: "2025-09-05",
    values: [
      { status: "official", name: "Prophet Mohammed's Birthday (Id E-Milad)" },
      {
        status: "restricted",
        name: "Onam or Thiru Onam Day",
      },
    ],
  },
  {
    date: "2025-09-29",
    values: [{ status: "restricted", name: "Dussehra (Saptami)" }],
  },
  {
    date: "2025-09-30",
    values: [
      {
        status: "restricted",
        name: "Dussehra (Mahashtami)",
      },
    ],
  },
  {
    date: "2025-10-01",
    values: [{ status: "restricted", name: "Dussehra (Mahanavmi)" }],
  },
  {
    date: "2025-10-02",
    values: [
      { status: "official", name: "Mahatma Gandhi's Birthday" },
      { status: "official", name: "Dussehra" },
    ],
  },
  {
    date: "2025-10-07",
    values: [
      {
        status: "restricted",
        name: "Maharishi Valmiki's Birthday",
      },
    ],
  },
  {
    date: "2025-10-10",
    values: [
      {
        status: "restricted",
        name: "Karaka Chaturthi (Karwachouth)",
      },
    ],
  },
  {
    date: "2025-10-20",
    values: [
      { status: "official", name: "Diwali (Deepavali)" },
      { status: "restricted", name: "Naraka Chaturdasi" },
    ],
  },
  {
    date: "2025-10-22",
    values: [{ status: "restricted", name: "Govardhan Puja" }],
  },
  {
    date: "2025-10-23",
    values: [{ status: "restricted", name: "Bhai Duj" }],
  },
  {
    date: "2025-10-28",
    values: [
      {
        status: "restricted",
        name: "Pratihar Shashthi or Surya Shashthi (Chhat Puja)",
      },
    ],
  },
  {
    date: "2025-11-01",
    values: [{ status: "official", name: "Rajyotsava Day (Bangalore only)" }],
  },
  {
    date: "2025-11-05",
    values: [{ status: "official", name: "Guru Nanak's Birthday" }],
  },
  {
    date: "2025-11-24",
    values: [
      {
        status: "restricted",
        name: "Guru Tegh Bahadur's Martyrdom Day",
      },
    ],
  },
  { date: "2025-12-25", values: [{ status: "official", name: "Christmas" }] },
];