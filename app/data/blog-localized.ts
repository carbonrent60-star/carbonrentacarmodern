import type { BlogPost } from "./blog";

export type BlogLocale = "az" | "en" | "ru";

type BlogOverride = Omit<BlogPost, "slug" | "image" | "images" | "date">;

const overrides: Record<Exclude<BlogLocale, "az">, Record<string, BlogOverride>> = {
  en: {
    "qiymet-ve-sigorta-maariflendirmesi": {
      title: "Pricing and Insurance: What to Check Before Renting",
      description:
        "A practical guide to insurance, deposits, daily rates and the details that make a rental agreement clear.",
      category: "Rental guide",
      readingTime: "6 min",
      eyebrow: "TRANSPARENCY · SAFETY",
      intro:
        "The daily price is only one part of a rental decision. Insurance, deposit rules and contract terms define how predictable the experience will feel from pickup to return.",
      sections: [
        {
          heading: "Look beyond the daily rate",
          paragraphs: [
            "A low daily price can look attractive, but it does not always show the full cost of the rental. Insurance coverage, deposit amount, mileage rules, delivery fees and late-return terms can change the final experience.",
            "Before choosing a car, compare what is included in the price. A slightly higher rate with clear insurance and responsive support can be more comfortable than the cheapest offer with unclear conditions.",
          ],
        },
        {
          heading: "Understand the insurance package",
          paragraphs: [
            "Ask which situations are covered, what the driver's responsibility is and which exclusions apply. This is especially important for parking scratches, minor damage, glass, tires and incidents caused by improper use.",
            "Good insurance terms should be explained before the car is handed over. When the rules are clear, both the customer and the rental company avoid stressful discussions at the end of the trip.",
          ],
          quote:
            "A good rental experience starts with clear terms, not only with a clean car.",
        },
        {
          heading: "How deposits usually work",
          paragraphs: [
            "A deposit is a temporary security amount held until the vehicle is returned. If the car is returned on time and according to the agreement, the deposit is released back to the customer.",
            "With card payments, the time it takes for the amount to appear again can depend on the bank. Ask about the deposit amount, payment method and release process before confirming the reservation.",
          ],
        },
        {
          heading: "Make the final comparison calmly",
          paragraphs: [
            "Review the daily rate together with insurance, deposit, fuel policy, mileage limits and extra services. This gives you a more honest picture of the real rental value.",
            "The most comfortable choice is the one where the price, responsibilities and support process are easy to understand before you start driving.",
          ],
        },
      ],
    },
    "ucuz-avtomobil-kirayesi-her-zaman-serfelidirmi": {
      title: "Is Cheap Car Rental Always the Best Deal?",
      description:
        "The hidden risks behind very low rental prices and what to check before making a decision.",
      category: "Advice",
      readingTime: "5 min",
      eyebrow: "PRICE · QUALITY",
      intro:
        "The lowest price is tempting, but in car rental the real value comes from the full service: vehicle condition, insurance, support and clear terms.",
      sections: [
        {
          heading: "What can be behind a cheap rate?",
          paragraphs: [
            "A very low price can sometimes mean limited insurance, an older vehicle, higher deposit, strict mileage rules or extra fees that appear later in the process.",
            "That does not mean every affordable offer is bad. It means the decision should be based on the complete package, not only on the number shown in an advertisement.",
          ],
        },
        {
          heading: "Service quality matters on the road",
          paragraphs: [
            "Clean interior, reliable tires, working lights, clear documents and responsive customer support all affect the comfort of your trip.",
            "If a problem happens on the road, fast support can be worth much more than a small saving on the daily rate.",
          ],
          quote:
            "The best value is not always the cheapest car; it is the most balanced rental experience for the money.",
        },
        {
          heading: "Questions to ask before booking",
          paragraphs: [
            "Check what is included in the price, how the deposit is handled, whether mileage is limited and what happens in case of delay.",
            "Also ask about fuel policy, extra driver rules, delivery options and insurance coverage. Clear answers help you avoid surprises later.",
          ],
        },
        {
          heading: "A balanced decision",
          paragraphs: [
            "A good rental choice brings together fair pricing, a well-maintained car, transparent conditions and support when needed.",
            "When these parts are aligned, the trip feels easier, even if the daily price is not the absolute lowest on the market.",
          ],
        },
      ],
    },
    "kiraye-meslehetleri": {
      title: "Car Rental Tips for a Smoother Trip",
      description:
        "A practical checklist for choosing a car, checking the handover, understanding insurance and planning the return.",
      category: "Rental guide",
      readingTime: "7 min",
      eyebrow: "PRACTICAL GUIDE",
      intro:
        "A few simple checks can turn car rental into a much more predictable experience. The goal is to know what you are taking, what is included and how the return will work.",
      sections: [
        {
          heading: "Choose the car around the trip",
          paragraphs: [
            "For city driving, a compact car or efficient sedan is often enough. For families, luggage, mountain roads or longer distances, a larger sedan, crossover or SUV may be more comfortable.",
            "Think about passengers, baggage, road type and the image you need. The right car is not always the most expensive one; it is the one that fits the plan.",
          ],
        },
        {
          heading: "Check the car at pickup",
          paragraphs: [
            "Walk around the vehicle, look at the bumpers, wheels, mirrors, lights and interior. Existing scratches or small damage should be noted before you leave.",
            "This check only takes a few minutes, but it protects both sides from confusion when the car is returned.",
          ],
          quote:
            "Five calm minutes at handover can prevent a long conversation at return.",
        },
        {
          heading: "Read the agreement as a guide",
          paragraphs: [
            "Insurance terms, deposit, fuel policy, mileage limit, return time and driver requirements should all be clear before the keys are handed over.",
            "If something is unclear, ask immediately. The best time to clarify a rental term is before the trip begins.",
          ],
        },
        {
          heading: "Plan around season and demand",
          paragraphs: [
            "During holidays, summer travel and wedding season, popular models can be booked earlier than expected.",
            "Early reservation gives you more choice, better timing and a higher chance of getting the exact class you need.",
          ],
        },
      ],
    },
    "seyahet-marsrutlari-ve-tovsiyeleri": {
      title: "Road Trip Routes and Travel Ideas in Azerbaijan",
      description:
        "Ideas for driving from Baku to Shamakhi, Gabala, Lahij, mountain villages and other routes with more freedom.",
      category: "Travel",
      readingTime: "8 min",
      eyebrow: "DISCOVER AZERBAIJAN",
      intro:
        "A car gives you the freedom to build the route at your own pace. From Baku to mountain villages, the best trips are often shaped by the stops between destinations.",
      sections: [
        {
          heading: "Baku to Shamakhi, Ismayilli and Gabala",
          paragraphs: [
            "This route is one of the most comfortable options for travelers who want changing landscapes without an overly complicated plan. The road gives you city exits, open views and calmer regional stops.",
            "You can split the trip with short breaks in Shamakhi or Ismayilli, try local food and continue to Gabala without rushing the day.",
          ],
          image:
            "https://framerusercontent.com/images/ZBNlcPsv9Y96Kjh6aqe3AwHyqw.png",
          imageAlt: "Road trip in Azerbaijan",
        },
        {
          heading: "Lahij and mountain directions",
          paragraphs: [
            "Lahij, Khinalig and Laza are attractive routes for travelers who enjoy mountain views, village streets and slower travel.",
            "Depending on weather and road conditions, a crossover or SUV can make these directions more comfortable. Always check the forecast before leaving Baku.",
          ],
          image:
            "https://framerusercontent.com/images/gKkDSeJGvHmAXpy9Ddrx379eLuw.png",
          imageAlt: "Mountain route in Azerbaijan",
        },
        {
          heading: "From the airport directly to the road",
          paragraphs: [
            "Picking up a rental car at or after arriving from the airport can be convenient for guests who do not want to depend on public transport or repeated taxi rides.",
            "This is especially useful when your trip includes several addresses, regional plans or flexible stops outside the city.",
          ],
          quote:
            "A good road trip is not always the shortest road; it is the road where you choose the stops yourself.",
        },
        {
          heading: "Before you leave",
          paragraphs: [
            "Plan fuel stops, check the route, keep time in reserve and make sure the vehicle class matches the direction.",
            "Mountain weather can change quickly, so a flexible schedule often makes the trip safer and more enjoyable.",
          ],
          image:
            "https://framerusercontent.com/images/pa2w2X0DZ97Vmh72rH85bUvwE.png",
          imageAlt: "Driving route planning",
        },
      ],
    },
    "avtomobil-baximi-ve-texniki-melumatlar": {
      title: "Car Care and Technical Checks Before a Trip",
      description:
        "Simple safety checks, tire awareness and driving habits that make a rental car feel more reliable.",
      category: "Cars",
      readingTime: "6 min",
      eyebrow: "TECHNICAL · SAFE",
      intro:
        "Vehicle condition affects comfort, fuel use and safety. Even when the rental company prepares the car, knowing the basics helps you drive with more confidence.",
      sections: [
        {
          heading: "Basic checks before departure",
          paragraphs: [
            "Lights, brakes, tires, mirrors and seat belts are the details worth checking before a long drive. They are simple, but they matter when the road gets busy or weather changes.",
            "If you notice anything unusual, contact the rental team before leaving. Early communication is always easier than solving a problem on the road.",
          ],
        },
        {
          heading: "Fuel efficiency starts with driving style",
          paragraphs: [
            "Smooth acceleration, steady speed and avoiding unnecessary hard braking can reduce fuel use and make the ride calmer.",
            "Correct tire pressure also supports better handling and efficiency. Tires are one of the most important parts of a safe rental experience.",
          ],
          quote:
            "Small attention before the trip can prevent a bigger problem on the road.",
        },
        {
          heading: "Why regular maintenance matters",
          paragraphs: [
            "A well-maintained rental fleet gives customers more predictable trips. Oil, brakes, suspension and electronic systems should be checked regularly.",
            "For the driver, the result is simple: the car feels stable, clean and ready for the journey it was booked for.",
          ],
        },
        {
          heading: "Return the car with the same care",
          paragraphs: [
            "Keep the interior tidy, follow the fuel policy and report any issue honestly. This keeps the return process quick and clear.",
            "Good communication protects your deposit and helps the next customer receive the car in the same standard.",
          ],
        },
      ],
    },
    "niye-carbon-rent-a-car-i-secirler": {
      title: "Why Customers Choose Carbon Rent A Car",
      description:
        "A clear rental process, well-kept cars, wide choice and a customer-focused approach in Baku.",
      category: "Carbon",
      readingTime: "5 min",
      eyebrow: "CARBON RENT A CAR",
      intro:
        "Car rental should not feel complicated. Carbon focuses on keeping the process clear from selection and reservation to pickup, support and return.",
      sections: [
        {
          heading: "Comfort starts before pickup",
          paragraphs: [
            "A smooth rental experience begins with clear information. Customers should understand the car, price, timing and conditions before the keys are handed over.",
            "Carbon aims to keep communication direct, so the customer knows what to expect at every stage.",
          ],
        },
        {
          heading: "Different trips need different cars",
          paragraphs: [
            "Daily city use, business meetings, family travel and special occasions all require different vehicles.",
            "The goal is not only to offer many cars, but to help customers choose the right one for their route, passengers and budget.",
          ],
          quote:
            "Premium service should not feel complicated; it should make the whole process simpler.",
        },
        {
          heading: "Transparent conditions",
          paragraphs: [
            "Clear pricing, explained deposits, insurance information and realistic timing reduce stress before and after the rental.",
            "When the process is transparent, customers can make decisions calmly and avoid unpleasant surprises.",
          ],
        },
        {
          heading: "The reason customers return",
          paragraphs: [
            "Trust is built through repeated consistency. Clean cars, fair terms and support when needed are the things customers remember.",
            "Carbon's service standard is focused on making each rental feel reliable, not only impressive at first glance.",
          ],
        },
      ],
    },
    "aeroport-transferi-yoxsa-kiraye-avtomobil": {
      title: "Airport Transfer or Rental Car in Baku?",
      description:
        "A practical comparison for choosing between a direct transfer and a rental car after arriving in Baku.",
      category: "Travel",
      readingTime: "6 min",
      eyebrow: "AIRPORT · CITY",
      intro:
        "One of the first decisions after landing is transport. A transfer can be perfect for a simple arrival, while a rental car can make the whole trip more flexible.",
      sections: [
        {
          heading: "Start with the purpose of the trip",
          paragraphs: [
            "If you have one hotel address and a short schedule, an airport transfer is often the easiest solution. You are met, driven to the destination and do not think about parking or navigation.",
            "If you will stay several days, visit multiple addresses or leave Baku, a rental car gives you more control over the day.",
          ],
        },
        {
          heading: "Compare the full budget",
          paragraphs: [
            "A transfer may be cheaper for one direction, but repeated city rides can add up quickly. A rental car gives a clearer daily structure when the plan includes several movements.",
            "Add fuel, parking, delivery and time comfort to the comparison. The right choice is about total convenience, not only one price.",
          ],
          quote: "The best option is the one that matches the rhythm of your trip.",
        },
        {
          heading: "Business and family trips are different",
          paragraphs: [
            "For business visits, timing and a quiet premium car may be more important. For family travel, luggage space and flexibility usually matter more.",
            "Choosing the right format early helps you avoid changing transport plans during the trip.",
          ],
        },
        {
          heading: "How Carbon helps",
          paragraphs: [
            "Share your schedule with the team and they can recommend a transfer, short rental or longer rental depending on the route.",
            "The aim is to make the journey easier. Sometimes one transfer is enough; sometimes having the keys changes the whole trip.",
          ],
        },
      ],
    },
    "bakidan-regionlara-avtomobille-planlama": {
      title: "Before Driving from Baku to the Regions",
      description:
        "Planning car class, timing, weather and route details for trips to Gabala, Shamakhi, Guba and beyond.",
      category: "Travel",
      readingTime: "7 min",
      eyebrow: "REGIONS · PLANNING",
      intro:
        "Driving from Baku to the regions gives you freedom, but a better plan makes the road calmer. Vehicle class, weather and timing should be decided before departure.",
      sections: [
        {
          heading: "Choose routes by road conditions",
          paragraphs: [
            "Roads toward Shamakhi, Ismayilli and Gabala can combine comfortable highways with more winding sections. The drive is pleasant when you leave enough time.",
            "For Guba, Gusar and mountain villages, season matters even more. Rain, snow or fog can change the pace of the trip.",
          ],
        },
        {
          heading: "Sedan, crossover or SUV?",
          paragraphs: [
            "For clear intercity routes, a sedan is often comfortable and efficient. It gives a calm ride and usually uses less fuel.",
            "For mountain directions, family luggage or rougher roads, a crossover or SUV may be a better fit.",
          ],
        },
        {
          heading: "Keep time in reserve",
          paragraphs: [
            "Maps show distance, but they do not always show meal stops, photo stops, weather delays or traffic near city exits.",
            "Plan the return time with a small buffer. It makes the end of the trip much less rushed.",
          ],
          quote:
            "A well-planned road means less hurry and more comfort.",
        },
        {
          heading: "Check before departure",
          paragraphs: [
            "Fuel, tires, lights, documents and contact numbers should be checked before leaving Baku.",
            "Tell the rental team your route when booking. It helps match the car and advice to the direction.",
          ],
        },
      ],
    },
    "toy-avtomobili-secerken-nelere-diqqet-etmeli": {
      title: "How to Choose a Wedding Car",
      description:
        "Style, comfort, timing and practical details to consider when booking a car for a wedding or photo session.",
      category: "Wedding cars",
      readingTime: "6 min",
      eyebrow: "SPECIAL DAY · SELECTION",
      intro:
        "A wedding car is not only a background for photos. It should match the schedule, clothing, route and atmosphere of the day.",
      sections: [
        {
          heading: "Match the car to the concept",
          paragraphs: [
            "Classic ceremonies often work well with elegant sedans and premium models. Modern minimal events may look better with calmer colors and clean design.",
            "The car's color, interior and shape matter in photos and video, so choose it as part of the visual plan.",
          ],
        },
        {
          heading: "Do not ignore comfort",
          paragraphs: [
            "Wedding clothes, accessories and long photo sessions make interior comfort important. Rear-seat space, door opening and air conditioning are practical details.",
            "A comfortable car reduces stress between locations and helps the schedule feel smoother.",
          ],
        },
        {
          heading: "Plan the timing clearly",
          paragraphs: [
            "Photo locations, ceremony address, restaurant and home route should be known in advance. Clear timing makes pricing and logistics easier.",
            "Weekend traffic can change the plan, so keeping extra time is a smart decision.",
          ],
          quote:
            "For a special day, the right car should look good and make the day easier.",
        },
        {
          heading: "Book earlier in wedding season",
          paragraphs: [
            "Popular models are reserved quickly during wedding season. Waiting until the last days can limit your options.",
            "Confirm the model, color, usage hours, route and any extra requests in advance for a calmer day.",
          ],
        },
      ],
    },
  },
  ru: {
    "qiymet-ve-sigorta-maariflendirmesi": {
      title: "Цена и страховка: что проверить перед арендой",
      description:
        "Практичный гид по страховке, депозиту, тарифам и условиям, которые делают аренду понятной.",
      category: "Гид по аренде",
      readingTime: "6 мин",
      eyebrow: "ПРОЗРАЧНОСТЬ · БЕЗОПАСНОСТЬ",
      intro:
        "Дневная цена — только часть решения. Страховка, депозит и условия договора определяют, насколько спокойно пройдет аренда от получения до возврата.",
      sections: [
        {
          heading: "Смотрите шире дневного тарифа",
          paragraphs: [
            "Низкая дневная цена может выглядеть привлекательно, но она не всегда показывает полную стоимость аренды. Страховка, депозит, лимит пробега, доставка и условия опоздания могут изменить итоговое впечатление.",
            "Перед выбором автомобиля сравните, что входит в цену. Немного более высокий тариф с понятной страховкой и поддержкой часто комфортнее самого дешевого предложения с неясными правилами.",
          ],
        },
        {
          heading: "Разберитесь со страховкой заранее",
          paragraphs: [
            "Уточните, какие случаи покрываются, какая ответственность остается за водителем и какие исключения действуют. Это важно для мелких повреждений, стекол, шин и ситуаций при неправильной эксплуатации.",
            "Хорошие условия должны быть объяснены до передачи автомобиля. Когда правила ясны, возврат проходит спокойнее для обеих сторон.",
          ],
          quote:
            "Хорошая аренда начинается не только с чистого автомобиля, а с понятных условий.",
        },
        {
          heading: "Как обычно работает депозит",
          paragraphs: [
            "Депозит — временная гарантийная сумма до возврата автомобиля. Если автомобиль возвращен вовремя и по договору, депозит разблокируется или возвращается клиенту.",
            "При оплате картой срок отображения суммы зависит от банка. Перед бронированием лучше уточнить размер депозита, способ оплаты и порядок возврата.",
          ],
        },
        {
          heading: "Сравнивайте спокойно",
          paragraphs: [
            "Оценивайте дневной тариф вместе со страховкой, депозитом, топливной политикой, пробегом и дополнительными услугами.",
            "Самый комфортный выбор — тот, где цена, ответственность и поддержка понятны еще до начала поездки.",
          ],
        },
      ],
    },
    "ucuz-avtomobil-kirayesi-her-zaman-serfelidirmi": {
      title: "Всегда ли дешевая аренда выгодна?",
      description:
        "Скрытые риски очень низких цен и вопросы, которые стоит задать перед бронированием.",
      category: "Советы",
      readingTime: "5 мин",
      eyebrow: "ЦЕНА · КАЧЕСТВО",
      intro:
        "Самая низкая цена привлекает, но реальная ценность аренды складывается из состояния автомобиля, страховки, поддержки и ясных условий.",
      sections: [
        {
          heading: "Что может скрываться за низким тарифом",
          paragraphs: [
            "Очень низкая цена иногда означает ограниченную страховку, старый автомобиль, высокий депозит, строгий лимит пробега или дополнительные платежи позже.",
            "Это не значит, что доступное предложение всегда плохое. Просто решение должно приниматься по полному пакету, а не только по рекламной цифре.",
          ],
        },
        {
          heading: "Качество сервиса важно в дороге",
          paragraphs: [
            "Чистый салон, исправные шины, рабочие фары, понятные документы и быстрая поддержка влияют на комфорт поездки.",
            "Если в дороге возникнет вопрос, оперативная помощь может оказаться важнее небольшой экономии на дневном тарифе.",
          ],
          quote:
            "Лучшая ценность — не самый дешевый автомобиль, а самый сбалансированный опыт за свои деньги.",
        },
        {
          heading: "Что спросить до бронирования",
          paragraphs: [
            "Уточните, что входит в цену, как работает депозит, есть ли лимит пробега и что происходит при задержке возврата.",
            "Также спросите о топливе, дополнительном водителе, доставке и страховом покрытии. Ясные ответы защищают от сюрпризов.",
          ],
        },
        {
          heading: "Сбалансированное решение",
          paragraphs: [
            "Хорошая аренда соединяет честную цену, ухоженный автомобиль, прозрачные условия и поддержку при необходимости.",
            "Когда эти части совпадают, поездка ощущается легче, даже если цена не самая низкая на рынке.",
          ],
        },
      ],
    },
    "kiraye-meslehetleri": {
      title: "Советы по аренде автомобиля для спокойной поездки",
      description:
        "Практичный чек-лист по выбору автомобиля, проверке при выдаче, страховке и возврату.",
      category: "Гид по аренде",
      readingTime: "7 мин",
      eyebrow: "ПРАКТИЧНЫЙ ГИД",
      intro:
        "Несколько простых проверок делают аренду намного предсказуемее. Важно понимать, какой автомобиль вы берете, что включено и как пройдет возврат.",
      sections: [
        {
          heading: "Выбирайте автомобиль под поездку",
          paragraphs: [
            "Для города часто достаточно компактного автомобиля или экономичного седана. Для семьи, багажа, горных дорог и дальних направлений удобнее седан побольше, кроссовер или SUV.",
            "Учитывайте пассажиров, багаж, тип дороги и нужный уровень презентабельности. Правильный автомобиль — не всегда самый дорогой, а тот, который подходит плану.",
          ],
        },
        {
          heading: "Проверьте автомобиль при получении",
          paragraphs: [
            "Осмотрите кузов, бамперы, диски, зеркала, фары и салон. Существующие царапины и мелкие повреждения лучше зафиксировать до выезда.",
            "Такая проверка занимает несколько минут, но защищает обе стороны от недопонимания при возврате.",
          ],
          quote:
            "Пять спокойных минут при выдаче могут заменить долгий разговор при возврате.",
        },
        {
          heading: "Читайте договор как инструкцию",
          paragraphs: [
            "Страховка, депозит, топливная политика, лимит пробега, время возврата и требования к водителю должны быть понятны заранее.",
            "Если что-то неясно, спросите сразу. Лучшее время уточнить условие — до начала поездки.",
          ],
        },
        {
          heading: "Учитывайте сезон и спрос",
          paragraphs: [
            "В праздники, летом и в свадебный сезон популярные модели бронируют раньше обычного.",
            "Раннее бронирование дает больше выбора, удобное время и более высокий шанс получить нужный класс автомобиля.",
          ],
        },
      ],
    },
    "seyahet-marsrutlari-ve-tovsiyeleri": {
      title: "Маршруты и идеи для автопутешествий по Азербайджану",
      description:
        "Идеи поездок из Баку в Шамахы, Габалу, Лагич, горные села и другие направления.",
      category: "Путешествия",
      readingTime: "8 мин",
      eyebrow: "ОТКРОЙТЕ АЗЕРБАЙДЖАН",
      intro:
        "Автомобиль дает свободу строить маршрут в своем темпе. От Баку до горных сел лучшие поездки часто складываются из остановок между точками.",
      sections: [
        {
          heading: "Баку — Шамахы — Исмаиллы — Габала",
          paragraphs: [
            "Этот маршрут удобен для тех, кто хочет увидеть меняющиеся пейзажи без слишком сложной логистики. Дорога сочетает выезд из города, открытые виды и спокойные остановки.",
            "По пути можно остановиться в Шамахы или Исмаиллы, попробовать местную кухню и продолжить в Габалу без спешки.",
          ],
          image:
            "https://framerusercontent.com/images/ZBNlcPsv9Y96Kjh6aqe3AwHyqw.png",
          imageAlt: "Автопутешествие по Азербайджану",
        },
        {
          heading: "Лагич и горные направления",
          paragraphs: [
            "Лагич, Хыналыг и Лаза подходят тем, кто любит горные виды, деревенские улицы и более спокойный ритм.",
            "В зависимости от погоды и состояния дорог кроссовер или SUV могут быть комфортнее. Перед выездом стоит проверить прогноз.",
          ],
          image:
            "https://framerusercontent.com/images/gKkDSeJGvHmAXpy9Ddrx379eLuw.png",
          imageAlt: "Горный маршрут в Азербайджане",
        },
        {
          heading: "Из аэропорта сразу в дорогу",
          paragraphs: [
            "Аренда автомобиля после прилета удобна для гостей, которые не хотят зависеть от общественного транспорта или постоянных такси.",
            "Это особенно полезно, если в плане несколько адресов, поездки в регионы или гибкие остановки за городом.",
          ],
          quote:
            "Хороший road trip — не всегда самый короткий путь, а путь, где вы сами выбираете остановки.",
        },
        {
          heading: "Перед выездом",
          paragraphs: [
            "Запланируйте заправки, проверьте маршрут, оставьте запас времени и убедитесь, что класс автомобиля подходит направлению.",
            "В горах погода меняется быстро, поэтому гибкий график делает поездку безопаснее и приятнее.",
          ],
          image:
            "https://framerusercontent.com/images/pa2w2X0DZ97Vmh72rH85bUvwE.png",
          imageAlt: "Планирование маршрута на автомобиле",
        },
      ],
    },
    "avtomobil-baximi-ve-texniki-melumatlar": {
      title: "Уход за автомобилем и проверки перед поездкой",
      description:
        "Простые проверки безопасности, шин и привычек вождения для более уверенной поездки.",
      category: "Автомобили",
      readingTime: "6 мин",
      eyebrow: "ТЕХНИКА · БЕЗОПАСНОСТЬ",
      intro:
        "Состояние автомобиля влияет на комфорт, расход топлива и безопасность. Даже если компания готовит машину, базовые знания помогают ехать увереннее.",
      sections: [
        {
          heading: "Основные проверки перед выездом",
          paragraphs: [
            "Фары, тормоза, шины, зеркала и ремни безопасности стоит проверить перед дальней дорогой. Это простые детали, но они важны в плотном движении и при смене погоды.",
            "Если заметили что-то необычное, лучше связаться с командой до выезда. Раннее сообщение всегда проще, чем решение вопроса в дороге.",
          ],
        },
        {
          heading: "Экономия топлива начинается со стиля езды",
          paragraphs: [
            "Плавный разгон, стабильная скорость и отказ от резких торможений помогают снизить расход и делают поездку спокойнее.",
            "Правильное давление в шинах также влияет на управляемость и эффективность. Шины — один из ключевых элементов безопасной аренды.",
          ],
          quote:
            "Небольшое внимание перед поездкой может предотвратить большую проблему в дороге.",
        },
        {
          heading: "Почему важен регулярный сервис",
          paragraphs: [
            "Ухоженный парк дает клиентам более предсказуемые поездки. Масло, тормоза, подвеска и электронные системы должны проверяться регулярно.",
            "Для водителя результат прост: автомобиль ощущается стабильным, чистым и готовым к маршруту.",
          ],
        },
        {
          heading: "Возвращайте автомобиль так же аккуратно",
          paragraphs: [
            "Сохраняйте салон чистым, соблюдайте топливную политику и честно сообщайте о любых вопросах. Так возврат проходит быстрее и понятнее.",
            "Хорошая коммуникация защищает депозит и помогает следующему клиенту получить автомобиль в таком же стандарте.",
          ],
        },
      ],
    },
    "niye-carbon-rent-a-car-i-secirler": {
      title: "Почему выбирают Carbon Rent A Car",
      description:
        "Понятный процесс аренды, ухоженные автомобили, широкий выбор и клиентоориентированный подход в Баку.",
      category: "Carbon",
      readingTime: "5 мин",
      eyebrow: "CARBON RENT A CAR",
      intro:
        "Аренда автомобиля не должна быть сложной. Carbon старается сохранять процесс понятным от выбора и бронирования до выдачи, поддержки и возврата.",
      sections: [
        {
          heading: "Комфорт начинается до выдачи",
          paragraphs: [
            "Хорошая аренда начинается с ясной информации. Клиент должен понимать автомобиль, цену, время и условия до получения ключей.",
            "Carbon стремится к прямой коммуникации, чтобы на каждом этапе было понятно, чего ожидать.",
          ],
        },
        {
          heading: "Разным поездкам нужны разные автомобили",
          paragraphs: [
            "Городские дела, бизнес-встречи, семейные поездки и особые события требуют разных автомобилей.",
            "Цель не только в большом выборе, а в помощи клиенту подобрать автомобиль под маршрут, пассажиров и бюджет.",
          ],
          quote:
            "Премиальный сервис не должен казаться сложным; он должен делать процесс проще.",
        },
        {
          heading: "Прозрачные условия",
          paragraphs: [
            "Понятные цены, объясненный депозит, информация о страховке и реалистичные сроки уменьшают стресс до и после аренды.",
            "Когда процесс прозрачен, клиент принимает решение спокойно и без неприятных сюрпризов.",
          ],
        },
        {
          heading: "Почему клиенты возвращаются",
          paragraphs: [
            "Доверие строится на стабильности. Чистые автомобили, честные условия и поддержка в нужный момент запоминаются лучше всего.",
            "Стандарт Carbon направлен на то, чтобы каждая аренда была надежной, а не только эффектной на первый взгляд.",
          ],
        },
      ],
    },
    "aeroport-transferi-yoxsa-kiraye-avtomobil": {
      title: "Трансфер из аэропорта или аренда авто в Баку?",
      description:
        "Практичное сравнение трансфера и аренды автомобиля после прилета в Баку.",
      category: "Путешествия",
      readingTime: "6 мин",
      eyebrow: "АЭРОПОРТ · ГОРОД",
      intro:
        "После прилета один из первых вопросов — транспорт. Трансфер удобен для простого прибытия, а аренда автомобиля делает всю поездку гибче.",
      sections: [
        {
          heading: "Начните с цели поездки",
          paragraphs: [
            "Если у вас один адрес отеля и короткий график, трансфер часто самый простой вариант. Вас встречают, отвозят по адресу, и вы не думаете о парковке или навигации.",
            "Если вы остаетесь на несколько дней, едете по разным адресам или выезжаете из Баку, аренда автомобиля дает больше контроля над днем.",
          ],
        },
        {
          heading: "Сравнивайте весь бюджет",
          paragraphs: [
            "Трансфер может быть дешевле для одного направления, но частые поездки по городу быстро складываются. Аренда дает понятную дневную структуру при активном плане.",
            "Добавьте в сравнение топливо, парковку, доставку и экономию времени. Правильный выбор — про общую удобность, а не одну цену.",
          ],
          quote: "Лучший вариант — тот, который совпадает с ритмом поездки.",
        },
        {
          heading: "Бизнес и семейная поездка отличаются",
          paragraphs: [
            "Для деловой поездки важны время и спокойный премиальный автомобиль. Для семьи чаще важнее багаж, простор и гибкость.",
            "Если выбрать формат заранее, не придется менять транспортный план уже во время поездки.",
          ],
        },
        {
          heading: "Как помогает Carbon",
          paragraphs: [
            "Поделитесь графиком с командой, и вам подскажут трансфер, короткую аренду или более длительный вариант под маршрут.",
            "Цель — упростить поездку. Иногда достаточно одного трансфера, а иногда ключи от автомобиля меняют весь план.",
          ],
        },
      ],
    },
    "bakidan-regionlara-avtomobille-planlama": {
      title: "Перед поездкой из Баку в регионы",
      description:
        "Планирование класса автомобиля, времени, погоды и маршрута для поездок в Габалу, Шамахы, Губу и дальше.",
      category: "Путешествия",
      readingTime: "7 мин",
      eyebrow: "РЕГИОНЫ · ПЛАН",
      intro:
        "Поездка из Баку в регионы дает свободу, но хороший план делает дорогу спокойнее. Класс автомобиля, погоду и время лучше определить заранее.",
      sections: [
        {
          heading: "Выбирайте маршрут по условиям дороги",
          paragraphs: [
            "Дороги в сторону Шамахы, Исмаиллы и Габалы могут сочетать удобные трассы и более извилистые участки. Поездка приятнее, когда есть запас времени.",
            "Для Губы, Гусара и горных сел сезон особенно важен. Дождь, снег или туман могут изменить темп поездки.",
          ],
        },
        {
          heading: "Седан, кроссовер или SUV?",
          paragraphs: [
            "Для понятных междугородних маршрутов седан часто удобен и экономичен. Он дает спокойную поездку и обычно расходует меньше топлива.",
            "Для горных направлений, семейного багажа или более сложных дорог кроссовер или SUV могут подойти лучше.",
          ],
        },
        {
          heading: "Оставляйте запас времени",
          paragraphs: [
            "Карты показывают расстояние, но не всегда учитывают остановки, обед, погоду или пробки на выезде из города.",
            "Планируйте возврат с небольшим запасом. Так конец поездки будет спокойнее.",
          ],
          quote:
            "Хорошо спланированная дорога означает меньше спешки и больше комфорта.",
        },
        {
          heading: "Проверьте перед выездом",
          paragraphs: [
            "Топливо, шины, фары, документы и контактные номера стоит проверить до выезда из Баку.",
            "Сообщите команде маршрут при бронировании. Это помогает подобрать автомобиль и рекомендации под направление.",
          ],
        },
      ],
    },
    "toy-avtomobili-secerken-nelere-diqqet-etmeli": {
      title: "Как выбрать свадебный автомобиль",
      description:
        "Стиль, комфорт, тайминг и практичные детали при бронировании автомобиля для свадьбы или фотосессии.",
      category: "Свадебные автомобили",
      readingTime: "6 мин",
      eyebrow: "ОСОБЫЙ ДЕНЬ · ВЫБОР",
      intro:
        "Свадебный автомобиль — не только фон для фотографий. Он должен соответствовать графику, одежде, маршруту и атмосфере дня.",
      sections: [
        {
          heading: "Подберите автомобиль под концепт",
          paragraphs: [
            "Для классической церемонии часто подходят элегантные седаны и премиальные модели. Для современного минималистичного события лучше смотрятся спокойные цвета и чистый дизайн.",
            "Цвет, салон и силуэт автомобиля важны на фото и видео, поэтому выбирать его стоит как часть визуального плана.",
          ],
        },
        {
          heading: "Не забывайте о комфорте",
          paragraphs: [
            "Свадебная одежда, аксессуары и длинная фотосессия делают комфорт салона важным. Пространство сзади, открытие дверей и кондиционер — практичные детали.",
            "Удобный автомобиль снижает стресс между локациями и помогает графику идти спокойнее.",
          ],
        },
        {
          heading: "Планируйте время точно",
          paragraphs: [
            "Локации фотосессии, адрес церемонии, ресторан и домашний маршрут лучше определить заранее. Понятный тайминг упрощает цену и логистику.",
            "Трафик в выходные может изменить план, поэтому запас времени — разумное решение.",
          ],
          quote:
            "Для особого дня правильный автомобиль должен красиво выглядеть и упрощать день.",
        },
        {
          heading: "Бронируйте заранее в свадебный сезон",
          paragraphs: [
            "Популярные модели быстро бронируют в свадебный сезон. Если ждать до последних дней, выбор может стать ограниченным.",
            "Заранее подтвердите модель, цвет, часы использования, маршрут и дополнительные пожелания.",
          ],
        },
      ],
    },
  },
};

