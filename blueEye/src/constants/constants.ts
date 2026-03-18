import type { ActivityItem, UserCard, UserRoleTab } from "../types/types";

export const activityItems: ActivityItem[] = [
  {
    id: 1,
    title: "Jane Studio answered the form",
    highlight: "Graphic Design Brief",
    date: "Feb 8, 2024 7:15 PM",
  },
  {
    id: 2,
    title: "jsmith.mobbin@gmail.com answered the form",
    highlight: "Graphic Design Brief",
    date: "Feb 8, 2024 7:14 PM",
  },
  {
    id: 3,
    title: "Joe Studio sent the form Graphic Design Brief to",
    highlight: "Jane Studio.",
    date: "Feb 8, 2024 7:11 PM",
  },
  {
    id: 4,
    title: "Joe Doe sent the contract to",
    highlight: "janesmith1.mobbin@gmail.com.",
    date: "Feb 8, 2024 6:53 PM",
  },
  {
    id: 5,
    title: "Joe Doe created a contract for",
    highlight: "Doe Company.",
    date: "Feb 8, 2024 6:51 PM",
  },
  {
    id: 6,
    title: "Joe Studio sent a proposal to",
    highlight: "jsmith.mobbin@gmail.com.",
    date: "Feb 8, 2024 6:44 PM",
  },
];

export const clientsData: UserCard[] = [
  {
    id: 1,
    name: "Mariana Cruz",
    email: "mariana.cruz@novatek.com",
    phone: "+1 (809) 555-1212",
    company: "NovaTek",
    city: "Santo Domingo",
    image: "https://i.pravatar.cc/180?img=5",
  },
  {
    id: 2,
    name: "Ricardo Gomez",
    email: "ricardo.gomez@alfaindustrial.com",
    phone: "+1 (809) 555-8891",
    company: "Alfa Industrial",
    city: "Santiago",
    image: "https://i.pravatar.cc/180?img=12",
  },
  {
    id: 3,
    name: "Jenny Peralta",
    email: "j.peralta@grupopolaris.com",
    phone: "+1 (829) 555-3321",
    company: "Grupo Polaris",
    city: "La Romana",
    image: "https://i.pravatar.cc/180?img=32",
  },
  {
    id: 4,
    name: "Alan Rivera",
    email: "alan.rivera@blueshore.co",
    phone: "+1 (849) 555-9911",
    company: "BlueShore",
    city: "Punta Cana",
    image: "https://i.pravatar.cc/180?img=15",
  },
];

export const techsData: UserCard[] = [
  {
    id: 11,
    name: "Luis Santana",
    email: "l.santana@blueeye.com",
    phone: "+1 (829) 555-0199",
    company: "BlueEye Security",
    city: "Santo Domingo",
    image: "https://i.pravatar.cc/180?img=68",
  },
  {
    id: 12,
    name: "Keila Martinez",
    email: "k.martinez@blueeye.com",
    phone: "+1 (829) 555-7462",
    company: "BlueEye Security",
    city: "Santiago",
    image: "https://i.pravatar.cc/180?img=45",
  },
  {
    id: 13,
    name: "Jose Batista",
    email: "j.batista@blueeye.com",
    phone: "+1 (849) 555-7710",
    company: "BlueEye Security",
    city: "San Pedro",
    image: "https://i.pravatar.cc/180?img=63",
  },
  {
    id: 14,
    name: "Miguel Nunez",
    email: "m.nunez@blueeye.com",
    phone: "+1 (809) 555-4577",
    company: "BlueEye Security",
    city: "Bavaro",
    image: "https://i.pravatar.cc/180?img=52",
  },
];

export const usersFallback: Record<UserRoleTab, UserCard[]> = {
  clientes: [
    {
      id: 1,
      name: "Mariana Cruz",
      email: "mariana.cruz@novatek.com",
      phone: "+1 (809) 555-1212",
      company: "NovaTek",
      city: "Santo Domingo",
      image: "https://i.pravatar.cc/320?img=5",
    },
    {
      id: 2,
      name: "Ricardo Gomez",
      email: "ricardo.gomez@alfaindustrial.com",
      phone: "+1 (809) 555-8891",
      company: "Alfa Industrial",
      city: "Santiago",
      image: "https://i.pravatar.cc/320?img=12",
    },
  ],
  tecnicos: [
    {
      id: 11,
      name: "Luis Santana",
      email: "l.santana@blueeye.com",
      phone: "+1 (829) 555-0199",
      company: "BlueEye Security",
      city: "Santo Domingo",
      image: "https://i.pravatar.cc/320?img=68",
    },
    {
      id: 12,
      name: "Keila Martinez",
      email: "k.martinez@blueeye.com",
      phone: "+1 (829) 555-7462",
      company: "BlueEye Security",
      city: "Santiago",
      image: "https://i.pravatar.cc/320?img=45",
    },
  ],
};
