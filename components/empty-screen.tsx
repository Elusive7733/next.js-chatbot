export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">Welcome to AI Sales Assistant</h1>
        <p className="leading-normal text-muted-foreground">
         Hi there! I am your personal AI assistant. How can I help you you today?
        </p>
      </div>
    </div>
  )
}
