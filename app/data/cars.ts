export type Car = {
  id: number;
  slug: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  transmission: string;
  fuel: string;
  seats: number;
  price: number;
  image: string;
  featured?: boolean;
};

export const cars: Car[] = [
  {
    id: 1,
    slug: "bmw-520i",
    brand: "BMW",
    model: "520i",
    year: 2021,
    category: "Biznes",
    transmission: "Avtomat",
    fuel: "Benzin",
    seats: 5,
    price: 120,
    image: "/cars/bmw-520i.jpg",
    featured: true,
  },
  {
    id: 2,
    slug: "mercedes-e-class",
    brand: "Mercedes-Benz",
    model: "E-Class",
    year: 2022,
    category: "Biznes",
    transmission: "Avtomat",
    fuel: "Benzin",
    seats: 5,
    price: 140,
    image: "/cars/mercedes-e-class.jpg",
    featured: true,
  },
  {
    id: 3,
    slug: "range-rover-vogue",
    brand: "Land Rover",
    model: "Range Rover",
    year: 2022,
    category: "SUV",
    transmission: "Avtomat",
    fuel: "Benzin",
    seats: 5,
    price: 250,
    image: "/cars/range-rover.jpg",
    featured: true,
  },
];
