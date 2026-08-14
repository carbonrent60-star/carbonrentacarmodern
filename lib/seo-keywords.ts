const coreServices = [
  "avtomobil icarəsi",
  "maşın icarəsi",
  "rent a car",
  "car rental",
  "avto kirayə",
  "kirayə avtomobil",
  "gündəlik avtomobil icarəsi",
  "uzunmüddətli avtomobil icarəsi",
  "sürücüsüz avtomobil icarəsi",
  "premium avtomobil icarəsi",
  "lüks avtomobil icarəsi",
  "biznes avtomobil icarəsi",
  "ekonom avtomobil icarəsi",
  "SUV icarəsi",
  "miniven icarəsi",
  "sport avtomobil icarəsi",
  "toy avtomobili",
  "toy avtomobilləri",
  "transfer xidməti",
  "hava limanı transferi",
  "şəhər transferi",
  "şəxsi sürücü xidməti",
  "korporativ avtomobil icarəsi",
  "ailə üçün avtomobil icarəsi",
  "turistlər üçün avtomobil icarəsi",
  "rahat avtomobil icarəsi",
  "etibarlı avtomobil icarəsi",
  "online avtomobil rezervasiyası",
  "avtomobil bron etmək",
];

const locations = [
  "Bakı",
  "Azerbaycan",
  "Azərbaycan",
  "Heydər Əliyev Hava Limanı",
  "Bakı hava limanı",
  "Sea Breeze",
  "Bilgəh",
  "Nardaran",
  "Mərdəkan",
  "Buzovna",
  "Şüvəlan",
  "Qəbələ",
  "Quba",
  "Şamaxı",
  "Şəki",
  "Şuşa",
  "Lənkəran",
  "İsmayıllı",
  "Gəncə",
  "Sumqayıt",
  "Xırdalan",
  "Abşeron",
  "Azərbaycan regionları",
  "Baku",
  "Azerbaijan",
  "Baku airport",
  "Baku city",
  "Gabala",
  "Quba Azerbaijan",
  "Shamakhi",
  "Shaki",
  "Shusha",
  "Lankaran",
];

const carBrands = [
  "Mercedes",
  "Mercedes-Benz",
  "BMW",
  "Range Rover",
  "Land Rover",
  "Toyota",
  "Hyundai",
  "Kia",
  "Ford",
  "Mustang",
  "Jaguar",
  "Lexus",
  "Nissan",
  "Chevrolet",
  "Volkswagen",
  "Audi",
  "Porsche",
  "Cadillac",
  "G Class",
  "S Class",
  "Maybach",
  "E Class",
  "V Class",
  "Camry",
  "Prado",
  "Sonata",
  "Elantra",
  "Tucson",
  "Vogue",
];

const qualifiers = [
  "qiymət",
  "qiymətləri",
  "rezervasiya",
  "bron",
  "ucuz",
  "premium",
  "lüks",
  "rahat",
  "etibarlı",
  "sərfəli",
  "yeni",
  "təmiz",
  "sığortalı",
  "depozit",
  "gündəlik",
  "həftəlik",
  "aylıq",
  "24 saat",
  "online",
  "tez",
  "şəffaf",
  "müştəri dəstəyi",
  "ailə üçün",
  "biznes üçün",
  "turistlər üçün",
  "şəhər daxili",
  "hava limanı",
  "xüsusi gün",
  "nişan",
  "fotosessiya",
];

const englishKeywords = [
  "rent a car baku",
  "car rental baku",
  "baku car rental",
  "azerbaijan car rental",
  "baku airport transfer",
  "baku airport car rental",
  "luxury car rental baku",
  "premium car rental baku",
  "wedding car rental baku",
  "SUV rental baku",
  "business car rental baku",
  "daily car rental baku",
  "monthly car rental baku",
  "self drive car rental baku",
  "Carbon Rent A Car",
];

function unique(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

const serviceLocationKeywords = coreServices.flatMap((service) =>
  locations.map((location) => `${service} ${location}`)
);

const brandServiceKeywords = carBrands.flatMap((brand) =>
  coreServices.slice(0, 18).map((service) => `${brand} ${service}`)
);

const qualifiedServiceKeywords = coreServices.flatMap((service) =>
  qualifiers.map((qualifier) => `${service} ${qualifier}`)
);

const locationQualifiedKeywords = locations.flatMap((location) =>
  qualifiers.map((qualifier) => `${location} avtomobil icarəsi ${qualifier}`)
);

const brandLocationKeywords = carBrands.flatMap((brand) =>
  locations.map((location) => `${brand} icarəsi ${location}`)
);

export const allSeoKeywords = unique([
  "Carbon Rent A Car",
  "Carbon rental",
  "Carbon avtomobil icarəsi",
  ...coreServices,
  ...locations,
  ...carBrands,
  ...qualifiers,
  ...englishKeywords,
  ...serviceLocationKeywords,
  ...brandServiceKeywords,
  ...qualifiedServiceKeywords,
  ...locationQualifiedKeywords,
  ...brandLocationKeywords,
]);

export const primarySeoKeywords = allSeoKeywords.slice(0, 120);

export function getSeoKeywords(...groups: Array<Array<string | null | undefined> | undefined>) {
  return unique([
    ...primarySeoKeywords,
    ...groups.flatMap((group) => group ?? []).filter(Boolean),
  ] as string[]);
}
