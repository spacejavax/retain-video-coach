export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center text-foreground">
      <p className="font-mono text-[10px] tracking-[.14em] text-primary">404</p>
      <h1 className="display-text mt-4 text-4xl md:text-5xl">Den här sidan tappade tittarna.</h1>
      <p className="body-text mx-auto mt-4">Vi hittar ingenting här. Kontrollera länken, eller gå tillbaka och börja om.</p>
      <a href="/" className="mt-8 inline-flex h-12 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
        Till startsidan
      </a>
    </div>
  );
}
