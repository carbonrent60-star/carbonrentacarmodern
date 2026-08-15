import type { Car, CarCategory } from "@/data/cars";
import { carStartingPrice, carSpecsDescription } from "@/lib/seo";

export type ConciergeServiceType =
  | "rental"
  | "transfer"
  | "wedding"
  | "rental_transfer"
  | "unknown";

export type ConciergeIntent = {
  serviceType: ConciergeServiceType;
  passengers?: number;
  luggage?: number;
  pickupLocation?: string;
  destination?: string;
  rentalDays?: number;
  budget?: {
    amount?: number;
    type?: "daily" | "total";
  };
  preferredCategory?: CarCategory | string;
  preferredBrand?: string;
  occasion?: "business" | "family" | "tourism" | "wedding" | "general";
  priorities?: Array<
    | "price"
    | "comfort"
    | "luxury"
    | "space"
    | "fuel_economy"
    | "appearance"
  >;
  needsDriver?: boolean;
  wedding?: boolean;
  confidence: number;
  missingImportantInformation: string[];
};

export type ConciergeResult = {
  car: Car;
  score: number;
  level: "Əla uyğunluq" | "Çox uyğun" | "Uyğun";
  reasons: string[];
  warnings: string[];
  price: number | null;
  priceLabel: string;
  detailHref: string;
  bookingHref: string;
  ai?: {
    verdict: string;
    bestFor: string;
    mainAdvantage: string;
    tradeOff: string;
    budgetFit: string;
    spaceFit: string;
    tripFit: string;
    comparisonNote: string;
  };
};

export type ConciergeResponse = {
  intent: ConciergeIntent;
  summary: string;
  headline: string;
  results: ConciergeResult[];
  alternatives: ConciergeResult[];
  transferSuggestion?: {
    label: string;
    description: string;
    price: number | null;
  };
  question?: {
    id: string;
    text: string;
    options: Array<{ label: string; value: string; patch: Partial<ConciergeIntent> }>;
  };
  noGoodMatch?: string;
};

const defaultIntent: ConciergeIntent = {
  serviceType: "unknown",
  confidence: 0.35,
  missingImportantInformation: [],
  priorities: [],
};

const transferLabels: Record<keyof Car["transferPrices"], string> = {
  baku: "Hava limanı - Bakı",
  seaBreeze: "Sea Breeze - Hava limanı",
  qabala: "Qəbələ - Bakı",
  ismayilli: "İsmayıllı - Bakı",
  quba: "Quba - Bakı",
  shamaxi: "Şamaxı - Bakı",
  shaki: "Şəki - Bakı",
  shusha: "Şuşa - Bakı",
  lankaran: "Lənkəran - Bakı",
};

type OpenAIResponseItem = {
  type?: string;
  content?: OpenAIResponseContent[];
};

type OpenAIResponseContent = {
  type?: string;
  text?: string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g");
}

function numberNear(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const number = Number(match[1]);
      if (Number.isFinite(number)) return number;
    }
  }

  return undefined;
}

function detectBrand(raw: string, cars: Car[]) {
  const text = normalize(raw);
  const brands = Array.from(new Set(cars.map((car) => car.brand)));

  return brands.find((brand) => text.includes(normalize(brand)));
}

function detectCategory(raw: string): CarCategory | undefined {
  const text = normalize(raw);

  if (text.includes("suv") || text.includes("cip") || text.includes("jeep")) return "SUV";
  if (text.includes("biznes") || text.includes("business")) return "Business";
  if (text.includes("ekonom") || text.includes("ucuz") || text.includes("serfeli")) return "Econom";
  if (text.includes("sport")) return "Sport";
  if (text.includes("miniven") || text.includes("van")) return "Miniven";
  if (text.includes("komfort") || text.includes("comfort")) return "Comfort";

  return undefined;
}

