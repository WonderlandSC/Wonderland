import { Button } from '@repo/design-system/components/ui/button';
import { env } from '@repo/env';
import { allPosts } from 'content-collections';
import { MoveRight, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export const Hero = () => (
  <div className="w-full">
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
        <div>
          <Button variant="secondary" size="sm" className="gap-4" asChild>
            <Link href={`/blog/${allPosts[0]._meta.path}`}>
              Прочети последната ни статия <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="max-w-2xl text-center font-regular text-5xl tracking-tighter md:text-7xl">
            Every adventure requires a first step
          </h1>
          <p className="max-w-2xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl">
            Вълнуващото изучаване на английски език започва тук! <br/>Ние предлагаме забавни и интерактивни уроци, специално създадени за деца, за да учат с радост и увереност.

          </p>
        </div>
        <div className="flex flex-row gap-3">
          <Button size="lg" className="gap-4" asChild>
            <Link href="/contact">
              Свържете се с нас <PhoneCall className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg"  variant="outline" className="gap-4" asChild>
            <Link href={env.NEXT_PUBLIC_APP_URL}>
              Вход <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
);