export const blogUi = {
  az: {
    all: "Hamısı",
    category: "Kateqoriya",
    title1: "Yol üçün",
    title2: "daha yaxşı fikirlər.",
    intro:
      "Avtomobil, səyahət, sığorta və düzgün seçim haqqında qısa, praktik bələdçilər.",
    featured: "Seçilmiş məqalə",
    posts: "yazı",
    latest: "Son yazılar",
    startReading: "Oxumağa başla",
    read: "Oxu",
    enough: "Oxumaq kifayətdir.",
    goNow: "İndi yola çıx.",
    viewCars: "Avtomobillərə bax",
    article: "MƏQALƏ",
    continue: "DAVAM ET",
    nextRead: "Növbəti oxu.",
    allArticles: "Bütün məqalələr",
    journal: "Journal",
  },
  en: {
    all: "All",
    category: "Category",
    title1: "Better ideas",
    title2: "for the road.",
    intro:
      "Practical guides about cars, travel, insurance and choosing the right rental.",
    featured: "Featured article",
    posts: "posts",
    latest: "Latest stories",
    startReading: "Start reading",
    read: "Read",
    enough: "Enough reading.",
    goNow: "Now choose the road.",
    viewCars: "View cars",
    article: "ARTICLE",
    continue: "CONTINUE",
    nextRead: "Read next.",
    allArticles: "All articles",
    journal: "Journal",
  },
  ru: {
    all: "Все",
    category: "Категория",
    title1: "Больше пользы",
    title2: "для дороги.",
    intro:
      "Практичные материалы об автомобилях, поездках, страховке и правильном выборе аренды.",
    featured: "Избранная статья",
    posts: "статей",
    latest: "Последние материалы",
    startReading: "Начать читать",
    read: "Читать",
    enough: "Достаточно чтения.",
    goNow: "Теперь пора в путь.",
    viewCars: "Смотреть авто",
    article: "СТАТЬЯ",
    continue: "ПРОДОЛЖИТЬ",
    nextRead: "Читайте дальше.",
    allArticles: "Все статьи",
    journal: "Журнал",
  },
} as const;

export function localizeBlogPost(post: BlogPost, locale: BlogLocale): BlogPost {
  if (locale === "az") return post;

  const override = overrides[locale][post.slug];
  if (!override) return post;

  return {
    ...post,
    ...override,
    image: post.image,
    images: post.images,
    date: post.date,
    slug: post.slug,
  };
}

export function localizeBlogPosts(posts: BlogPost[], locale: BlogLocale) {
  return posts.map((post) => localizeBlogPost(post, locale));
}

export function formatLocalizedBlogDate(date: string, locale: BlogLocale) {
  const intlLocale =
    locale === "ru" ? "ru-RU" : locale === "en" ? "en-US" : "az-AZ";

  return new Intl.DateTimeFormat(intlLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}