function detectPriorities(raw: string): ConciergeIntent["priorities"] {
  const text = normalize(raw);
  const priorities = new Set<NonNullable<ConciergeIntent["priorities"]>[number]>();

  if (/(ucuz|serfeli|budce|qiymet|bahali olmasin)/.test(text)) priorities.add("price");
  if (/(rahat|komfort|comfortable)/.test(text)) priorities.add("comfort");
  if (/(premium|luks|lux|maybach|s class|g class|vip)/.test(text)) priorities.add("luxury");
  if (/(boyuk|genis|baqaj|canta|ail[eə])/.test(text)) priorities.add("space");
  if (/(yanacaq|ekonom|qenaet)/.test(text)) priorities.add("fuel_economy");
  if (/(toy|ag|fotosessiya|gorunus|klassik)/.test(text)) priorities.add("appearance");

  return Array.from(priorities);
}

function detectServiceType(raw: string): ConciergeServiceType {
  const text = normalize(raw);
  const wedding = /(toy|nisan|gelin|wedding|fotosessiya)/.test(text);
  const transfer = /(transfer|hava limani|airport|sea breeze|surmek istemirem|surucu ile|sofer)/.test(text);
  const rental = /(gun|hefte|ayliq|icare|kiraye|qalacag|sefer|qebele|quba|samaxi|rayon)/.test(text);

  if (wedding) return "wedding";
  if (transfer && rental) return "rental_transfer";
  if (transfer) return "transfer";
  if (rental) return "rental";

  return "unknown";
}

export function mergeIntent(current: ConciergeIntent | undefined, patch: Partial<ConciergeIntent>) {
  return {
    ...defaultIntent,
    ...current,
    ...patch,
    budget: {
      ...current?.budget,
      ...patch.budget,
    },
    priorities: Array.from(
      new Set([...(current?.priorities ?? []), ...(patch.priorities ?? [])])
    ),
    missingImportantInformation: patch.missingImportantInformation ?? [],
    confidence: patch.confidence ?? current?.confidence ?? defaultIntent.confidence,
  } satisfies ConciergeIntent;
}

export function parseIntentLocally(message: string, cars: Car[], current?: ConciergeIntent) {
  const raw = message.trim();
  const text = normalize(raw);
  const serviceType = detectServiceType(raw);
  const passengers = numberNear(text, [
    /(\d+)\s*(nefer|n[eə]f[eə]r|adam|sernisin|s[eə]rni[sş]in)/,
    /(\d+)\s*(kisi|qonaq)/,
  ]);
  const rentalDays = numberNear(text, [
    /(\d+)\s*(gun|g[uü]n|day)/,
    /(\d+)\s*(gece|gecə)/,
  ]);
  const budgetAmount = numberNear(text, [
    /(?:max|maksimum|qeder|kimi|altinda|asagi)\s*(\d+)/,
    /(\d+)\s*(manat|azn|₼)/,
  ]);
  const luggage = /boyuk baqaj|cox baqaj|böyük baqaj|canta|çamadan/.test(raw.toLowerCase())
    ? 3
    : numberNear(text, [/(\d+)\s*(baqaj|canta|camadan)/]);
  const destination = [
    "Sea Breeze",
    "Qəbələ",
    "Quba",
    "Şamaxı",
    "Şəki",
    "Şuşa",
    "Lənkəran",
    "İsmayıllı",
    "Bakı",
  ].find((place) => text.includes(normalize(place)));
  const priorities = detectPriorities(raw);
  const preferredBrand = detectBrand(raw, cars);
  const preferredCategory = detectCategory(raw);

  return mergeIntent(current, {
    serviceType: serviceType === "unknown" ? current?.serviceType ?? "unknown" : serviceType,
    passengers: passengers ?? current?.passengers,
    luggage: luggage ?? current?.luggage,
    rentalDays: rentalDays ?? current?.rentalDays,
    budget: budgetAmount
      ? {
          amount: budgetAmount,
          type: /umumi|total|cəmi|cemi/.test(text) ? "total" : "daily",
        }
      : current?.budget,
    preferredBrand: preferredBrand ?? current?.preferredBrand,
    preferredCategory: preferredCategory ?? current?.preferredCategory,
    destination: destination ?? current?.destination,
    needsDriver: /(surmek istemirem|sürücü|surucu|sofer|şofer)/.test(text)
      ? true
      : current?.needsDriver,
    wedding: serviceType === "wedding" || current?.wedding,
    occasion:
      serviceType === "wedding"
        ? "wedding"
        : /ail[eə]/.test(text)
          ? "family"
          : /biznes|gorus|iş|is/.test(text)
            ? "business"
            : /tur|seyahet|səyahət/.test(text)
              ? "tourism"
              : current?.occasion ?? "general",
    priorities,
    confidence: raw.length > 12 ? 0.72 : 0.48,
  });
}

