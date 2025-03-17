import { algoliasearch } from 'algoliasearch'

export const algoliaConfig = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "", process.env.NEXT_PUBLIC_ALGOLIA_API_KEY ?? "");
