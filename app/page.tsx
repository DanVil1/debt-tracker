import DebtTracker from "./components/debt-tracker/DebtTracker";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 py-12 px-4 md:px-8">
      <DebtTracker />
    </main>
  );
}