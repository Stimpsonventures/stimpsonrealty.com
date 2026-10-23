# Stimpson Realty — pre-GitHub staging package

This package retains the existing home search/MLS placeholders **by request**. Do not publicly advertise or launch until MLS integration and all live-service checks are complete.

## Completed offline
- Four approved Google review excerpts, with links to read more and submit reviews
- Contact, valuation, and market-update forms marked up for Netlify Forms, with real field names and confirmation page
- Buyer-guide Option B frontend and serverless backend prepared (see `DEPLOYMENT_CHECKLIST.md`)
- Privacy policy draft, SEO titles/descriptions, canonical links, sitemap, robots, favicon and social preview
- Header and footer logos, Navica links and MLS placeholders preserved

## Live services required
- Netlify Functions, Netlify Forms detection, email provider, domain DNS and HTTPS
- Secret `GUIDE_TOKEN_SECRET`, `RESEND_API_KEY`, `GUIDE_FROM_EMAIL`, and private R2 object-storage credentials
- Confirm Google URLs, compliance approval, actual email deliverability and mobile browser tests
- MLS/IDX authorized feed and real property-registration gate integration

See `DEPLOYMENT_CHECKLIST.md` for detailed testing.
