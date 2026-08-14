
"use client";

import {useCarbonLanguage} from "@/components/CarbonLanguageProvider";

export type CarbonLocale = "az" | "en" | "ru";

export function getCarbonLocale(): CarbonLocale {
  if (typeof document === "undefined") return "az";

  const match = document.cookie.match(
    /(?:^|;\s*)CARBON_LOCALE=(az|en|ru)(?:;|$)/
  );

  return (match?.[1] as CarbonLocale) || "az";
}

export function carbonLocaleCode(locale: CarbonLocale) {
  if (locale === "en") return "en-US";
  if (locale === "ru") return "ru-RU";
  return "az-AZ";
}

const carValueTranslations: Record<
  CarbonLocale,
  Record<string, string>
> = {
  az: {
    Benzin: "Benzin",
    Dizel: "Dizel",
    Avtomat: "Avtomat",
    Mexaniki: "Mexaniki",
    Biznes: "Biznes",
  },
  en: {
    Benzin: "Petrol",
    Dizel: "Diesel",
    Avtomat: "Automatic",
    Mexaniki: "Manual",
    Biznes: "Business",
  },
  ru: {
    Benzin: "Бензин",
    Dizel: "Дизель",
    Avtomat: "Автомат",
    Mexaniki: "Механика",
    Biznes: "Бизнес",
  },
};

export function translateCarValue(
  value: string,
  locale: CarbonLocale = getCarbonLocale()
) {
  return carValueTranslations[locale][value] ?? value;
}

