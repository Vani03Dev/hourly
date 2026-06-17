#!/bin/bash
URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '=' -f2 | tr -d '"')
KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d '=' -f2 | tr -d '"')

curl -s "$URL/rest/v1/expert_profiles?select=username,first_name,avatar_url" \
  -H "apikey: $KEY" \
  -H "Authorization: Bearer $KEY"
