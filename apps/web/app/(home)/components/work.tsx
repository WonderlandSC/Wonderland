import { Card, CardContent, CardHeader, CardTitle } from "@repo/design-system/components/ui/card"
import { CheckCircle, ClipboardList, Clock, FileText, UserPlus, Users } from 'lucide-react'

export default function Work() {
  const steps = [
    {
      title: "Стъпка 1",
      description: "Провеждаме безплатен входящ тест на детето, за да определим най-подходящата група. Тестът ни помага да проверим нивото на владеене на езика.",
      icon: <ClipboardList className="h-8 w-8 text-primary" />,
    },
    {
      title: "Стъпка 2",
      description: "Регистриране на детето в нашата система, където то, както и вие, можете да следите прогреса му и да се възползвате от нашия дигитален бележник.",
      icon: <UserPlus className="h-8 w-8 text-primary" />,
    },
    {
      title: "Стъпка 3",
      description: "Работим с малки групи, съобразени с езиковото ниво и възрастта на всяко дете. Всяка група е създадена така,че да предлага оптимална среда за учене и развитие.",
      icon: <Users className="h-8 w-8 text-primary" />,
    },
    {   
      title: "Стъпка 4",
      description: "Предлагаме ви график, съобразен със смяната в училище и удобната за вас локация. Работим с висококвалифицирани преподаватели, които гарантират качествено обучение.",
      icon: <Clock className="h-8 w-8 text-primary" />,
    },
    {
      title: "Стъпка 5",
      description: "По време на обучението вие получавате редовна обратна връзка за прогреса на своето дете. Можете да наблюдавате прогреса на детето и в нашата дигитална система .",
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
    },
  {
    title: "Стъпка 6",
    description: "В края на курса всеки ученик получава сертификат, отразяващ постигнатите резултати през годината. Финалният доклад обобщава успехите му.",
    icon: <FileText className="h-8 w-8 text-primary" />,
  },
  ]

  return (
    <section className=" pb-12 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Как работим</h2>
        <p className="text-center text-lg mb-12 max-w-3xl mx-auto">
          С тези стъпки вашето дете ще стане част от нашата вълнуваща езикова приказка и ще открие магията на английския език!
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className={`
                transition-all duration-300 border border-purple-600 dark:border-cyan-600
                hover:-translate-y-1 hover:shadow-[4px_4px_rgba(147,51,234,0.3),8px_8px_rgba(147,51,234,0.2),12px_12px_rgba(147,51,234,0.1)]
                dark:hover:shadow-[4px_4px_rgba(8,145,178,0.3),8px_8px_rgba(8,145,178,0.2),12px_12px_rgba(8,145,178,0.1)]
              `}
              >
              <CardHeader className="flex flex-row items-center gap-4">
                {step.icon}
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

