export type BlogSection = {
  heading?: string;
  paragraphs: string[];
  image?: string;
  imageAlt?: string;
  quote?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  date: string;
  category: string;
  readingTime: string;
  eyebrow: string;
  intro: string;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "qiymet-ve-sigorta-maariflendirmesi",
    title: "Qiymət və Sığorta Maarifləndirməsi",
    description:
      "Avtomobil kirayəsində sığortanın faydaları, depozit və qiymət şərtləri barədə bilməli olduğunuz əsas məqamlar.",
    image:
      "https://framerusercontent.com/images/VUzmNKhFW8FdZlZp5QpTnfbrsQ.png",
    date: "2025-02-04",
    category: "İcarə bələdçisi",
    readingTime: "5 dəq",
    eyebrow: "ŞƏFFAFLIQ · TƏHLÜKƏSİZLİK",
    intro:
      "Avtomobil kirayəsində gündəlik qiymət yalnız başlanğıcdır. Sığorta, depozit və müqavilə şərtlərini düzgün anlamaq həm büdcənizi, həm də səfərinizi qoruyur.",
    sections: [
      {
        heading: "Qiymətdən daha vacib olan nədir?",
        paragraphs: [
          "Avtomobil kirayəsi zamanı qiymət qədər vacib olan digər məsələ sığorta şərtləridir. Bir çox sürücü yalnız gündəlik kirayə haqqına diqqət yetirsə də, sığorta sizi gözlənilməz xərclərdən qoruyan əsas amillərdən biridir.",
          "Kiçik bir qəza, parklanma zamanı yaranan zədə və ya digər gözlənilməz hadisə əlavə xərc yarada bilər. Buna görə avtomobili seçərkən yalnız ən aşağı qiyməti deyil, həmin qiymətə hansı xidmətlərin daxil olduğunu da müqayisə etmək daha düzgün yanaşmadır.",
        ],
      },
      {
        heading: "Sığorta paketini əvvəlcədən anlayın",
        paragraphs: [
          "Kirayə müqaviləsini imzalamazdan əvvəl hansı halların sığortaya daxil olduğunu öyrənmək vacibdir. Bəzi paketlər əsas riskləri əhatə edir, digərləri isə daha geniş qoruma təqdim edə bilər.",
          "Müqavilədə sürücünün məsuliyyəti, istisnalar və mümkün əlavə ödənişlər aydın olmalıdır. Şərtləri əvvəlcədən bilmək avtomobili qaytararkən yarana biləcək anlaşılmazlıqların qarşısını alır.",
        ],
        quote:
          "Yaxşı kirayə təcrübəsi yalnız yaxşı avtomobillə deyil, aydın şərtlərlə başlayır.",
      },
      {
        heading: "Depozit necə işləyir?",
        paragraphs: [
          "Depozit avtomobil kirayəsində geniş istifadə olunan təhlükəsizlik tədbiridir. Məbləğ avtomobil qaytarılana qədər müvəqqəti olaraq saxlanılır.",
          "Avtomobil müqavilə şərtlərinə uyğun və problem olmadan təhvil verilirsə, depozit geri qaytarılır. Kartla edilən əməliyyatlarda məbləğin hesabda yenidən görünmə müddəti bankın prosedurlarından asılı olaraq dəyişə bilər.",
          "Rezervasiyadan əvvəl depozitin məbləğini, ödəniş üsulunu və qaytarılma prosedurunu soruşmaq səfər büdcəsini daha düzgün planlamağa kömək edir.",
        ],
      },
      {
        heading: "Şəffaf seçim daha rahat səfər deməkdir",
        paragraphs: [
          "Şəffaf qiymət siyasəti, aydın sığorta şərtləri və düzgün məlumatlandırma keyfiyyətli avtomobil kirayəsi xidmətinin əsas hissəsidir.",
          "Son qərarı verməzdən əvvəl gündəlik tariflə yanaşı sığorta, depozit, yanacaq siyasəti, yürüş limiti və əlavə xidmətləri birlikdə nəzərdən keçirin.",
        ],
      },
    ],
  },

  {
    slug: "ucuz-avtomobil-kirayesi-her-zaman-serfelidirmi",
    title: "Ucuz avtomobil kirayəsi hər zaman sərfəlidirmi?",
    description:
      "Ucuz avtomobil kirayəsinin gizli riskləri və seçim zamanı diqqət etməli olduğunuz məqamlar.",
    image:
      "https://framerusercontent.com/images/dP2Takwa2IDjzA0xInR61X4FCM.png",
    date: "2025-02-04",
    category: "Məsləhətlər",
    readingTime: "4 dəq",
    eyebrow: "QİYMƏT · KEYFİYYƏT",
    intro:
      "Ən aşağı qiymət cəlbedici görünür. Ancaq avtomobil kirayəsində real dəyəri yalnız gündəlik tarif deyil, bütün xidmət təcrübəsi müəyyən edir.",
    sections: [
      {
        heading: "Ucuz qiymətin arxasında nə ola bilər?",
        paragraphs: [
          "Ucuz avtomobil kirayəsi ilk baxışdan çox sərfəli görünə bilər. Lakin ən aşağı qiymət hər zaman ən yaxşı seçim demək deyil.",
          "Bəzən aşağı tarif məhdud sığorta, əlavə ödənişlər, daha yüksək depozit və ya köhnə avtomobil parkı ilə birlikdə təqdim oluna bilər. Buna görə yalnız reklam edilən rəqəmə əsasən qərar vermək düzgün deyil.",
        ],
      },
      {
        heading: "Ümumi xidmət dəyərinə baxın",
        paragraphs: [
          "Avtomobilin texniki vəziyyəti, salonun təmizliyi, müştəri dəstəyi, müqavilə şərtləri və sığorta əhatəsi səyahətin rahat keçməsində böyük rol oynayır.",
          "Yolda problem yarandığı zaman operativ dəstək bir neçə manatlıq gündəlik qiymət fərqindən daha dəyərli ola bilər.",
        ],
        quote:
          "Ən sərfəli seçim ən ucuz avtomobil deyil — ödədiyiniz məbləğ qarşılığında ən balanslı xidmətdir.",
      },
      {
        heading: "Rezervasiyadan əvvəl yoxlama siyahısı",
        paragraphs: [
          "Şirkət haqqında rəylərə baxın, avtomobil sinfini dəqiqləşdirin, müqavilənin əsas şərtlərini oxuyun və qiymətə nələrin daxil olduğunu öyrənin.",
          "Yanacaq qaydası, yürüş limiti, gecikmə şərtləri və əlavə sürücü kimi xidmətlərin ayrıca ödəniş yaradıb-yaratmadığını əvvəlcədən bilmək sonradan sürpriz xərclərin qarşısını alır.",
        ],
      },
      {
        heading: "Balanslı qərar",
        paragraphs: [
          "Ən yaxşı kirayə seçimi sadəcə ucuz olan deyil. Qiymət, təhlükəsizlik, avtomobilin vəziyyəti və xidmət keyfiyyəti arasında düzgün balans yaradan təklif daha dəyərlidir.",
        ],
      },
    ],
  },

  {
    slug: "kiraye-meslehetleri",
    title: "Kirayə Məsləhətləri",
    description:
      "Avtomobil seçimi, sığorta, təhvil yoxlaması və yanacaq qaydaları barədə praktik kirayə bələdçisi.",
    image:
      "https://framerusercontent.com/images/8zIdEhIFNf2rhV55NF92yN6DDU.png",
    date: "2025-02-01",
    category: "İcarə bələdçisi",
    readingTime: "6 dəq",
    eyebrow: "PRAKTİK BƏLƏDÇİ",
    intro:
      "Bir neçə sadə yoxlama avtomobil kirayəsini daha rahat, təhlükəsiz və proqnozlaşdırılan təcrübəyə çevirə bilər.",
    sections: [
      {
        heading: "Səfərə uyğun avtomobil seçin",
        paragraphs: [
          "İlk növbədə ehtiyaclarınıza uyğun avtomobil seçmək vacibdir. Şəhər daxilində istifadə üçün kompakt və qənaətcil modellər kifayət edə bilər.",
          "Ailəvi səfərlər, daha çox baqaj və ya uzun məsafələr üçün daha geniş sedan, krossover və SUV modelləri rahat seçim ola bilər.",
        ],
      },
      {
        heading: "Təhvil zamanı avtomobili yoxlayın",
        paragraphs: [
          "Avtomobili təhvil alarkən onun xarici görünüşünü və salonunu diqqətlə yoxlamaq tövsiyə olunur. Mövcud cızıqlar və xırda zədələrin əvvəlcədən qeyd edilməsi sonradan anlaşılmazlığın qarşısını alır.",
          "Təkərlər, işıqlar və yanacaq səviyyəsinə də nəzər yetirmək faydalıdır.",
        ],
        quote:
          "Beş dəqiqəlik təhvil yoxlaması səfərin sonunda uzun müzakirələrin qarşısını ala bilər.",
      },
      {
        heading: "Müqaviləni yalnız formal sənəd kimi görməyin",
        paragraphs: [
          "Sığorta şərtləri, yanacaq siyasəti, depozit, yürüş limiti və avtomobilin qaytarılma vaxtı ilə tanış olun.",
          "Aydın olmayan məqam varsa, avtomobili götürməzdən əvvəl soruşmaq ən düzgün vaxtdır.",
        ],
      },
      {
        heading: "Mövsümü nəzərə alın",
        paragraphs: [
          "Xüsusilə yay mövsümündə və bayram günlərində əvvəlcədən rezervasiya daha çox seçim və daha münasib qiymət əldə etməyə imkan verir.",
          "Erkən planlama istədiyiniz avtomobil sinfinin mövcud olma ehtimalını da artırır.",
        ],
      },
    ],
  },

  {
    slug: "seyahet-marsrutlari-ve-tovsiyeleri",
    title: "Səyahət Marşrutları və Tövsiyələri",
    description:
      "Azərbaycan üzrə avtomobillə səyahət marşrutları, dağ kəndləri və rahat yol planlaması üçün ideyalar.",
    image:
      "https://framerusercontent.com/images/iIsQJZ5Fga8I1GrdHE0vtTXWAKA.png",
    images: [
      "https://framerusercontent.com/images/ZBNlcPsv9Y96Kjh6aqe3AwHyqw.png",
      "https://framerusercontent.com/images/gKkDSeJGvHmAXpy9Ddrx379eLuw.png",
      "https://framerusercontent.com/images/pa2w2X0DZ97Vmh72rH85bUvwE.png",
      "https://framerusercontent.com/images/eql8vDdcpkAcjcrNMNtWLVZno.png",
      "https://framerusercontent.com/images/G7la4JWUmKcgE8NeUxNjLowlsaw.png",
    ],
    date: "2025-02-01",
    category: "Səyahət",
    readingTime: "7 dəq",
    eyebrow: "AZƏRBAYCANI KƏŞF ET",
    intro:
      "Bakıdan çıxan kimi mənzərə dəyişir. Şamaxı yollarından Qəbələyə, Lahıc küçələrindən dağ kəndlərinə qədər avtomobil sizə marşrutu öz tempinizdə qurmaq azadlığı verir.",
    sections: [
      {
        heading: "Bakı → Şamaxı → İsmayıllı → Qəbələ",
        paragraphs: [
          "Azərbaycan avtomobillə səyahət etməyi sevənlər üçün çoxsaylı maraqlı istiqamətlər təqdim edir. Bakıdan Qəbələyə gedən marşrut rahatlığı və dəyişən mənzərələri ilə seçilir.",
          "Yol boyunca Şamaxı və İsmayıllıda dayanaraq yerli mətbəxlə tanış olmaq və səfəri bir neçə fərqli təcrübəyə bölmək mümkündür.",
        ],
        image:
          "https://framerusercontent.com/images/ZBNlcPsv9Y96Kjh6aqe3AwHyqw.png",
        imageAlt: "Azərbaycan üzrə avtomobil səyahəti",
      },
      {
        heading: "Lahıc və dağ istiqamətləri",
        paragraphs: [
          "Dağ və kənd turizmini sevənlər üçün Lahıc, Xınalıq və Laza kimi istiqamətlər xüsusi maraq doğurur.",
          "Yol şəraiti və mövsümdən asılı olaraq krossover və ya SUV tipli avtomobil daha rahat seçim ola bilər. Yola çıxmazdan əvvəl hava və yol şəraitini yoxlamaq vacibdir.",
        ],
        image:
          "https://framerusercontent.com/images/gKkDSeJGvHmAXpy9Ddrx379eLuw.png",
        imageAlt: "Dağ istiqamətində səyahət",
      },
      {
        heading: "Hava limanından birbaşa yola",
        paragraphs: [
          "Hava limanından avtomobil götürmək turistlər və işgüzar səfərdə olan şəxslər üçün rahat həll ola bilər. Beləliklə, ictimai nəqliyyat cədvəllərindən asılı qalmadan marşrutu sərbəst qurmaq mümkündür.",
        ],
        quote:
          "Yaxşı road trip ən qısa yol deyil — dayanmaq istədiyiniz yerləri özünüz seçə bildiyiniz yoldur.",
      },
      {
        heading: "Yola çıxmazdan əvvəl",
        paragraphs: [
          "Marşrutu əvvəlcədən planlaşdırın, yanacaq dayanacaqlarını nəzərə alın və avtomobilin əsas texniki vəziyyətini yoxlayın.",
          "Dağlıq ərazilərə gedərkən hava şəraiti sürətlə dəyişə bildiyi üçün planınızda vaxt ehtiyatı saxlamaq daha rahat səfər yaradır.",
        ],
        image:
          "https://framerusercontent.com/images/pa2w2X0DZ97Vmh72rH85bUvwE.png",
        imageAlt: "Avtomobillə səyahət marşrutu",
      },
    ],
  },

  {
    slug: "avtomobil-baximi-ve-texniki-melumatlar",
    title: "Avtomobil Baxımı və Texniki Məlumatlar",
    description:
      "Təhlükəsizlik yoxlamaları, təkərlər və yanacağa qənaət üçün praktik avtomobil məsləhətləri.",
    image:
      "https://framerusercontent.com/images/6LhruXYAex8LlQRNkJfEkhBPfSE.png",
    date: "2025-02-01",
    category: "Avtomobil",
    readingTime: "5 dəq",
    eyebrow: "TEXNİKİ · TƏHLÜKƏSİZ",
    intro:
      "Avtomobilin texniki vəziyyəti yalnız komfort məsələsi deyil. Düzgün yoxlama təhlükəsizlik, yanacaq sərfiyyatı və ümumi sürüş keyfiyyətinə birbaşa təsir edir.",
    sections: [
      {
        heading: "Səfərdən əvvəl əsas yoxlamalar",
        paragraphs: [
          "Əyləclər, işıqlar, təkərlər və təhlükəsizlik kəmərləri hər səfərdən əvvəl diqqət yetirilməsi faydalı olan əsas detallardır.",
          "Uzun səfər planlaşdırılırsa, avtomobilin ümumi vəziyyətinə daha erkən baxmaq gözlənilməz nasazlıq riskini azaltmağa kömək edir.",
        ],
      },
      {
        heading: "Yanacaq sərfiyyatını azaltmaq",
        paragraphs: [
          "Stabil sürət saxlamaq və lazımsız kəskin sürətlənmələrdən qaçmaq yanacaq sərfiyyatına müsbət təsir göstərə bilər.",
          "Təkərlərdə düzgün hava təzyiqinin saxlanması həm təhlükəsizlik, həm idarəetmə, həm də səmərəlilik baxımından vacibdir.",
        ],
        quote:
          "Avtomobilə vaxtında göstərilən kiçik diqqət, yolda böyük problemin qarşısını ala bilər.",
      },
      {
        heading: "Profilaktik qulluq",
        paragraphs: [
          "Müntəzəm texniki baxış avtomobilin daha stabil işləməsinə və nasazlıqların erkən aşkar edilməsinə kömək edir.",
          "Keyfiyyətli yanacaq, düzgün qulluq və istehsalçının tövsiyələrinə uyğun servis ümumi performansın qorunmasına xidmət edir.",
        ],
      },
    ],
  },

  {
    slug: "niye-carbon-rent-a-car-i-secirler",
    title: "Niyə Carbon Rent A Car-ı Seçirlər?",
    description:
      "Rahat avtomobil kirayəsi, aydın proses, geniş seçim və müştəri yönümlü xidmət yanaşması.",
    image:
      "https://framerusercontent.com/images/ykE8KVUPTwy1vat0GhnW9e9lMhk.png",
    date: "2025-02-04",
    category: "Carbon",
    readingTime: "4 dəq",
    eyebrow: "CARBON RENT A CAR",
    intro:
      "Avtomobil kirayəsi sadəcə açarı götürüb yola çıxmaq deyil. Carbon-un məqsədi seçimdən avtomobilin qaytarılmasına qədər prosesi aydın və rahat saxlamaqdır.",
    sections: [
      {
        heading: "Rahatlıq ilk addımdan başlayır",
        paragraphs: [
          "Carbon Rent A Car müştərilərinə rahat, şəffaf və etibarlı avtomobil kirayəsi təcrübəsi təqdim etməyə çalışır.",
          "Avtomobillər müntəzəm texniki baxışdan keçirilir və müştəriyə təmiz, baxımlı vəziyyətdə təqdim olunmasına diqqət edilir.",
        ],
      },
      {
        heading: "Fərqli səfərlər üçün fərqli seçimlər",
        paragraphs: [
          "Gündəlik şəhər istifadəsi, işgüzar səfər, ailəvi səyahət və xüsusi günlər fərqli avtomobil ehtiyacları yaradır.",
          "Məqsəd yalnız geniş seçim təqdim etmək deyil, müştərinin səfərinə uyğun avtomobili daha asan tapmasına kömək etməkdir.",
        ],
        quote:
          "Premium xidmət mürəkkəb görünməməlidir. Əksinə, hər şeyi daha sadə hiss etdirməlidir.",
      },
      {
        heading: "Aydın şərtlər",
        paragraphs: [
          "Şəffaf qiymət siyasəti və əvvəlcədən izah olunan şərtlər müştərinin qərarını daha rahat verməsinə kömək edir.",
          "Rezervasiya zamanı əsas məlumatların aydın təqdim edilməsi sonradan yaranacaq sualları minimuma endirir.",
        ],
      },
      {
        heading: "Yenidən seçilməyin səbəbi",
        paragraphs: [
          "Uzunmüddətli etibar bir kirayə ilə qurulmur. Hər müraciətə diqqətli yanaşmaq və eyni xidmət standartını qorumaq əsas məqsədlərdən biridir.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedBlogPosts(slug: string) {
  return blogPosts.filter((post) => post.slug !== slug).slice(0, 3);
}

export function formatBlogDate(date: string) {
  const months = [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avqust",
    "sentyabr",
    "oktyabr",
    "noyabr",
    "dekabr",
  ];

  const [year, month, day] = date.split("-").map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}
