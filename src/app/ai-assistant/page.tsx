import { AiAssistantClient } from './components/ai-assistant-client';

export default function AiAssistantPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-headline font-bold">AI Diagnostic Assistant</h1>
          <p className="text-muted-foreground">
            Get AI-powered suggestions for diagnoses and specialist referrals.
          </p>
        </div>
      </div>
      <AiAssistantClient />
    </div>
  );
}
