# Required before public launch

## 1. GitHub → Netlify
- Commit this **repository root** including `site/`, `netlify/`, `private/`, `netlify.toml`. Do not upload only `site/` or publish `private/`.
- Netlify base directory: repository root. Publish directory: `site`. Functions directory: `netlify/functions`. No build command.
- Configure Netlify Forms and verify form detection for `buyer-guide-registration`, `contact-inquiry`, `seller-valuation`, `market-updates`.
- Test form notifications to your actual inbox; configure spam filtering.

## 2. Option B buyer guide
- Set Netlify environment variable `GUIDE_TOKEN_SECRET` to a random 32+ character secret. Never commit this value.
- Set `RESEND_API_KEY` from your transactional email provider and `GUIDE_FROM_EMAIL` to a verified sender address at stimpsonrealty.com.
- Verify domain DNS SPF/DKIM/DMARC with the provider before live sending.
- Verify Netlify's `URL` environment value points to the deployed site.
- Upload the exact unmodified PDF from `private/Stimpson_Realty_Buyer_Guide.pdf` to a **private Cloudflare R2 bucket**. Configure `R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and optionally `R2_OBJECT_KEY` (defaults to `Stimpson_Realty_Buyer_Guide.pdf`). Never expose the bucket publicly.
- Test registration, Netlify Forms capture, instant download, emailed link, invalid token, expired token, and PDF not accessible under `/private/` or `/assets/`.
- The thank-you page is public, but the PDF itself is gated behind a signed 7-day registration link that redirects to a 10-minute private R2 signed URL. Link forwarding remains possible. This separate storage is necessary because the original PDF is larger than typical Netlify function response limits.
- Netlify Forms capture from a serverless function requires real deployed integration testing.
- Add a clear support/error escalation for failed email delivery.

## 3. Legal/content
- Brokerage approve footer logo, advertising language, privacy policy draft and consent copy.
- Review selected Google testimonials for exactness and attribution; links should resolve to the intended business.
- Verify all phone numbers and contact addresses.

## 4. Before DNS and advertising
- Connect authorized MLS feed; integrate property search, listing details and two-home gate with CRM.
- Verify desktop, tablet, mobile, keyboard navigation, forms, calculators, links, image/video performance and accessibility.
- Connect both domains, with `stimpsonrealty.com` canonical and `yourhouseidaho.com` redirect. Preserve existing Namecheap email DNS.
- Remove or update MLS placeholder and footer staging language when the feed goes live.
- Check live metadata, sitemap, robots.txt, 404 handling and Search Console.

**Do not treat local/static tests as proof of live delivery.**
