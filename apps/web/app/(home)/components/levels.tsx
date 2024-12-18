import { Card, CardContent, CardHeader, CardTitle } from "@repo/design-system/components/ui/card"
import { Badge } from "@repo/design-system/components/ui/badge"

type Level = {
  name: string
  title: string
  description: string
  isGrowUp: boolean
  notaBene?: string
}

const levels: Level[] = [
  {
    name: "Hop 1",
    title: "Beginner",
    description: "Това ниво е подходящо за начинаещи деца от 1 до 3 клас. Работим по системата \"Power Up Start Smart\", както и, авторското ни помагало - \"Dive into the alphabet\". През първия учебен срок започваме паралелна работа по началното писмено ограмотяване на децата и развитие на умението за слушане с разбиране. През тази учебна година вашето дете ще се научи да представя себе си и семейството си накратко, цветовете, някои основни храни и форми, емоции и играчки. Ще може да разказва за дома си, за нещата, които обича, частите на тялото, дрехи, животни и други. Ще се запознае с основни граматически конструкции, като have got, can, like и други.",
    isGrowUp: false
  },
  {
    name: "Hop 2",
    title: "Pre A1",
    description: "Това ниво е подходящо за деца 2 и 3 клас. Използваме системата \"Power Up 1\". В това ниво, вашето дете ще научи основните предлози, спомагателния глагол to be, have got/has got-haven't got/hasn't got, притежателни прилагателни, сегашно продължително време и сегашно просто време. Ще обогати своя речник с нови думи, които описват техния дом, как се чувстват, какво правят през свободното си време, както и основна лексика свързана с училището.",
    isGrowUp: false,
    notaBene: "В края на учебната година, детето ви ще има възможността да се яви на изпит за първия детски сертификат на Cambridge University - Starters."
  },
  {
    name: "Hop 3",
    title: "A1",
    description: "Това ниво е подходящо за деца от 3 до 5 клас. Използваме системата \"Power Up 2\". Децата разширяват своите знания, като към познатите Present Simple & Present Continuous, добавяне разликата между двете времена и въвеждаме Past Simple. Освен това, ще научат сравнителна и превъзходна форма на прилагателните. Лексикалните теми се обогатяват и вашето дете може да говори на английски за местата в града и за различните професии. А, ако го попитате колко е часа? То, ще може да ви отвори. В това ниво децата започват да пишат съчинения самостоятелно.",
    isGrowUp: false,
    notaBene: "В края на учебната година, детето ви ще има възможността да се яви на изпит за втория детски сертификат на Cambridge University - Movers."
  },
  {
    name: "Hop 4",
    title: "A2.1",
    description: "Това ниво е подходящо за деца 4 и 5 клас. Използваме системата \"Power Up 3\". Въвежда се Zero Conditional , неправителните глаголи, както и по-специфична лексика. Децата могат самостоятелно да пишат текст до 110 думи.",
    isGrowUp: false,
    notaBene: "В края на учебната година, детето ви ще има възможността да се яви на изпит за последния детски сертификат на Cambridge University - Flyers."
  },
  {
    name: "Grow Up 1",
    title: "A1",
    description: "Това ниво е подходящо за начинаещи ученици от 4 до 6 клас. Работи се по системата \"Eyes Open 1\". Тя е разботена съвзместно с \"Discovery Channel\", която я прави изключително интересна за учениците. Усвояват напълно стандартното езиково ниво А1. Основните граматически времена са Present Simple, Present Continuous и Past Simple. Разширяват лексиката си с над 250 нови думи.",
    isGrowUp: true
  },
  {
    name: "Grow Up 2",
    title: "A2",
    description: "Това ниво е подходящо за деца от 5 до 7 клас. Работи се по системата \"Eyes Open 2\". Новите граматически времена, които се въвеждат са Past Continuous, First Conditional, Present Perfect, както и Future Tenses. Децата пишат съчинения до 120 думи, свободен текст. Приблизителната нова лексика е 250 думи.",
    isGrowUp: true,
    notaBene: "В края на учебната година, децата могат да се явят на първия тийнейджърски сертификат на Cambridge University - KET (Key English Test)."
  },
  {
    name: "Grow Up 3",
    title: "B1.1",
    description: "Това ниво е подходящо за деца от 6 до 8 клас. Работи се по системата \"Eyes Open 3\". В това ниво, знанията на децата са задълбочени позволявайки им да разговарят свободно по множество теми, да изказват и защитават мнение, да пишат съчинения до 130 думи по теми като, оцеляване в дивата природа, страхове и суеверия, изкуство, култура и екология.",
    isGrowUp: true
  },
  {
    name: "Grow Up 4",
    title: "B1.2",
    description: "Това ниво е подходящо за деца 7 и 8 клас. Работи се по системата \"Eyes Open 4\". В това ниво учениците говорят свободно английски език, което им позволява да дебатират по различни въпроси на социална тематика. Запознават се с основните правила за писане на есе, статия, както и официални и неофициални писма.",
    isGrowUp: true,
    notaBene: "В края на учебната година, децата могат да се явят на втория тийнейджърски сертификат на Cambridge University - PET (Preliminary English Test), който им позволява да кандидатстват в гимназии и колежи извън страната."
  },
  {
    name: "Grow Up 5",
    title: "B2.1",
    description: "Това ниво е подходящо за гимназисти. Работи се по системата \"Prepare\". В това ниво се поставят основите за подготовна за явяване на първия сертификат за възрастни - FC (основа за учене на по-сложни структури и за участие в професионални и/или академични среди).",
    isGrowUp: true,
    notaBene: "Ниво B2 се изучава в 2 учебни години, предвид обема на материала."
  },
  {
    name: "Grow Up 6",
    title: "B2.2",
    description: "Продължение на B2.1. Това ниво е подходящо за гимназисти. Работи се по системата \"Prepare\". В това ниво се поставят основите за подготовна за явяване на първия сертификат за възрастни - FC (основа за учене на по-сложни структури и за участие в професионални и/или академични среди).",
    isGrowUp: true,
    notaBene: "Ниво B2 се изучава в 2 учебни години, предвид обема на материала."
  }
]

