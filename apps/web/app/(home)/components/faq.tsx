import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/design-system/components/ui/accordion';
import { Button } from '@repo/design-system/components/ui/button';
import { PhoneCall } from 'lucide-react';
import Link from 'next/link';

const faqItems = [
  {
    question: "Как се определя езиковото ниво на детето преди курса?",
    answer: "След предварителна уговорка се насрочва ден и час, в удобна за вас локация, за тест за определяне нивото на владеене на английски език. Тестът е безплатен и не ви ангажира със записване."
  },
  {
    question: "Как мога да запиша детето си?",
    answer: "Линк към стъпките!"
  },
  {
    question: "На каква възраст са най-малките ученици?",
    answer: "Най-малките ученици в Уондърленд са 1 клас."
  },
  {
    question: "Колко пъти седмично се провеждат занятията в Уондърленд?",
    answer: "Два пъти седмично, по два или два и половина учебни часа в зависимост от нивото на детето."
  },
  {
    question: "Каква продължителност са занятията?",
    answer: "Занятията са от 1.10 до 31.05, два пъти седмично, по два или два и половина учебни часа в зависимост от нивото на детето."
  },
  {
    question: "Какво се случва, когато детето отсъства?",
    answer: "При отсъствие на детето по медицински или други основателни причини, преподавателя изпраща имейл на родителя с взетия материал и домашно. По преценка на учителя, ученика може да бъде повикан на допълнителен безплатен час."
  },
  {
    question: "Как получавам информация за прогреса на детето си?",
    answer: "Всеки месец, преподавателя изпраща информация по имейл с резултатите от текущите тестове и съчинения. В края на всеки учебен срок, ще получавате срочен доклад."
  },
  {
    question: "В края на учебната година получава ли се сертификат за завършено ниво?",
    answer: "В края на курса, всяко дете получава сертификат за успешно завършено ниво, удостоверяващ напредъка му."
  },
  {
    question: "Какви са цените и какви отстъпки има?",
    answer: "Линк към ценоразпис"
  },
  {
    question: "Как мога да заплатя курса?",
    answer: "След сключен договор за обучение получавате фактура за плащане по банков път. Езиков център Уондърленд, не разполага с ПОС терминал."
  },
  {
    question: "Часовете в Уондърленд съобразени ли са със смените в училище?",
    answer: "Уондърленд се съобразява със смяната на детето в училище. Спазваме всички ваканции обявени от МОН."
  },
  {
    question: "Учебниците включени ли са в цената на курса?",
    answer: "Не. Учебният комплект се заплаща допълнително съобразно цените на издателството."
  },
  {
    question: "Има ли онлайн обучение?",
    answer: "Не."
  },
  {
    question: "Колко ученици има в група?",
    answer: "Групите са до 12 деца, което дава възможност за интерактивен подход, както и индивидуална работа с всеки ученик."
  },
  {
    question: "Какви методи на обучение използвате?",
    answer: "Обучението се провежда изцяло на английски език, като използваме иновационни методи, включително интерактивно обучение и игрови подходи, за да направим ученето забавно и ефективно."
  },
  {
    question: "Имате ли летни програми?",
    answer: "Да, всяко лято организираме едноседмичен лагер в планината, където децата могат да се насладят на приключения и нови преживявания. Също, така предлагаме и лятна занималня за ученици от 1 до 4 клас."
  },
  {
    question: "Заплащат ли се допълнително детските и тийнейджърски изпити на Кеймбридж?",
    answer: "Да. Таксата се заплаща допълнително, спрямо цената на изпитващия център за съответния сертификат."
  },
];

export const FAQ = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
                This is the start of something new
              </h4>
              <p className="max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight lg:max-w-lg">
                Managing a small business today is already tough. Avoid further
                complications by ditching outdated, tedious trade methods. Our
                goal is to streamline SMB trade, making it easier and faster
                than ever.
              </p>
            </div>
            <div className="">
              <Button className="gap-4" variant="outline" asChild>
                <Link href="/contact">
                  Any questions? Reach out <PhoneCall className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`index-${index}`}>
              <AccordionTrigger>
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </div>
);