export async function parseIntentWithOpenAI(message: string, cars: Car[], current?: ConciergeIntent) {
  const fallback = parseIntentLocally(message, cars, current);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || !message.trim()) {
    return fallback;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_CONCIERGE_MODEL ?? "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "You convert Azerbaijani/English/Russian car rental customer text into strict JSON requirements. Never recommend cars. Never invent inventory. Return JSON only.",
          },
          {
            role: "user",
            content: JSON.stringify({
              message,
              current,
              availableBrands: Array.from(new Set(cars.map((car) => car.brand))),
              categories: Array.from(new Set(cars.map((car) => car.category))),
            }),
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "concierge_intent",
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                serviceType: { enum: ["rental", "transfer", "wedding", "rental_transfer", "unknown"] },
                passengers: { type: ["number", "null"] },
                luggage: { type: ["number", "null"] },
                pickupLocation: { type: ["string", "null"] },
                destination: { type: ["string", "null"] },
                rentalDays: { type: ["number", "null"] },
                budget: {
                  type: ["object", "null"],
                  additionalProperties: false,
                  properties: {
                    amount: { type: ["number", "null"] },
                    type: { enum: ["daily", "total", null] },
                  },
                  required: ["amount", "type"],
                },
                preferredCategory: { type: ["string", "null"] },
                preferredBrand: { type: ["string", "null"] },
                occasion: { enum: ["business", "family", "tourism", "wedding", "general", null] },
                priorities: {
                  type: "array",
                  items: { enum: ["price", "comfort", "luxury", "space", "fuel_economy", "appearance"] },
                },
                needsDriver: { type: ["boolean", "null"] },
                wedding: { type: ["boolean", "null"] },
                confidence: { type: "number" },
                missingImportantInformation: { type: "array", items: { type: "string" } },
              },
              required: [
                "serviceType",
                "passengers",
                "luggage",
                "pickupLocation",
                "destination",
                "rentalDays",
                "budget",
                "preferredCategory",
                "preferredBrand",
                "occasion",
                "priorities",
                "needsDriver",
                "wedding",
                "confidence",
                "missingImportantInformation",
              ],
            },
          },
        },
      }),
    });

    if (!response.ok) return fallback;

    const payload = await response.json();
    const output = payload.output_text ?? payload.output?.[0]?.content?.[0]?.text;
    const parsed = output ? JSON.parse(output) : null;

    if (!parsed || typeof parsed !== "object") return fallback;

    return mergeIntent(fallback, {
      ...parsed,
      passengers: parsed.passengers ?? fallback.passengers,
      luggage: parsed.luggage ?? fallback.luggage,
      rentalDays: parsed.rentalDays ?? fallback.rentalDays,
      budget: parsed.budget ?? fallback.budget,
      priorities: parsed.priorities?.length ? parsed.priorities : fallback.priorities,
    });
  } catch {
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}

