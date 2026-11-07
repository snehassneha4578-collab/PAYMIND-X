# PAYMIND X

**Think smarter. Shop wiser. Pay confidently.**

PAYMIND X is an AI-powered shopping and payment-intelligence prototype designed to help users explore products, understand shopping choices, and experience a transparent checkout workflow.

## Features

- **AI Shopping Assistant:** AI-powered shopping guidance and recommendations using Google Gemini.
- **Product Discovery:** Product discovery interface with an eBay Browse API integration planned. Live listings require provider approval and valid API credentials.
- **Shopping Dashboard:** A central interface for shopping insights and illustrative product information.
- **PayPal Sandbox Integration:** Server-side PayPal Orders API integration for creating, verifying, and capturing explicitly approved Sandbox orders.
- **No-Payment Demo Mode:** A separate local simulation that demonstrates the checkout experience without creating a PayPal order, authorizing a payment, or transferring money.

## Technology Stack

- Next.js and React
- TypeScript
- Tailwind CSS
- Google Gemini API
- PayPal Sandbox REST API
- Framer Motion
- Recharts
- Lucide React
- Zod

## Requirements

- Node.js
- npm
- API credentials for the integrations you want to test

## Installation

Clone or download the project, then open its directory:

```powershell
cd paymind-x
npm.cmd install
```

## Environment Configuration

Create a local environment file:

```powershell
Copy-Item .env.example .env.local
```

Configure the required values in `.env.local` using your own credentials.

Supported environment variable names in the project template:

- `GEMINI_API_KEY`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_BASE_URL`
- `DATABASE_URL`
- `NEXT_PUBLIC_APP_NAME`

Keep `.env.local` private. Never commit API keys, passwords, or secrets to source control.

For PayPal Sandbox testing, use Sandbox credentials and:

```text
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
```

The local Demo Mode does not require a PayPal payment or buyer approval.

## Run Locally

Start the development server:

```powershell
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

Build the application:

```powershell
npm.cmd run build
```

Start the production server:

```powershell
npm.cmd run start
```

## Application Routes

| Route | Purpose |
|---|---|
| `/` | Main dashboard |
| `/ai-shopping` | AI shopping assistant |
| `/discover` | Product discovery |
| `/checkout` | Checkout and Demo Mode |
| `/checkout/success` | PayPal return page |
| `/checkout/cancel` | Checkout cancellation page |

## Payment Safety

PAYMIND X distinguishes between a local simulation and a PayPal Sandbox transaction.

### Demo Mode

- Uses a local simulated transaction.
- Labels the result `SIMULATED`.
- Does not call PayPal create-order or capture endpoints.
- Does not represent a real purchase or completed payment.

### PayPal Sandbox

- Uses PayPal Sandbox APIs.
- Requires explicit user approval through the PayPal Sandbox flow before capture.
- Uses server-side credentials.
- Does not represent a real-world purchase or delivery.

Never treat a simulated transaction as a real payment.

## Product Data Disclaimer

Dashboard product names and prices may be illustrative. Live product listings and prices must only be displayed when verified through an authorized data provider.

The eBay Browse API integration depends on provider access and approval.

## Security

- Keep secret API credentials server-side.
- Do not expose `.env.local`.
- Validate payment amounts and product identifiers on the server.
- Require explicit user approval before requesting payment capture.
- Keep simulated and actual Sandbox transaction states separate.

## License

This project is distributed under the MIT License. See [LICENSE](LICENSE).

## Project Status

PAYMIND X is an active prototype. Integration availability depends on external API credentials and provider approval.
