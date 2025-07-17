import { Suspense } from 'react';
import HomeownerSearchClient from './HomeownerSearchClient';

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <HomeownerSearchClient />
    </Suspense>
  );
}
