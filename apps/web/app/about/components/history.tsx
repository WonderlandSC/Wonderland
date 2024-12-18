import { Card, CardContent, CardHeader, CardTitle } from "@repo/design-system/components/ui/card"
import { BookOpen, Users, Lightbulb, Star, Rocket } from 'lucide-react'

export default function History() {
  const historyItems = [
    {
      title: "Началото",
      description: "През 2016 година, с мечти и вдъхновение създадохме Езиков център Уондърленд. Нашата мисия беше да изградим пространство, където децата не само да учат английски, но и да се развиват като личности.",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
    },
    {
      title: "Личен подход",
      description: "В Уондърленд вярваме в личния подход. Всеки ученик е уникален, с различни интереси и темпове на учене. Затова предлагаме индивидуализирани методи, които да събудят любознателността и интереса към езика. Чрез игри, проекти и интерактивни занимания, ние превръщаме ученето в забавление.",
      icon: <Users className="h-8 w-8 text-primary" />,
    },
    {
      title: "Иновативна методика",
      description: "Нашата иновативна методика не е просто новаторски подход към преподаването; тя е философия. Стремим се да развиваме умения за работа в екип, креативно мислене и самостоятелност. Децата не просто учат граматика и лексика, а създават свой нов свят, в който изразяват себе си и се учат да работят заедно.",
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
    },
    {
      title: "Нашият растеж",
      description: "С всяка изминала година Уондърленд расте и се развива, благодарение на положителната обратна връзка от децата и техните родители. Ние сме горди, че можем да бъдем част от пътя на нашите ученици, като ги вдъхновяваме да откриват нови светове чрез езика.",
      icon: <Star className="h-8 w-8 text-primary" />,
    },
    {
      title: "Нашето бъдеще",
      description: "Тази история е само началото. В Уондърленд продължаваме да мечтаем и да вдъхновяваме нашите ученици всеки ден. Защото в нашия вълшебен свят, учението е приключение!",
      icon: <Rocket className="h-8 w-8 text-primary" />,
    },
  ]

  return (
    <section className="py-12 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center  mb-8">Историята на Уондърленд</h2>
        <p className="text-center text-lg mb-12 max-w-3xl mx-auto ">
          Открийте историята на Уондърленд и нашия уникален подход към обучението по английски език.
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          {historyItems.slice(0, 4).map((item, index) => (
            <Card 
              key={index} 
              className={`
                transition-all duration-300 border border-purple-600 dark:border-cyan-600
                hover:-translate-y-1 hover:shadow-[4px_4px_rgba(147,51,234,0.3),8px_8px_rgba(147,51,234,0.2),12px_12px_rgba(147,51,234,0.1)]
                dark:hover:shadow-[4px_4px_rgba(8,145,178,0.3),8px_8px_rgba(8,145,178,0.2),12px_12px_rgba(8,145,178,0.1)]
              `}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                {item.icon}
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Card 
            key={4} 
            className={`
              transition-all duration-300 border border-purple-600 dark:border-cyan-600
              hover:-translate-y-1 hover:shadow-[4px_4px_rgba(147,51,234,0.3),8px_8px_rgba(147,51,234,0.2),12px_12px_rgba(147,51,234,0.1)]
              dark:hover:shadow-[4px_4px_rgba(8,145,178,0.3),8px_8px_rgba(8,145,178,0.2),12px_12px_rgba(8,145,178,0.1)]
              w-full lg:w-[calc(50%-1.5rem)] // Adjust width to match grid cards
            `}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              {historyItems[4].icon} {/* Accessing the fifth item directly */}
              <CardTitle>{historyItems[4].title}</CardTitle> {/* Accessing the fifth item directly */}
            </CardHeader>
            <CardContent>
              <p>{historyItems[4].description}</p> {/* Accessing the fifth item directly */}
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  )
}

