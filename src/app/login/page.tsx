
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login Disabled</CardTitle>
          <CardDescription>
            Authentication is temporarily disabled.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="mt-4 text-center text-sm">
             <Link href="/" className="underline">
              Go to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