export const carbonCopy = {
  az: {
    hero: {
      eyebrow: "BAKIDA AVTOMOBİL İCARƏSİ",
      line1: "Yolunu seç.",
      line2: "Qalanını biz həll edək.",
      description:
        "Premium avtomobillər, rahat icarə prosesi və hər səfər üçün etibarlı seçim.",
      collection: "KOLLEKSİYA",
      chooseCar: "Avtomobil seç",
      aiKicker: "CARBON AI",
      aiChoose: "Mənə uyğun seç",
      support: "DƏSTƏK",
      contactUs: "Bizimlə əlaqə",
      support247: "24/7",
      support247Text: "Dəstək",
      premium: "Premium",
      premiumText: "Avtomobil seçimi",
      insured: "Tam sığortalı",
      insuredText: "Güvənli icarə",
    },

      booking: {
      title: "Avtomobil seçin",
      car: "Avtomobil",
      selectCar: "Avtomobil seç",
      pickup: "Götürülmə",
      return: "Qaytarılma",
      chooseDate: "Tarix seçin",
      search: "Avtomobilləri göstər",
      available: "Mövcud avtomobillər",
      allCars: "Bütün avtomobillər",
      close: "Bağla",
      clear: "Təmizlə",
      confirm: "Təsdiqlə",
      from: "Başlanğıc",
      to: "Son",
      dayNames: ["B.e", "Ç.a", "Ç", "C.a", "C", "Ş", "B"],
      months: [
        "Yanvar",
        "Fevral",
        "Mart",
        "Aprel",
        "May",
        "İyun",
        "İyul",
        "Avqust",
        "Sentyabr",
        "Oktyabr",
        "Noyabr",
        "Dekabr",
      ],
      },

      bookingBar: {
        aria: "Sürətli rezervasiya",
        reservation: "REZERVASİYA",
        systemActive: "Sistem aktivdir",
        quickChoice: "SÜRƏTLİ SEÇİM",
        heading1: "Səfərinizi",
        heading2: "indi planlayın.",
        intro:
          "Avtomobili şəkillərlə seçin, tarix aralığını müəyyən edin və rezervasiyanı saniyələr içində başladın.",
        rentalDates: "İCARƏ TARİXLƏRİ",
        choosePickup: "Götürmə tarixini seçin",
        chooseReturn: "Qaytarma tarixini seçin",
        selectedRange: "Seçilmiş tarix aralığı",
        pickupMethod: "Təhvil üsulu",
        office: "Carbon ofisi",
        delivery: "Ünvanıma çatdırılma",
        continue: "DAVAM ET",
        choose: "Seçim edin",
        reserve: "Rezervasiya et",
        fullCasco: "Tam kasko",
        transparentPrice: "Şəffaf qiymət",
        support: "24/7 dəstək",
        waitingCar: "Avtomobil gözlənilir",
        searchPlaceholder: "Model və ya marka axtarın...",
        clearSearch: "Axtarışı sil",
        carCount: "avtomobil",
        dailyPrice: "günlük qiymət",
        daily: "GÜNLÜK",
        request: "Sorğu",
        noCar: "Avtomobil tapılmadı",
        noCarText: "Axtarışı və ya kateqoriyanı dəyişin.",
        fleet: "Carbon avtomobil parkı",
        escClose: "ESC · bağla",
        days: "GÜN",
      },

    car: {
      transfer: "Transfer",
      perDay: "/ gün",
      contactPrice: "Qiymət üçün əlaqə",
      seats: "yer",
      view: "avtomobilinə bax",
    },

    guide: {
      experience: "CARBON EXPERIENCE",
      heading1: "İcarə prosesi.",
      heading2: "Sadə və aydın.",
      intro:
        "Avtomobili seçdiyiniz andan açarı aldığınız ana qədər hər detal düşünülüb.",

      steps: [
        {
          eyebrow: "GÖTÜRÜLMƏ VAXTI",
          title: "Vaxtında gəlin",
          short: "Götürülmə vaxtı",
          description:
            "Avtomobilinizi götürmək üçün uyğun vaxt komandanız tərəfindən əvvəlcədən dəqiqləşdirilir. Gecikmə olduqda bizimlə əlaqə saxlamağınız kifayətdir.",
          detail: "Dəqiqlik bizim prinsipimizdir",
          subdetail: "Sizin vaxtınız bizim üçün önəmlidir.",
        },
        {
          eyebrow: "SƏNƏDLƏR",
          title: "Sadəcə əsas sənədlər",
          short: "Nə gətirməlisiniz",
          description:
            "Təhvil zamanı şəxsiyyət sənədi və etibarlı sürücülük vəsiqəsi kifayətdir. Prosesi mümkün qədər qısa və rahat saxlayırıq.",
          detail: "Minimum prosedur",
          subdetail: "Daha az gözləmə, daha tez yola çıxış.",
        },
        {
          eyebrow: "ÖDƏNİŞ ŞƏRTLƏRİ",
          title: "Şəffaf depozit",
          short: "Depozit",
          description:
            "Depozit və ödəniş şərtləri avtomobil seçiminə uyğun olaraq əvvəlcədən izah edilir. Təhvil zamanı sürpriz və gizli şərt yoxdur.",
          detail: "Şərtlər əvvəlcədən məlumdur",
          subdetail: "Aydın qiymət. Aydın proses.",
        },
      ],

      benefits: [
        ["Kasko sığortalı", "Etibarlı avtomobillər"],
        ["Yoxlanılmış park", "Texniki nəzarət"],
        ["24/7 dəstək", "Hər zaman əlaqə"],
        ["Çatdırılma", "Mümkün ünvanlara"],
      ],

      beforeDrive: "BEFORE YOU DRIVE",
      requirementsHeading1: "Yola çıxmaq üçün",
      requirementsHeading2: "cəmi bir neçə detal.",
      faqHeading1: "Sualınız",
      faqHeading2: "qaldı?",
      faqIntro:
        "Rezervasiya və icarə ilə bağlı ən çox verilən sualları burada topladıq.",
      faqContact: "Bizimlə əlaqə",

      requirements: [
        [
          "Şəxsiyyət sənədi",
          "Avtomobili təhvil alarkən etibarlı şəxsiyyət sənədinizi təqdim edin.",
        ],
        [
          "Sürücülük vəsiqəsi",
          "Etibarlı sürücülük vəsiqəsi avtomobilin təhvili üçün tələb olunur.",
        ],
        [
          "Ödəniş",
          "Ödəniş və depozit şərtləri seçdiyiniz avtomobilə uyğun əvvəlcədən bildirilir.",
        ],
        [
          "Təhvil-təslim",
          "Avtomobil birlikdə yoxlanılır və təhvil prosesi aydın şəkildə tamamlanır.",
        ],
      ],

      faq: [
        [
          "Avtomobili necə rezervasiya edə bilərəm?",
          "İstədiyiniz avtomobili seçdikdən sonra bizimlə əlaqə saxlayın. Komandamız mövcudluğu, tarixləri və təhvil detallarını sizinlə dəqiqləşdirəcək.",
        ],
        [
          "Depozit bütün avtomobillər üçün eynidir?",
          "Xeyr. Depozit məbləği avtomobilin kateqoriyasına və icarə şərtlərinə görə dəyişə bilər. Məbləğ rezervasiyadan əvvəl sizə bildirilir.",
        ],
        [
          "Avtomobil ünvana çatdırıla bilər?",
          "Mümkün ünvanlar və vaxt aralığı üzrə çatdırılma təşkil edilə bilər. Dəqiq imkan rezervasiya zamanı təsdiqlənir.",
        ],
        [
          "İcarə müddətini uzatmaq mümkündür?",
          "Avtomobil növbəti tarixlər üçün rezervasiya edilməyibsə, müddətin uzadılması mümkündür. Bunun üçün əvvəlcədən komandamızla əlaqə saxlamaq lazımdır.",
        ],
      ],
    },

    homeExperience: {
      kicker: "XÜSUSİ XİDMƏTLƏR",
      title1: "Sadəcə avtomobil deyil.",
      title2: "Səfərinizə uyğun xidmət.",
      intro:
        "Carbon gündəlik avtomobil icarəsindən əlavə, xüsusi günlər və transfer ehtiyacları üçün ayrıca seçilmiş avtomobillər təqdim edir.",
      services: [
        {
          top: "01 / TOY AVTOMOBİLLƏRİ",
          eyebrow: "XÜSUSİ GÜNLƏR",
          title1: "Günün özü qədər",
          title2: "xüsusi seçim.",
          text: "Toy və digər xüsusi günlər üçün premium avtomobillərdən ibarət seçilmiş kolleksiya.",
          action: "Kolleksiyaya bax",
        },
        {
          top: "02 / TRANSFER",
          eyebrow: "TRANSFER XİDMƏTİ",
          title1: "A nöqtəsindən",
          title2: "rahatlıqla B-yə.",
          text: "Hava limanı, şəhər və fərdi marşrutlar üçün uyğun avtomobillərlə transfer xidməti.",
          action: "Transfer avtomobilləri",
        },
      ],
      whyKicker: "NİYƏ CARBON?",
      whyTitle1: "Detallarda",
      whyTitle2: "fərq var.",
      advantages: [
        ["Etibarlı xidmət", "Səfərinizin hər mərhələsində aydın şərtlər və diqqətli xidmət."],
        ["Seçilmiş avtomobillər", "Gündəlik istifadə, biznes və xüsusi günlər üçün seçilmiş modellər."],
        ["Vaxtınıza uyğun", "Avtomobil seçimi və təhvil prosesini mümkün qədər rahat qururuq."],
        ["Bakı və ətrafı", "Şəhər daxili icarədən hava limanı və transfer ehtiyaclarına qədər."],
      ],
      ctaTitle1: "Növbəti yolunuz",
      ctaTitle2: "buradan başlayır.",
      ctaText:
        "Avtomobilinizi seçin və icarə ilə bağlı məlumat üçün bizimlə əlaqə saxlayın.",
      ctaAction: "Avtomobil seç",
    },

    testimonials: {
      kicker: "MÜŞTƏRİ RƏYLƏRİ",
      title1: "Yolda rahatlıq,",
      title2: "sözdə etibar.",
      intro:
        "Carbon müştərilərinin avtomobil seçimi, təhvil prosesi və dəstək təcrübəsi haqqında qısa fikirləri.",
      stats: [
        ["500+", "məmnun müştəri"],
        ["99%", "müştəri məmnuniyyəti"],
        ["24/7", "aktiv dəstək"],
      ],
      items: [
        {
          name: "Aysel M.",
          role: "Biznes səfəri",
          text: "Avtomobil təmiz, vaxtında və tam hazır vəziyyətdə idi. Rezervasiya prosesi çox rahat keçdi.",
        },
        {
          name: "Murad A.",
          role: "Hava limanı transferi",
          text: "Uçuş saatı dəyişsə də, komanda hər şeyi sakit şəkildə koordinasiya etdi. Sürücü vaxtında orada idi.",
        },
        {
          name: "Nigar R.",
          role: "Toy avtomobili",
          text: "Xüsusi günümüz üçün seçdiyimiz avtomobil həm görüntü, həm də xidmət baxımından gözləntimizi qarşıladı.",
        },
        {
          name: "Elvin H.",
          role: "Gündəlik icarə",
          text: "Qiymət və şərtlər əvvəlcədən aydın izah olundu. Heç bir gizli detal olmadı.",
        },
        {
          name: "Leyla S.",
          role: "Weekend səfəri",
          text: "SUV seçimi səfər üçün çox rahat oldu. Təhvil və geri qaytarma prosesi sürətli idi.",
        },
      ],
    },

    signature: {
      kicker: "CARBON CONCIERGE",
      heading1: "Hara gedirsiniz?",
      heading2: "Seçimi biz daraldaq.",
      intro:
        "Səfərin məqsədini seçin. Carbon sizə uyğun avtomobil kateqoriyasını bir neçə saniyədə göstərsin.",
      selection: "SEÇİM",
      match: "CARBON MATCH",
      recommended: "TÖVSİYƏ EDİLƏN",
      action: "Uyğun avtomobillərə bax",
      journeys: [
        {
          label: "ŞƏHƏR",
          title: "Gündəlik şəhər",
          description:
            "Bakı daxilində rahat hərəkət, görüşlər və gündəlik planlar üçün balanslı seçim.",
          detail: "Rahat - Praktik - Səmərəli",
          from: "ŞƏHƏR",
          to: "CARBON",
        },
        {
          label: "BİZNES",
          title: "Biznes səfəri",
          description:
            "Görüşlər, qonaqlar və daha ciddi təqdimat tələb edən səfərlər üçün premium seçim.",
          detail: "Premium - Sakit - Təqdimatlı",
          from: "GÖRÜŞ",
          to: "MƏRKƏZ",
        },
        {
          label: "XÜSUSİ GÜN",
          title: "Toy və tədbir",
          description:
            "Xüsusi günün vizual atmosferinə uyğun seçilmiş avtomobillərlə daha fərqli giriş.",
          detail: "Luxury - Statement - Special",
          from: "MƏRASİM",
          to: "MƏKAN",
        },
        {
          label: "AEROPORT",
          title: "Hava limanı",
          description:
            "Uçuş vaxtınıza uyğun rahat qarşılanma və şəhərə problemsiz transfer üçün.",
          detail: "Vaxtında - Rahat - Birbaşa",
          from: "GYD",
          to: "BAKI",
        },
        {
          label: "WEEKEND",
          title: "Həftəsonu",
          description:
            "Şəhərdən çıxmaq, planı dəyişmək və yolu səfərin bir hissəsinə çevirmək üçün.",
          detail: "Comfort - Space - Escape",
          from: "BAKI",
          to: "YOL",
        },
      ],
    },

    footer: {
      heading1: "Yolunuzu seçin.",
      heading2: "Qalanını biz həll edək.",
      intro:
        "Bakı daxilində avtomobil icarəsi, xüsusi gün avtomobilləri və transfer xidmətləri üçün premium təcrübə.",
      action: "Avtomobil seç",
      brandText1: "Premium avtomobil icarəsi.",
      brandText2: "Bakı, Azərbaycan.",
      active: "Xidmət aktivdir",
      navigation: "NAVİQASİYA",
      information: "MƏLUMAT",
      contact: "ƏLAQƏ",
      location: "Bakı, Azərbaycan",
      legal: ["Şərtlər və Qaydalar", "Məxfilik Siyasəti"],
      trust: [
        ["100% Təhlükəsizlik", "Kasko sığortalı və etibarlı"],
        ["Təhlükəsiz ödəniş", "Qorunan rezervasiya prosesi"],
        ["24/7 Dəstək", "Hər zaman əlaqə"],
      ],
    },

    servicesPage: {
      heroTitle1: "Sadəcə avtomobil",
      heroTitle2: "icarə etmirik.",
      heroText:
        "Sərfəli qiymətlərlə avtomobil kirayəsi, VIP transfer, texniki dəstək və daha çoxunu sizə təqdim edirik. Rahatlıq və keyfiyyət bizimlə başlayır.",
      discover: "Xidmətləri kəşf et",
      footerStats: ["Tam sığortalı", "Bakı və regionlar", "Premium xidmət"],
      sectionLabel: "XİDMƏTLƏRİMİZ",
      sectionCount: "06 İSTİQAMƏT",
      introTitle1: "Hər səfərə uyğun",
      introTitle2: "bir həll.",
      introText:
        "Şəhər daxilində bir gündən uzunmüddətli istifadəyə, hava limanı transferindən xüsusi günlərə qədər - ehtiyacınıza uyğun xidməti seçin.",
      items: [
        {
          kicker: "ŞƏHƏR / GÜNDƏLİK",
          title: "Gündəlik",
          accent: "avtomobil icarəsi.",
          description:
            "Qısa şəhər səyahətləri və ya bir günlük səfərlər üçün ideal seçimdir. Büdcənizə və stilinizə uyğun olaraq iqtisadi, standart və ya lüks avtomobillərdən birini seçə bilərsiniz.",
          detail: "Bütün icarələrə tam sığorta və limitsiz kilometr daxildir.",
          action: "Avtomobillərə bax",
          meta: ["1+ gün", "Tam sığorta", "Geniş seçim"],
        },
        {
          kicker: "TRANSFER / AIRPORT",
          title: "Hava limanı",
          accent: "transferi.",
          description:
            "Uçuşlarınızı izləyən peşəkar sürücülərlə hava limanına vaxtında çatın və ya qarşılanın. Rahat və təhlükəsiz avtomobillərlə səfər edin.",
          detail: "Transferlər həm fərdi, həm də qrup səfərləri üçün mövcuddur.",
          action: "Transfer sifariş et",
          meta: ["24/7", "Qarşılama", "Sürücü ilə"],
        },
        {
          kicker: "UZUN MÜDDƏT / FLEX",
          title: "Uzunmüddətli",
          accent: "icarə.",
          description:
            "Bir neçə həftəlik və ya aylıq avtomobil ehtiyaclarınız üçün sərfəli uzunmüddətli icarə paketləri təklif edirik.",
          detail: "Texniki baxım və servis də paketə daxildir.",
          action: "Təklif al",
          meta: ["Həftəlik", "Aylıq", "Servis daxil"],
        },
        {
          kicker: "XÜSUSİ GÜNLƏR / EVENT",
          title: "Toy və",
          accent: "xüsusi günlər.",
          description:
            "Toy, nişan, fotosessiya və digər xüsusi günlər üçün lüks avtomobillər təqdim edirik.",
          detail: "Avtomobil bəzədilmiş formada da təqdim oluna bilər.",
          action: "Toy kolleksiyası",
          meta: ["Premium", "Fotosessiya", "Xüsusi gün"],
        },
        {
          kicker: "AZADLIQ / SELF DRIVE",
          title: "Sürücüsüz",
          accent: "icarə.",
          description:
            "Sərbəst şəkildə avtomobil idarə etmək istəyənlər üçün sürücüsüz icarə xidməti.",
          detail: "Sadəcə sənədlərinizi təqdim edin və yol sizin olsun.",
          action: "Avtomobil seç",
          meta: ["Sərbəst", "Rahat proses", "Sizin marşrut"],
        },
        {
          kicker: "SUV / OFF-ROAD",
          title: "SUV və",
          accent: "off-road icarəsi.",
          description:
            "Dağlıq və kənar yollar üçün SUV və off-road avtomobilləri icarəyə verilir.",
          detail: "Macəra sevənlər üçün ideal seçimdir.",
          action: "SUV modellərə bax",
          meta: ["SUV", "4x4", "Uzun səfər"],
        },
      ],
    },

    carsPage: {
      heroTitle1: "Sadəcə avtomobil",
      heroTitle2: "deyil.",
      heroTitle3: "Doğru seçim.",
      heroIntro:
        "Şəhər üçün kompakt seçimdən, biznes səfərinə və xüsusi günə qədər - Carbon kolleksiyasını saniyələr içində filtrləyin.",
      explore: "Kolleksiyanı araşdır",
      finderTitle: "Səyahətinizə uyğun avtomobili tapın",
      resultSuffix: "uyğun nəticə",
      filters: "Filtrlər",
      detailedFilters: "ƏTRAFLI FİLTRLƏR",
      chooseByDetails: "Avtomobili detallara görə seçin",
      reset: "Sıfırla",
      all: "Hamısı",
      brand: "MARKA",
      manufacturer: "İstehsalçı",
      seats: "Sərnişin sayı",
      baggage: "Çamadan tutumu",
      transmission: "Sürətlər qutusu",
      fuel: "Yanacaq növü",
      engine: "Mühərrik həcmi",
      results: "NƏTİCƏ",
      shown: "avtomobil göstərilir",
      perDay: "/ gün",
      request: "Sorğu ilə",
      people: "nəfər",
      detail: "Ətraflı baxış",
      reserve: "seç və rezerv et",
      emptyTitle: "Uyğun avtomobil tapılmadı.",
      emptyText: "Axtarışı dəyişin və ya aktiv filtrləri sıfırlayın.",
      showAll: "Bütün avtomobilləri göstər",
      sort: {
        recommended: "Carbon seçimi",
        low: "Əvvəl ucuz",
        high: "Əvvəl premium",
        name: "Ada görə",
      },
      categories: {
        "Hamısı": "Hamısı",
        TRANSFER: "TRANSFER",
      },
    },
  },

  en: {
    hero: {
      eyebrow: "CAR RENTAL IN BAKU",
      line1: "Choose your road.",
      line2: "We'll take care of the rest.",
      description:
        "Premium cars, a seamless rental process and a reliable choice for every journey.",
      collection: "COLLECTION",
      chooseCar: "Choose a car",
      aiKicker: "CARBON AI",
      aiChoose: "Match me with a car",
      support: "SUPPORT",
      contactUs: "Contact us",
      support247: "24/7",
      support247Text: "Support",
      premium: "Premium",
      premiumText: "Car selection",
      insured: "Fully insured",
      insuredText: "Reliable rental",
    },

      booking: {
      title: "Choose a car",
      car: "Car",
      selectCar: "Select a car",
      pickup: "Pick-up",
      return: "Return",
      chooseDate: "Choose date",
      search: "Show cars",
      available: "Available cars",
      allCars: "All cars",
      close: "Close",
      clear: "Clear",
      confirm: "Confirm",
      from: "From",
      to: "To",
      dayNames: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      },

      bookingBar: {
        aria: "Quick reservation",
        reservation: "RESERVATION",
        systemActive: "System active",
        quickChoice: "QUICK SELECTION",
        heading1: "Plan your trip",
        heading2: "right now.",
        intro:
          "Choose a car with photos, set your date range and start the reservation in seconds.",
        rentalDates: "RENTAL DATES",
        choosePickup: "Choose pick-up date",
        chooseReturn: "Choose return date",
        selectedRange: "Selected date range",
        pickupMethod: "Handover method",
        office: "Carbon office",
        delivery: "Deliver to my address",
        continue: "CONTINUE",
        choose: "Make a selection",
        reserve: "Reserve now",
        fullCasco: "Full casco",
        transparentPrice: "Transparent price",
        support: "24/7 support",
        waitingCar: "Waiting for car selection",
        searchPlaceholder: "Search model or brand...",
        clearSearch: "Clear search",
        carCount: "cars",
        dailyPrice: "daily price",
        daily: "DAILY",
        request: "Request",
        noCar: "No car found",
        noCarText: "Change the search or category.",
        fleet: "Carbon car fleet",
        escClose: "ESC · close",
        days: "DAYS",
      },

    car: {
      transfer: "Transfer",
      perDay: "/ day",
      contactPrice: "Contact for price",
      seats: "seats",
      view: "view car",
    },

    guide: {
      experience: "CARBON EXPERIENCE",
      heading1: "The rental process.",
      heading2: "Simple and clear.",
      intro:
        "Every detail is considered from the moment you choose your car until the keys are in your hand.",

      steps: [
        {
          eyebrow: "PICK-UP TIME",
          title: "Arrive on time",
          short: "Pick-up time",
          description:
            "Your preferred vehicle pick-up time is confirmed with our team in advance. If you're delayed, simply contact us.",
          detail: "Punctuality is our principle",
          subdetail: "Your time matters to us.",
        },
        {
          eyebrow: "DOCUMENTS",
          title: "Only the essentials",
          short: "What to bring",
          description:
            "A valid identity document and driver's licence are all you need at handover. We keep the process as quick and comfortable as possible.",
          detail: "Minimum procedure",
          subdetail: "Less waiting. Get on the road sooner.",
        },
        {
          eyebrow: "PAYMENT TERMS",
          title: "Transparent deposit",
          short: "Deposit",
          description:
            "Deposit and payment terms are explained in advance according to your chosen vehicle. There are no hidden conditions at handover.",
          detail: "Know the terms in advance",
          subdetail: "Clear pricing. Clear process.",
        },
      ],

      benefits: [
        ["Comprehensive insurance", "Reliable vehicles"],
        ["Inspected fleet", "Technical control"],
        ["24/7 support", "Always available"],
        ["Delivery", "To available locations"],
      ],

      beforeDrive: "BEFORE YOU DRIVE",
      requirementsHeading1: "Everything you need",
      requirementsHeading2: "before you drive.",
      faqHeading1: "Still have",
      faqHeading2: "questions?",
      faqIntro:
        "We have collected the most common questions about reservations and rentals here.",
      faqContact: "Contact us",

      requirements: [
        [
          "Identity document",
          "Present a valid identity document when collecting the vehicle.",
        ],
        [
          "Driver's licence",
          "A valid driver's licence is required to collect the vehicle.",
        ],
        [
          "Payment",
          "Payment and deposit terms are provided in advance according to your selected vehicle.",
        ],
        [
          "Vehicle handover",
          "The vehicle is inspected together with you and the handover is completed clearly.",
        ],
      ],

      faq: [
        [
          "How can I reserve a car?",
          "Choose the vehicle you want and contact us. Our team will confirm availability, dates and handover details with you.",
        ],
        [
          "Is the deposit the same for every car?",
          "No. The deposit can vary depending on the vehicle category and rental terms. The exact amount is provided before reservation.",
        ],
        [
          "Can the car be delivered to an address?",
          "Delivery can be arranged for supported locations and time windows. Exact availability is confirmed during reservation.",
        ],
        [
          "Can I extend the rental period?",
          "If the vehicle has not been reserved for the following dates, the rental can be extended. Please contact our team in advance.",
        ],
      ],
    },

    homeExperience: {
      kicker: "SPECIAL SERVICES",
      title1: "More than a car.",
      title2: "A service for your journey.",
      intro:
        "Alongside everyday car rental, Carbon offers carefully selected vehicles for special occasions and transfer needs.",
      services: [
        {
          top: "01 / WEDDING CARS",
          eyebrow: "SPECIAL DAYS",
          title1: "A choice as special",
          title2: "as the day itself.",
          text: "A curated collection of premium cars for weddings and other important occasions.",
          action: "View collection",
        },
        {
          top: "02 / TRANSFER",
          eyebrow: "TRANSFER SERVICE",
          title1: "From point A",
          title2: "to B in comfort.",
          text: "Transfer service with suitable cars for the airport, the city and custom routes.",
          action: "Transfer cars",
        },
      ],
      whyKicker: "WHY CARBON?",
      whyTitle1: "The difference",
      whyTitle2: "is in the details.",
      advantages: [
        ["Reliable service", "Clear terms and attentive service at every stage of your journey."],
        ["Selected vehicles", "Models chosen for daily use, business trips and special occasions."],
        ["Built around your time", "We make vehicle selection and handover as smooth as possible."],
        ["Baku and beyond", "From city rentals to airport and transfer needs."],
      ],
      ctaTitle1: "Your next road",
      ctaTitle2: "starts here.",
      ctaText:
        "Choose your car and contact us for the rental details.",
      ctaAction: "Choose a car",
    },

    testimonials: {
      kicker: "CLIENT STORIES",
      title1: "Comfort on the road,",
      title2: "trust in every detail.",
      intro:
        "Short notes from Carbon clients about car selection, handover and support.",
      stats: [
        ["500+", "happy clients"],
        ["99%", "customer satisfaction"],
        ["24/7", "active support"],
      ],
      items: [
        {
          name: "Aysel M.",
          role: "Business trip",
          text: "The car was clean, on time and fully ready. The reservation process felt very smooth.",
        },
        {
          name: "Murad A.",
          role: "Airport transfer",
          text: "Even when the flight time changed, the team coordinated everything calmly. The driver was there on time.",
        },
        {
          name: "Nigar R.",
          role: "Wedding car",
          text: "The car we chose for our special day matched our expectations in both appearance and service.",
        },
        {
          name: "Elvin H.",
          role: "Daily rental",
          text: "The price and terms were explained clearly in advance. There were no hidden details.",
        },
        {
          name: "Leyla S.",
          role: "Weekend trip",
          text: "The SUV was very comfortable for the trip. Pick-up and return were quick and easy.",
        },
      ],
    },

    signature: {
      kicker: "CARBON CONCIERGE",
      heading1: "Where are you going?",
      heading2: "Let us narrow the choice.",
      intro:
        "Choose the purpose of your trip and Carbon will show the right vehicle category in seconds.",
      selection: "SELECTION",
      match: "CARBON MATCH",
      recommended: "RECOMMENDED",
      action: "View matching cars",
      journeys: [
        {
          label: "CITY",
          title: "Daily city drive",
          description:
            "A balanced choice for easy movement around Baku, meetings and everyday plans.",
          detail: "Comfortable - Practical - Efficient",
          from: "CITY",
          to: "CARBON",
        },
        {
          label: "BUSINESS",
          title: "Business trip",
          description:
            "A premium choice for meetings, guests and journeys that need a more polished presentation.",
          detail: "Premium - Quiet - Presentable",
          from: "MEETING",
          to: "CENTER",
        },
        {
          label: "SPECIAL DAY",
          title: "Wedding and event",
          description:
            "A memorable entrance with vehicles selected to match the visual mood of your special day.",
          detail: "Luxury - Statement - Special",
          from: "CEREMONY",
          to: "VENUE",
        },
        {
          label: "AIRPORT",
          title: "Airport transfer",
          description:
            "Comfortable meeting and smooth transfer to the city around your flight schedule.",
          detail: "On time - Comfortable - Direct",
          from: "GYD",
          to: "BAKU",
        },
        {
          label: "WEEKEND",
          title: "Weekend escape",
          description:
            "For leaving the city, changing the plan and making the road part of the trip.",
          detail: "Comfort - Space - Escape",
          from: "BAKU",
          to: "ROAD",
        },
      ],
    },

    footer: {
      heading1: "Choose your road.",
      heading2: "We'll take care of the rest.",
      intro:
        "A premium experience for car rental in Baku, special occasion cars and transfer services.",
      action: "Choose a car",
      brandText1: "Premium car rental.",
      brandText2: "Baku, Azerbaijan.",
      active: "Service active",
      navigation: "NAVIGATION",
      information: "INFORMATION",
      contact: "CONTACT",
      location: "Baku, Azerbaijan",
      legal: ["Terms and Conditions", "Privacy Policy"],
      trust: [
        ["100% Safety", "Comprehensive insurance and reliability"],
        ["Secure payment", "Protected reservation process"],
        ["24/7 Support", "Always available"],
      ],
    },

    servicesPage: {
      heroTitle1: "We do more",
      heroTitle2: "than rent cars.",
      heroText:
        "We provide affordable car rental, VIP transfers, technical support and more. Comfort and quality start with us.",
      discover: "Explore services",
      footerStats: ["Fully insured", "Baku and regions", "Premium service"],
      sectionLabel: "OUR SERVICES",
      sectionCount: "06 DIRECTIONS",
      introTitle1: "A solution",
      introTitle2: "for every journey.",
      introText:
        "From one-day city use to long-term rental, from airport transfers to special occasions, choose the service that fits your need.",
      items: [
        {
          kicker: "CITY / DAILY",
          title: "Daily",
          accent: "car rental.",
          description:
            "Ideal for short city trips or one-day journeys. Choose an economy, standard or luxury car to match your budget and style.",
          detail: "All rentals include full insurance and unlimited mileage.",
          action: "View cars",
          meta: ["1+ day", "Full insurance", "Wide choice"],
        },
        {
          kicker: "TRANSFER / AIRPORT",
          title: "Airport",
          accent: "transfer.",
          description:
            "Arrive at the airport on time or be met by professional drivers who track your flight. Travel in comfortable, safe vehicles without delay stress.",
          detail: "Transfers are available for both individual and group trips.",
          action: "Book transfer",
          meta: ["24/7", "Meet and greet", "With driver"],
        },
        {
          kicker: "LONG TERM / FLEX",
          title: "Long-term",
          accent: "rental.",
          description:
            "Cost-effective long-term rental packages for several weeks or monthly vehicle needs, ideal for companies and private customers.",
          detail: "Maintenance and service are included in the package.",
          action: "Get an offer",
          meta: ["Weekly", "Monthly", "Service included"],
        },
        {
          kicker: "SPECIAL OCCASIONS / EVENT",
          title: "Weddings and",
          accent: "special days.",
          description:
            "Luxury cars for weddings, engagements, photo shoots and other special occasions.",
          detail: "The car can also be provided decorated.",
          action: "Wedding collection",
          meta: ["Premium", "Photo shoot", "Special day"],
        },
        {
          kicker: "FREEDOM / SELF DRIVE",
          title: "Self-drive",
          accent: "rental.",
          description:
            "Self-drive rental for customers who want to drive independently and use the car whenever and wherever they need.",
          detail: "Just provide your documents and the road is yours.",
          action: "Choose a car",
          meta: ["Independent", "Easy process", "Your route"],
        },
        {
          kicker: "SUV / OFF-ROAD",
          title: "SUV and",
          accent: "off-road rental.",
          description:
            "SUV and off-road vehicles for mountain routes and rougher roads, with confident engines and safer travel.",
          detail: "An ideal choice for adventure-minded drivers.",
          action: "View SUV models",
          meta: ["SUV", "4x4", "Long trip"],
        },
      ],
    },

    carsPage: {
      heroTitle1: "Not just",
      heroTitle2: "a car.",
      heroTitle3: "The right choice.",
      heroIntro:
        "Filter the Carbon collection in seconds, from compact city options to business trips and special days.",
      explore: "Explore the collection",
      finderTitle: "Find the car that fits your journey",
      resultSuffix: "matching results",
      filters: "Filters",
      detailedFilters: "DETAILED FILTERS",
      chooseByDetails: "Choose a car by details",
      reset: "Reset",
      all: "All",
      brand: "BRAND",
      manufacturer: "Manufacturer",
      seats: "Passenger count",
      baggage: "Luggage capacity",
      transmission: "Transmission",
      fuel: "Fuel type",
      engine: "Engine size",
      results: "RESULTS",
      shown: "cars shown",
      perDay: "/ day",
      request: "On request",
      people: "people",
      detail: "View details",
      reserve: "select and reserve",
      emptyTitle: "No matching cars found.",
      emptyText: "Change your search or reset the active filters.",
      showAll: "Show all cars",
      sort: {
        recommended: "Carbon choice",
        low: "Lowest first",
        high: "Premium first",
        name: "By name",
      },
      categories: {
        "Hamısı": "All",
        TRANSFER: "TRANSFER",
      },
    },
  },

  ru: {
    hero: {
      eyebrow: "АРЕНДА АВТОМОБИЛЕЙ В БАКУ",
      line1: "Выберите свой путь.",
      line2: "Остальное мы возьмём на себя.",
      description:
        "Премиальные автомобили, удобный процесс аренды и надёжный выбор для каждой поездки.",
      collection: "КОЛЛЕКЦИЯ",
      chooseCar: "Выбрать автомобиль",
      aiKicker: "CARBON AI",
      aiChoose: "Подобрать авто",
      support: "ПОДДЕРЖКА",
      contactUs: "Связаться с нами",
      support247: "24/7",
      support247Text: "Поддержка",
      premium: "Premium",
      premiumText: "Выбор автомобилей",
      insured: "Полная страховка",
      insuredText: "Надёжная аренда",
    },

      booking: {
      title: "Выберите автомобиль",
      car: "Автомобиль",
      selectCar: "Выбрать автомобиль",
      pickup: "Получение",
      return: "Возврат",
      chooseDate: "Выбрать дату",
      search: "Показать автомобили",
      available: "Доступные автомобили",
      allCars: "Все автомобили",
      close: "Закрыть",
      clear: "Очистить",
      confirm: "Подтвердить",
      from: "Начало",
      to: "Конец",
      dayNames: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
      months: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ],
      },

      bookingBar: {
        aria: "Быстрое бронирование",
        reservation: "БРОНИРОВАНИЕ",
        systemActive: "Система активна",
        quickChoice: "БЫСТРЫЙ ВЫБОР",
        heading1: "Запланируйте поездку",
        heading2: "прямо сейчас.",
        intro:
          "Выберите автомобиль по фото, укажите даты и начните бронирование за несколько секунд.",
        rentalDates: "ДАТЫ АРЕНДЫ",
        choosePickup: "Выберите дату получения",
        chooseReturn: "Выберите дату возврата",
        selectedRange: "Выбранный период",
        pickupMethod: "Способ передачи",
        office: "Офис Carbon",
        delivery: "Доставка на мой адрес",
        continue: "ПРОДОЛЖИТЬ",
        choose: "Сделайте выбор",
        reserve: "Забронировать",
        fullCasco: "Полное КАСКО",
        transparentPrice: "Прозрачная цена",
        support: "Поддержка 24/7",
        waitingCar: "Ожидается выбор автомобиля",
        searchPlaceholder: "Поиск модели или марки...",
        clearSearch: "Очистить поиск",
        carCount: "автомобилей",
        dailyPrice: "цена за день",
        daily: "ЗА ДЕНЬ",
        request: "Запрос",
        noCar: "Автомобиль не найден",
        noCarText: "Измените поиск или категорию.",
        fleet: "Автопарк Carbon",
        escClose: "ESC · закрыть",
        days: "ДН.",
      },

    car: {
      transfer: "Трансфер",
      perDay: "/ день",
      contactPrice: "Уточнить цену",
      seats: "мест",
      view: "посмотреть автомобиль",
    },

    guide: {
      experience: "CARBON EXPERIENCE",
      heading1: "Процесс аренды.",
      heading2: "Просто и понятно.",
      intro:
        "Мы продумали каждую деталь — от выбора автомобиля до момента, когда ключи окажутся у вас.",

      steps: [
        {
          eyebrow: "ВРЕМЯ ПОЛУЧЕНИЯ",
          title: "Приезжайте вовремя",
          short: "Время получения",
          description:
            "Удобное время получения автомобиля заранее согласовывается с нашей командой. Если вы задерживаетесь, просто свяжитесь с нами.",
          detail: "Точность — наш принцип",
          subdetail: "Мы ценим ваше время.",
        },
        {
          eyebrow: "ДОКУМЕНТЫ",
          title: "Только основные документы",
          short: "Что взять с собой",
          description:
            "При получении достаточно удостоверения личности и действующего водительского удостоверения. Мы делаем процесс максимально быстрым и удобным.",
          detail: "Минимум формальностей",
          subdetail: "Меньше ожидания — быстрее в путь.",
        },
        {
          eyebrow: "УСЛОВИЯ ОПЛАТЫ",
          title: "Прозрачный депозит",
          short: "Депозит",
          description:
            "Условия депозита и оплаты объясняются заранее в зависимости от выбранного автомобиля. Никаких скрытых условий при получении.",
          detail: "Все условия известны заранее",
          subdetail: "Понятная цена. Понятный процесс.",
        },
      ],

      benefits: [
        ["Полное КАСКО", "Надёжные автомобили"],
        ["Проверенный автопарк", "Технический контроль"],
        ["Поддержка 24/7", "Всегда на связи"],
        ["Доставка", "По доступным адресам"],
      ],

      beforeDrive: "ПЕРЕД ПОЕЗДКОЙ",
      requirementsHeading1: "Всё необходимое",
      requirementsHeading2: "перед поездкой.",
      faqHeading1: "Остались",
      faqHeading2: "вопросы?",
      faqIntro:
        "Здесь собраны самые частые вопросы о бронировании и аренде.",
      faqContact: "Связаться с нами",

      requirements: [
        [
          "Удостоверение личности",
          "Предъявите действительное удостоверение личности при получении автомобиля.",
        ],
        [
          "Водительское удостоверение",
          "Для получения автомобиля требуется действующее водительское удостоверение.",
        ],
        [
          "Оплата",
          "Условия оплаты и депозита сообщаются заранее в соответствии с выбранным автомобилем.",
        ],
        [
          "Передача автомобиля",
          "Автомобиль осматривается вместе с вами, после чего процесс передачи завершается.",
        ],
      ],

      faq: [
        [
          "Как забронировать автомобиль?",
          "Выберите нужный автомобиль и свяжитесь с нами. Наша команда подтвердит доступность, даты и детали передачи.",
        ],
        [
          "Депозит одинаковый для всех автомобилей?",
          "Нет. Размер депозита зависит от категории автомобиля и условий аренды. Точная сумма сообщается до бронирования.",
        ],
        [
          "Можно ли доставить автомобиль по адресу?",
          "Доставка может быть организована по доступным адресам и временным интервалам. Возможность подтверждается при бронировании.",
        ],
        [
          "Можно ли продлить срок аренды?",
          "Если автомобиль не забронирован на последующие даты, срок аренды можно продлить. Для этого заранее свяжитесь с нашей командой.",
        ],
      ],
    },

    homeExperience: {
      kicker: "СПЕЦИАЛЬНЫЕ УСЛУГИ",
      title1: "Не просто автомобиль.",
      title2: "Услуга под вашу поездку.",
      intro:
        "Помимо ежедневной аренды, Carbon предлагает специально подобранные автомобили для важных событий и трансферов.",
      services: [
        {
          top: "01 / СВАДЕБНЫЕ АВТОМОБИЛИ",
          eyebrow: "ОСОБЫЕ ДНИ",
          title1: "Выбор такой же особенный,",
          title2: "как сам день.",
          text: "Подобранная коллекция премиальных автомобилей для свадеб и других важных событий.",
          action: "Смотреть коллекцию",
        },
        {
          top: "02 / ТРАНСФЕР",
          eyebrow: "УСЛУГА ТРАНСФЕРА",
          title1: "Из точки А",
          title2: "в точку Б с комфортом.",
          text: "Трансфер с подходящими автомобилями для аэропорта, города и индивидуальных маршрутов.",
          action: "Автомобили для трансфера",
        },
      ],
      whyKicker: "ПОЧЕМУ CARBON?",
      whyTitle1: "Разница",
      whyTitle2: "в деталях.",
      advantages: [
        ["Надежный сервис", "Понятные условия и внимательный сервис на каждом этапе поездки."],
        ["Отобранные автомобили", "Модели для ежедневных поездок, бизнеса и особых событий."],
        ["Под ваш график", "Мы делаем выбор автомобиля и передачу максимально удобными."],
        ["Баку и окрестности", "От городской аренды до аэропорта и трансферов."],
      ],
      ctaTitle1: "Ваша следующая дорога",
      ctaTitle2: "начинается здесь.",
      ctaText:
        "Выберите автомобиль и свяжитесь с нами для уточнения деталей аренды.",
      ctaAction: "Выбрать автомобиль",
    },

    testimonials: {
      kicker: "ОТЗЫВЫ КЛИЕНТОВ",
      title1: "Комфорт в дороге,",
      title2: "доверие в деталях.",
      intro:
        "Короткие отзывы клиентов Carbon о выборе автомобиля, передаче и поддержке.",
      stats: [
        ["500+", "довольных клиентов"],
        ["99%", "удовлетворенность"],
        ["24/7", "активная поддержка"],
      ],
      items: [
        {
          name: "Aysel M.",
          role: "Деловая поездка",
          text: "Автомобиль был чистым, вовремя поданным и полностью готовым. Процесс бронирования прошел очень удобно.",
        },
        {
          name: "Murad A.",
          role: "Трансфер из аэропорта",
          text: "Даже когда время рейса изменилось, команда спокойно все скоординировала. Водитель был на месте вовремя.",
        },
        {
          name: "Nigar R.",
          role: "Свадебный автомобиль",
          text: "Автомобиль для особого дня оправдал ожидания и по внешнему виду, и по уровню сервиса.",
        },
        {
          name: "Elvin H.",
          role: "Ежедневная аренда",
          text: "Цена и условия были заранее объяснены понятно. Никаких скрытых деталей не было.",
        },
        {
          name: "Leyla S.",
          role: "Поездка на выходные",
          text: "SUV оказался очень удобным для поездки. Получение и возврат прошли быстро.",
        },
      ],
    },

    signature: {
      kicker: "CARBON CONCIERGE",
      heading1: "Куда вы едете?",
      heading2: "Мы сузим выбор.",
      intro:
        "Выберите цель поездки, и Carbon за несколько секунд покажет подходящую категорию автомобиля.",
      selection: "ВЫБОР",
      match: "CARBON MATCH",
      recommended: "РЕКОМЕНДУЕМ",
      action: "Смотреть подходящие авто",
      journeys: [
        {
          label: "ГОРОД",
          title: "Ежедневные поездки",
          description:
            "Сбалансированный выбор для комфортного передвижения по Баку, встреч и повседневных планов.",
          detail: "Комфортно - Практично - Экономно",
          from: "ГОРОД",
          to: "CARBON",
        },
        {
          label: "БИЗНЕС",
          title: "Деловая поездка",
          description:
            "Премиальный выбор для встреч, гостей и поездок, где важна более представительная подача.",
          detail: "Премиально - Тихо - Представительно",
          from: "ВСТРЕЧА",
          to: "ЦЕНТР",
        },
        {
          label: "ОСОБЫЙ ДЕНЬ",
          title: "Свадьба и событие",
          description:
            "Запоминающийся приезд на автомобилях, подобранных под атмосферу вашего особого дня.",
          detail: "Luxury - Statement - Special",
          from: "ЦЕРЕМОНИЯ",
          to: "МЕСТО",
        },
        {
          label: "АЭРОПОРТ",
          title: "Трансфер из аэропорта",
          description:
            "Комфортная встреча и спокойный трансфер в город с учетом вашего рейса.",
          detail: "Вовремя - Удобно - Напрямую",
          from: "GYD",
          to: "БАКУ",
        },
        {
          label: "WEEKEND",
          title: "Поездка на выходные",
          description:
            "Чтобы выехать из города, изменить план и сделать дорогу частью путешествия.",
          detail: "Comfort - Space - Escape",
          from: "БАКУ",
          to: "ДОРОГА",
        },
      ],
    },

    footer: {
      heading1: "Выберите свой путь.",
      heading2: "Остальное мы возьмем на себя.",
      intro:
        "Премиальный опыт аренды автомобилей в Баку, автомобили для особых событий и трансферные услуги.",
      action: "Выбрать автомобиль",
      brandText1: "Премиальная аренда автомобилей.",
      brandText2: "Баку, Азербайджан.",
      active: "Сервис активен",
      navigation: "НАВИГАЦИЯ",
      information: "ИНФОРМАЦИЯ",
      contact: "КОНТАКТЫ",
      location: "Баку, Азербайджан",
      legal: ["Условия и правила", "Политика конфиденциальности"],
      trust: [
        ["100% безопасность", "Полное КАСКО и надежность"],
        ["Безопасная оплата", "Защищенный процесс бронирования"],
        ["Поддержка 24/7", "Всегда на связи"],
      ],
    },

    servicesPage: {
      heroTitle1: "Мы не просто",
      heroTitle2: "сдаем автомобили.",
      heroText:
        "Мы предлагаем выгодную аренду автомобилей, VIP-трансфер, техническую поддержку и многое другое. Комфорт и качество начинаются с нами.",
      discover: "Изучить услуги",
      footerStats: ["Полная страховка", "Баку и регионы", "Премиальный сервис"],
      sectionLabel: "НАШИ УСЛУГИ",
      sectionCount: "06 НАПРАВЛЕНИЙ",
      introTitle1: "Решение",
      introTitle2: "для каждой поездки.",
      introText:
        "От одного дня в городе до долгосрочного пользования, от трансфера из аэропорта до особых событий - выберите услугу под вашу задачу.",
      items: [
        {
          kicker: "ГОРОД / ЕЖЕДНЕВНО",
          title: "Ежедневная",
          accent: "аренда авто.",
          description:
            "Идеальный выбор для коротких городских поездок или поездок на один день. Вы можете выбрать экономичный, стандартный или люксовый автомобиль под бюджет и стиль.",
          detail: "Во все аренды входит полная страховка и неограниченный пробег.",
          action: "Смотреть автомобили",
          meta: ["1+ день", "Полная страховка", "Широкий выбор"],
        },
        {
          kicker: "ТРАНСФЕР / AIRPORT",
          title: "Аэропорт",
          accent: "трансфер.",
          description:
            "Доберитесь в аэропорт вовремя или встретьте гостей с профессиональными водителями, которые отслеживают рейс.",
          detail: "Трансферы доступны для индивидуальных и групповых поездок.",
          action: "Заказать трансфер",
          meta: ["24/7", "Встреча", "С водителем"],
        },
        {
          kicker: "ДОЛГОСРОЧНО / FLEX",
          title: "Долгосрочная",
          accent: "аренда.",
          description:
            "Выгодные пакеты долгосрочной аренды на несколько недель или месяцев для компаний и частных клиентов.",
          detail: "Техническое обслуживание и сервис входят в пакет.",
          action: "Получить предложение",
          meta: ["Недельно", "Ежемесячно", "Сервис включен"],
        },
        {
          kicker: "ОСОБЫЕ ДНИ / EVENT",
          title: "Свадьбы и",
          accent: "особые дни.",
          description:
            "Люксовые автомобили для свадеб, помолвок, фотосессий и других особых событий.",
          detail: "Автомобиль также может быть предоставлен с украшением.",
          action: "Свадебная коллекция",
          meta: ["Premium", "Фотосессия", "Особый день"],
        },
        {
          kicker: "СВОБОДА / SELF DRIVE",
          title: "Аренда",
          accent: "без водителя.",
          description:
            "Аренда без водителя для тех, кто хочет самостоятельно управлять автомобилем и пользоваться им в нужное время.",
          detail: "Просто предоставьте документы, и дорога ваша.",
          action: "Выбрать автомобиль",
          meta: ["Свободно", "Удобный процесс", "Ваш маршрут"],
        },
        {
          kicker: "SUV / OFF-ROAD",
          title: "SUV и",
          accent: "off-road аренда.",
          description:
            "SUV и внедорожные автомобили для горных направлений и сложных дорог.",
          detail: "Идеальный выбор для любителей приключений.",
          action: "Смотреть SUV",
          meta: ["SUV", "4x4", "Дальняя поездка"],
        },
      ],
    },

    carsPage: {
      heroTitle1: "Не просто",
      heroTitle2: "автомобиль.",
      heroTitle3: "Правильный выбор.",
      heroIntro:
        "От компактных городских вариантов до деловых поездок и особых дней - отфильтруйте коллекцию Carbon за секунды.",
      explore: "Изучить коллекцию",
      finderTitle: "Найдите автомобиль под вашу поездку",
      resultSuffix: "подходящих результатов",
      filters: "Фильтры",
      detailedFilters: "ПОДРОБНЫЕ ФИЛЬТРЫ",
      chooseByDetails: "Выберите автомобиль по деталям",
      reset: "Сбросить",
      all: "Все",
      brand: "МАРКА",
      manufacturer: "Производитель",
      seats: "Количество пассажиров",
      baggage: "Вместимость багажа",
      transmission: "Коробка передач",
      fuel: "Тип топлива",
      engine: "Объем двигателя",
      results: "РЕЗУЛЬТАТ",
      shown: "автомобилей показано",
      perDay: "/ день",
      request: "По запросу",
      people: "чел.",
      detail: "Подробнее",
      reserve: "выбрать и забронировать",
      emptyTitle: "Подходящий автомобиль не найден.",
      emptyText: "Измените поиск или сбросьте активные фильтры.",
      showAll: "Показать все автомобили",
      sort: {
        recommended: "Выбор Carbon",
        low: "Сначала дешевле",
        high: "Сначала премиум",
        name: "По названию",
      },
      categories: {
        "Hamısı": "Все",
        TRANSFER: "ТРАНСФЕР",
      },
    },
  },
} as const;

export function useCarbonCopy() {
  const {locale} = useCarbonLanguage();

  return {
    locale,
    localeCode: carbonLocaleCode(locale),
    copy: carbonCopy[locale],
  };
}
