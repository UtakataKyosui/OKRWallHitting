import { OKRInputForm } from '@/components/okr-form';

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-8 max-w-3xl">
      <div className="space-y-6 mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Personal OKR Refiner
        </h1>
        <p className="text-muted-foreground text-lg">
          Improve your personal goals with AI-powered feedback.
        </p>
      </div>

      <OKRInputForm />
    </main>
  );
}