function routeKeyForDestination(destination?: string) {
  const value = normalize(destination ?? "");

  if (value.includes("sea breeze")) return "seaBreeze";
  if (value.includes("qebele") || value.includes("gabala")) return "qabala";
  if (value.includes("ismayilli")) return "ismayilli";
  if (value.includes("quba")) return "quba";
  if (value.includes("samaxi")) return "shamaxi";
  if (value.includes("seki") || value.includes("shaki")) return "shaki";
  if (value.includes("susa") || value.includes("shusha")) return "shusha";
  if (value.includes("lenkeran") || value.includes("lankaran")) return "lankaran";

  return "baku";
}

function categoryRank(category: CarCategory) {
  return {
    Econom: 1,
    Comfort: 2,
    Business: 3,
    SUV: 4,
    Miniven: 4,
    Sport: 5,
  }[category];
}

function dailyBudget(intent: ConciergeIntent) {
  const amount = intent.budget?.amount;
  if (!amount) return null;

  return intent.budget?.type === "total" && intent.rentalDays
    ? Math.round(amount / intent.rentalDays)
    : amount;
}

function level(score: number): ConciergeResult["level"] {
  if (score >= 90) return "Əla uyğunluq";
  if (score >= 75) return "Çox uyğun";
  return "Uyğun";
}

function detailHref(car: Car, intent: ConciergeIntent) {
  if (intent.serviceType === "wedding") return `/toy-avtomobilleri/${car.slug}`;
  if (intent.serviceType === "transfer") return `/transfer/${car.slug}`;
  return `/avtomobiller/${car.slug}`;
}

function priceFor(car: Car, intent: ConciergeIntent) {
  if (intent.serviceType === "wedding") {
    return {
      price: car.weddingPrice ?? null,
      label: car.weddingPrice ? `${car.weddingPrice} ₼` : "Qiymət üçün əlaqə",
    };
  }

  if (intent.serviceType === "transfer") {
    const key = routeKeyForDestination(intent.destination) as keyof Car["transferPrices"];
    const price = car.transferPrices[key] ?? null;

    return {
      price,
      label: price ? `${price} ₼ · ${transferLabels[key]}` : "Transfer qiyməti üçün əlaqə",
    };
  }

  const price = carStartingPrice(car);

  return {
    price,
    label: price ? `${price} ₼ / gün` : "Qiymət üçün əlaqə",
  };
}

