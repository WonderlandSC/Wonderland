'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/design-system/components/ui//tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/design-system/components/ui/card"

const activities = [
  {
    id: "uvodni-chasove",
    title: "Уводни часове",
    content: "Учебната година в Уондърленд стартира на 15 септември, с уводни часове. По време на тези занятия, децата работят без учебници и преговарят наученото до сега. Най-малките ни ученици се запознават и адаптират към новата среда."
  },
  {
    id: "keymbridge-podgotovka",
    title: "Кеймбридж Подготовка",
    content: "Уондърленд предлага на своите ученици безплатна подготовка за детските и тийнеджърските сертифкати на Кеймбдирфж (Starters, Movers, Flyers, KET, PET). Подготовката се случва в седмицата непосредствено преди изпита."
  },
  {
    id: "lyatna-zanimalnya",
    title: "Лятна занималня",
    content: "Нашата лятна занималня се провежда през месеците юни и юли. Заниманията са всеки делничен ден от 8:30ч до 17:30ч. Занималнята включва тематични уроци по английски език подходящи за деца от 1 до 4 клас, всекидневни творчески дейности, игри на открито, разходки сред природата и посещения на музеи и забележителности в града."
  },
  {
    id: "proletna-zanimalnya",
    title: "Пролетна занималня",
    content: "Пролетна занималня на Уондърленд се провежда през пролетната ваканция. Заниманията са всеки делничен ден от 8:30ч до 17:30ч. Тя включва тематични уроци по английски език подходящи за деца от 1 до 4 клас, всекидневни творчески дейности, игри на открито и посещения на музеи и забележителности в града."
  },
  {
    id: "leten-lager",
    title: "Летен лагер",
    content: `Летният лагер в Уондърленд предлага на децата уникална възможност за приключения и забавления сред природата. Пет нощувки в планината, на различна локация всяка година. Без телевизия и телефони, децата се откъсват от ежедневието и се потапят в нова среда.

    Избираме хотел с басейн и място за спорт на открито, където децата могат да се наслаждават на активни игри и забавления. Дневната програма включва творчески занимания, английски език и образователни игри, свързани с актуални теми. Заниманията по английски език позволяват на децата да учат в неформална обстановка, като същевременно развиват езиковите си умения.
    
    Времето на открито дава възможност на децата да учат за природата, екосистемите и важността на опазването на околната среда. Чрез активности навън децата развиват независимост и самостоятелност, разбиране и уважение към природата. 
    
    Вечерните програми са разнообразни и позволяват на децата да проявят творчество и знания. Лагерният огън е незабравим момент. Около него децата разказват любимите истории и споделят преживявания и впечатления. 
    
    Летният лагер в Уондърленд създава уникални спомени и нови приятелства.`
  }
]

export default function Activities() {
  return (
    <section className="py-12 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Извънкласни дейности</h2>
        <Tabs defaultValue="uvodni-chasove" className="w-full">
          <TabsList className="h-auto flex-wrap justify-start mb-8 ">
            {activities.map((activity) => (
              <TabsTrigger key={activity.id} value={activity.id} className="text-sm md:text-base ">
                {activity.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {activities.map((activity) => (
            <TabsContent key={activity.id} value={activity.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{activity.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base whitespace-pre-line">
                    {activity.content}
                  </CardDescription>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