export default function Levels() {
  return (
    <section className="py-12 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Нива в Уондърленд</h2>
        <p className="text-center text-lg mb-12 max-w-3xl mx-auto">
          Информация за нивата в Уондърленд спрямо общоевропейската езикова рамка.
        </p>
        <div className="gap-8 grid grid-cols-1 lg:grid-cols-2 ">
          {levels.map((level, index) => (
            <Card 
              key={index} 
              className={`
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-[4px_4px_rgba(8,145,178,0.3),8px_8px_rgba(8,145,178,0.2),12px_12px_rgba(8,145,178,0.1)]
                ${level.isGrowUp 
                  ? 'border border-cyan-600 hover:shadow-[4px_4px_rgba(8,145,178,0.3),8px_8px_rgba(8,145,178,0.2),12px_12px_rgba(8,145,178,0.1)]' 
                  : 'border border-purple-600 hover:shadow-[4px_4px_rgba(147,51,234,0.3),8px_8px_rgba(147,51,234,0.2),12px_12px_rgba(147,51,234,0.1)]'
                }
              `}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    {level.name}: {level.title}
                  </CardTitle>
                  <Badge variant={level.isGrowUp ? "secondary" : "default"} className={`${level.isGrowUp ? 'bg-cyan-600' : 'bg-purple-600'} text-white`}>
                    {level.isGrowUp ? 'Grow Up' : 'HOP'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className=" mb-4">{level.description}</p>
                {level.notaBene && (
                  <p className="text-sm inline-block italic text-gray-700 dark:text-gray-300 mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                    {level.notaBene}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