export function rankCars(cars: Car[], intent: ConciergeIntent): ConciergeResult[] {
  const budget = dailyBudget(intent);
  const serviceType = intent.serviceType === "unknown" ? "rental" : intent.serviceType;
  const candidates = cars.filter((car) => {
    if (serviceType === "wedding") return car.weddingAvailable;
    if (serviceType === "transfer") return car.transferAvailable;
    return car.rentalVisible !== false;
  });

  return candidates
    .map((car) => {
      const reasons: string[] = [];
      const warnings: string[] = [];
      let score = 25;

      if (intent.passengers) {
        if (car.seats && car.seats >= intent.passengers) {
          score += 25;
          reasons.push(`${intent.passengers} sərnişin üçün oturacaq sayı uyğundur.`);
        } else {
          score -= 80;
          warnings.push(`${intent.passengers} sərnişin üçün oturacaq sayı kifayət etmir.`);
        }
      }

      const price = priceFor(car, { ...intent, serviceType });
      if (budget && price.price) {
        if (price.price <= budget) {
          score += 20;
          reasons.push(`Qiymət büdcənizə uyğundur (${price.label}).`);
        } else {
          score -= Math.min(30, Math.round(((price.price - budget) / budget) * 25));
          warnings.push(`Qiymət büdcədən yüksək ola bilər (${price.label}).`);
        }
      } else if (price.price) {
        score += 8;
        reasons.push(`Başlanğıc qiymət aydındır: ${price.label}.`);
      }

      score += 20;
      reasons.push("Seçilən xidmət növü üçün real inventarda aktivdir.");

      if (intent.luggage) {
        const capacity = (car.baggage ?? 0) + (car.smallBaggage ?? 0) * 0.5;
        if (capacity >= intent.luggage) {
          score += 10;
          reasons.push("Baqaj ehtiyacınız üçün daha praktik seçimdir.");
        } else {
          score -= 18;
          warnings.push("Baqaj tutumu istədiyiniz qədər geniş olmaya bilər.");
        }
      }

      if (intent.preferredCategory) {
        if (normalize(car.category) === normalize(String(intent.preferredCategory))) {
          score += 10;
          reasons.push(`${car.category} kateqoriyası istəyinizə uyğundur.`);
        } else if (intent.preferredCategory === "SUV" && ["Miniven", "Business"].includes(car.category)) {
          score += 3;
        }
      }

      if (intent.preferredBrand) {
        if (normalize(car.brand).includes(normalize(intent.preferredBrand))) {
          score += 9;
          reasons.push(`${car.brand} brend istəyinizə uyğundur.`);
        } else {
          score -= 3;
        }
      }

      if (intent.priorities?.includes("space") && ["SUV", "Miniven"].includes(car.category)) {
        score += 8;
        reasons.push("Geniş salon və uzun səfər üçün daha uyğundur.");
      }

      if (intent.priorities?.includes("luxury") && categoryRank(car.category) >= 3) {
        score += 8;
        reasons.push("Premium görünüş və komfort prioritetinə uyğundur.");
      }

      if (intent.priorities?.includes("price") && car.category === "Econom") {
        score += 7;
        reasons.push("Qiymət həssas seçim üçün sərfəli kateqoriyadadır.");
      }

      if (intent.priorities?.includes("appearance") && (car.weddingAvailable || ["Sport", "Business"].includes(car.category))) {
        score += 6;
        reasons.push("Görünüş və xüsusi gün üçün daha uyğun vizual təsir yaradır.");
      }

      if (intent.destination && ["SUV", "Miniven", "Business"].includes(car.category)) {
        score += 5;
        reasons.push(`${intent.destination} istiqaməti üçün praktik və rahat seçimdir.`);
      }

      const boundedScore = Math.max(0, Math.min(100, score));

      return {
        car,
        score: boundedScore,
        level: level(boundedScore),
        reasons: reasons.slice(0, 5),
        warnings,
        price: price.price,
        priceLabel: price.label,
        detailHref: detailHref(car, { ...intent, serviceType }),
        bookingHref: `/rezervasiya?car=${encodeURIComponent(car.slug)}`,
      };
    })
    .filter((result) => result.score >= 50 || result.warnings.length === 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

export function nextQuestion(intent: ConciergeIntent): ConciergeResponse["question"] {
  const serviceType = intent.serviceType === "unknown" ? undefined : intent.serviceType;

  if (!serviceType) {
    return {
      id: "serviceType",
      text: "Sizə hansı xidmət daha uyğundur?",
      options: [
        { label: "Avtomobil icarəsi", value: "rental", patch: { serviceType: "rental" } },
        { label: "Transfer", value: "transfer", patch: { serviceType: "transfer", needsDriver: true } },
        { label: "Toy avtomobili", value: "wedding", patch: { serviceType: "wedding", wedding: true } },
      ],
    };
  }

  if (serviceType === "rental" && !intent.passengers) {
    return {
      id: "passengers",
      text: "Neçə nəfər olacaqsınız?",
      options: [
        { label: "1-2", value: "2", patch: { passengers: 2 } },
        { label: "3-4", value: "4", patch: { passengers: 4 } },
        { label: "5", value: "5", patch: { passengers: 5 } },
        { label: "6+", value: "6", patch: { passengers: 6, preferredCategory: "Miniven" } },
      ],
    };
  }

  if (serviceType === "rental" && !intent.rentalDays) {
    return {
      id: "rentalDays",
      text: "Təxminən neçə gün istifadə edəcəksiniz?",
      options: [
        { label: "1-3 gün", value: "3", patch: { rentalDays: 3 } },
        { label: "4-7 gün", value: "7", patch: { rentalDays: 7 } },
        { label: "8-15 gün", value: "15", patch: { rentalDays: 15 } },
        { label: "1 ay", value: "30", patch: { rentalDays: 30 } },
      ],
    };
  }

  if (serviceType === "transfer" && !intent.destination) {
    return {
      id: "destination",
      text: "Transfer hara olacaq?",
      options: [
        { label: "Bakı", value: "Bakı", patch: { destination: "Bakı" } },
        { label: "Sea Breeze", value: "Sea Breeze", patch: { destination: "Sea Breeze" } },
        { label: "Qəbələ", value: "Qəbələ", patch: { destination: "Qəbələ" } },
        { label: "Başqa istiqamət", value: "other", patch: { destination: "Bakı" } },
      ],
    };
  }

  if (!intent.priorities?.length) {
    return {
      id: "priority",
      text: "Sizin üçün hansı daha vacibdir?",
      options: [
        { label: "Ən sərfəli qiymət", value: "price", patch: { priorities: ["price"] } },
        { label: "Rahatlıq", value: "comfort", patch: { priorities: ["comfort"] } },
        { label: "Geniş salon", value: "space", patch: { priorities: ["space"] } },
        { label: "Premium görünüş", value: "luxury", patch: { priorities: ["luxury", "appearance"] } },
      ],
    };
  }

  return undefined;
}

export function buildConciergeResponse(cars: Car[], intent: ConciergeIntent): ConciergeResponse {
  const serviceType = intent.serviceType === "unknown" ? "rental" : intent.serviceType;
  const ranked = rankCars(cars, { ...intent, serviceType });
  const question = ranked.length ? undefined : nextQuestion(intent);
  const top = ranked[0];

  const transferSuggestion =
    serviceType === "rental_transfer" || (intent.destination && intent.needsDriver)
      ? {
          label: "Transfer + icarə kombinasiyası",
          description:
            "Hava limanı və ya başlanğıc marşrut üçün transfer, sonra isə gündəlik icarə daha rahat ola bilər.",
          price: null,
        }
      : undefined;

  return {
    intent: { ...intent, serviceType },
    headline:
      serviceType === "wedding"
        ? "Toy planınız üçün uyğun avtomobillər"
        : serviceType === "transfer"
          ? "Transfer üçün uyğun seçimlər"
          : "Sizin üçün ən uyğun seçim",
    summary: top
      ? `${top.car.title} planınıza ən yaxın uyğunluq göstərir: ${top.reasons[0] ?? carSpecsDescription(top.car)}`
      : "Hazırkı seçimlər arasında bütün tələblərinizə tam uyğun avtomobil tapılmadı.",
    results: ranked.slice(0, 3),
    alternatives: ranked.slice(3, 6),
    transferSuggestion,
    question,
    noGoodMatch: ranked.length
      ? undefined
      : "Tələbləri bir az yumşaltsaq yaxın variantları göstərə bilərik.",
  };
}


/* ============================================================
   CARBON AI — PERSONALIZED RESULT EXPLANATION
   Ranking stays deterministic.
   OpenAI may explain ranked real inventory only.
============================================================ */

function localResultInsight(
  result: ConciergeResult,
  intent: ConciergeIntent,
): NonNullable<ConciergeResult["ai"]> {
  const baggage =
    (result.car.baggage ?? 0) +
    (result.car.smallBaggage ?? 0);

  const budgetAmount = intent.budget?.amount;

  const budgetFit =
    budgetAmount && result.price
      ? result.price <= budgetAmount
        ? "Büdcənizə uyğundur"
        : "Göstərilən büdcədən yuxarıdır"
      : "Büdcə limiti dəqiqləşdirilməyib";

  const spaceFit =
    intent.passengers && result.car.seats
      ? result.car.seats >= intent.passengers
        ? `${intent.passengers} nəfərlik səfər üçün kifayət qədər oturacaq var`
        : "Sərnişin sayı üçün daha böyük avtomobil məsləhətdir"
      : result.car.seats
        ? `${result.car.seats} nəfərlik salon`
        : "Salon tutumu barədə əlavə məlumat tələb olunur";

  const tripFit = intent.destination
    ? `${intent.destination} istiqaməti üçün ${result.car.category} sinfində seçimdir`
    : `${result.car.category} kateqoriyasında balanslı seçimdir`;

  return {
    verdict:
      result.reasons[0] ??
      `${result.car.title} ehtiyaclarınıza uyğun real Carbon seçimlərindən biridir.`,
    bestFor:
      intent.occasion === "family"
        ? "Ailə səfəri"
        : intent.occasion === "business"
          ? "Biznes və şəhər istifadəsi"
          : intent.wedding
            ? "Toy və xüsusi gün"
            : intent.priorities?.includes("space")
              ? "Rahat və geniş səfər"
              : intent.priorities?.includes("price")
                ? "Qiymət və praktiklik balansı"
                : "Gündəlik və rahat istifadə",
    mainAdvantage:
      result.reasons[1] ??
      `${result.car.seats ?? "—"} oturacaq və ${baggage} ümumi baqaj tutumu`,
    tradeOff:
      result.warnings[0] ??
      "Sorğunuz üzrə ciddi uyğunsuzluq aşkarlanmayıb.",
    budgetFit,
    spaceFit,
    tripFit,
    comparisonNote:
      `${result.score}% uyğunluq balı ilə Carbon sıralamasında güclü namizəddir.`,
  };
}

function withLocalInsights(
  response: ConciergeResponse,
): ConciergeResponse {
  return {
    ...response,
    results: response.results.map((result) => ({
      ...result,
      ai: localResultInsight(result, response.intent),
    })),
    alternatives: response.alternatives.map((result) => ({
      ...result,
      ai: localResultInsight(result, response.intent),
    })),
  };
}

export async function enrichConciergeResponseWithOpenAI(
  response: ConciergeResponse,
  userMessage = "",
): Promise<ConciergeResponse> {
  const fallback = withLocalInsights(response);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || !response.results.length) {
    return fallback;
  }

  const ranked = response.results.slice(0, 4);

  const inventory = ranked.map((result, rank) => ({
    id: result.car.id,
    rank: rank + 1,
    score: result.score,
    title: result.car.title,
    brand: result.car.brand,
    category: result.car.category,
    year: result.car.manufactureYear ?? null,
    seats: result.car.seats,
    largeBaggage: result.car.baggage,
    smallBaggage: result.car.smallBaggage,
    fuel: result.car.fuel,
    engine: result.car.engine,
    transmission: result.car.transmission,
    price: result.price,
    priceLabel: result.priceLabel,
    weddingAvailable: Boolean(result.car.weddingAvailable),
    transferAvailable: Boolean(result.car.transferAvailable),
    deterministicReasons: result.reasons,
    deterministicWarnings: result.warnings,
  }));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const apiResponse = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model:
            process.env.OPENAI_CONCIERGE_MODEL ??
            "gpt-4.1-mini",

          store: false,

          input: [
            {
              role: "system",
              content: `
You are Carbon Rent A Car's premium vehicle concierge.

The Carbon ranking engine has ALREADY selected and ranked real vehicles.
You are NOT allowed to change that ranking.
You are NOT allowed to invent vehicles, prices, specifications, availability,
features or services.

Your job is only to explain WHY each supplied real vehicle fits this exact
customer better or worse.

Write natural premium Azerbaijani.
Sound concise, intelligent and human.
Avoid generic marketing phrases.
Do not say "AI thinks".
Do not claim a feature unless it exists in the supplied data.
Do not infer leather seats, AWD, safety systems, horsepower, boot litres,
exact fuel consumption, or equipment that is not supplied.

For each vehicle:
- verdict: 1-2 concise personalized sentences
- bestFor: short phrase
- mainAdvantage: strongest factual advantage for THIS request
- tradeOff: an honest limitation or compromise
- budgetFit: concise budget assessment
- spaceFit: passenger/luggage assessment
- tripFit: why it fits the journey/occasion
- comparisonNote: how it differs from the other supplied options

The result IDs MUST exactly match supplied car IDs.
              `.trim(),
            },
            {
              role: "user",
              content: JSON.stringify(
                {
                  originalRequest: userMessage || null,
                  intent: response.intent,
                  carbonHeadline: response.headline,
                  carbonSummary: response.summary,
                  rankedRealInventory: inventory,
                },
                null,
                2,
              ),
            },
          ],

          text: {
            format: {
              type: "json_schema",
              name: "carbon_vehicle_analysis",
              strict: true,
              schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  headline: {
                    type: "string",
                  },
                  summary: {
                    type: "string",
                  },
                  results: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: false,
                      properties: {
                        carId: {
                          type: "string",
                        },
                        verdict: {
                          type: "string",
                        },
                        bestFor: {
                          type: "string",
                        },
                        mainAdvantage: {
                          type: "string",
                        },
                        tradeOff: {
                          type: "string",
                        },
                        budgetFit: {
                          type: "string",
                        },
                        spaceFit: {
                          type: "string",
                        },
                        tripFit: {
                          type: "string",
                        },
                        comparisonNote: {
                          type: "string",
                        },
                      },
                      required: [
                        "carId",
                        "verdict",
                        "bestFor",
                        "mainAdvantage",
                        "tradeOff",
                        "budgetFit",
                        "spaceFit",
                        "tripFit",
                        "comparisonNote",
                      ],
                    },
                  },
                },
                required: [
                  "headline",
                  "summary",
                  "results",
                ],
              },
            },
          },

          max_output_tokens: 1500,
        }),
      },
    );

    if (!apiResponse.ok) {
      console.error(
        "[Carbon AI] explanation request failed:",
        apiResponse.status,
      );

      return fallback;
    }

    const payload = await apiResponse.json();
    const outputItems = Array.isArray(payload.output)
      ? (payload.output as OpenAIResponseItem[])
      : [];

    const output =
      payload.output_text ??
      outputItems
        .find((item) => item.type === "message")
        ?.content?.find((item) => item.type === "output_text")
        ?.text ??
      outputItems[0]?.content?.[0]?.text;

    if (!output) {
      return fallback;
    }

    const parsed = JSON.parse(output);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Array.isArray(parsed.results)
    ) {
      return fallback;
    }

    const explanationMap = new Map<
      string,
      NonNullable<ConciergeResult["ai"]>
    >();

    for (const item of parsed.results) {
      if (
        !item ||
        typeof item.carId !== "string"
      ) {
        continue;
      }

      explanationMap.set(item.carId, {
        verdict: String(item.verdict ?? ""),
        bestFor: String(item.bestFor ?? ""),
        mainAdvantage: String(
          item.mainAdvantage ?? "",
        ),
        tradeOff: String(item.tradeOff ?? ""),
        budgetFit: String(item.budgetFit ?? ""),
        spaceFit: String(item.spaceFit ?? ""),
        tripFit: String(item.tripFit ?? ""),
        comparisonNote: String(
          item.comparisonNote ?? "",
        ),
      });
    }

    const enrich = (result: ConciergeResult) => ({
      ...result,
      ai:
        explanationMap.get(result.car.id) ??
        result.ai ??
        localResultInsight(result, response.intent),
    });

    return {
      ...fallback,
      headline:
        typeof parsed.headline === "string" &&
        parsed.headline.trim()
          ? parsed.headline.trim()
          : fallback.headline,
      summary:
        typeof parsed.summary === "string" &&
        parsed.summary.trim()
          ? parsed.summary.trim()
          : fallback.summary,
      results: fallback.results.map(enrich),
      alternatives: fallback.alternatives.map(enrich),
    };
  } catch (error) {
    console.error(
      "[Carbon AI] explanation fallback:",
      error,
    );

    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}
