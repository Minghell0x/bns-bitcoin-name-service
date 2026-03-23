# BNS — Bitcoin Name Service | Design & Build Prompt

## What We're Building

**BNS (Bitcoin Name Service)** is the official frontend for the first .btc domain name system on Bitcoin Layer 1, powered by OPNet. Users can search, register, renew, and transfer human-readable `.btc` domain names that resolve to Bitcoin addresses — just like ENS does for Ethereum, but natively on Bitcoin.

The site serves two phases:
1. **NOW — Presale phase**: Domains are already purchasable on-chain via OP_WALLET. A countdown shows when OP_WALLET will add native .btc domain support (name resolution, address book, etc.). The "PRESALE NOW" messaging creates urgency — early adopters get first pick.
2. **POST-LAUNCH**: Full domain management — search, buy, renew, transfer, manage subdomains, set content hashes for decentralized web hosting.

## Contract Capabilities (what the UI must surface)

### Core User Flows
- **Search & Check Availability**: Query any `.btc` name → show if available, taken (with owner/expiry), or in grace period
- **Register a Domain (two-step safe purchase)**:
  1. Reserve the name (locks it so nobody can snipe)
  2. Send BTC to treasury
  3. Complete registration
- **Register with MOTO token**: Alternative payment method using the MOTO OP20 token
- **Renew**: Extend a domain's expiry by 1+ years (BTC or MOTO)
- **Transfer**: Send a domain to another address (direct, two-step with accept/cancel, or ML-DSA signature)
- **Subdomains**: Create/delete subdomains under owned parent domains
- **Content Hash**: Point a domain to IPFS, IPNS, or SHA256 content for decentralized web hosting

### Pricing
- Prices are in satoshis
- Tiered: shorter/premium names cost more (auction pricing)
- Price scales with registration duration (years)
- View: base price, total price, auction premium, renewal rate per year

## Visual Design Direction

### Overall Aesthetic
**Professional, clean, and premium — NOT generic AI/crypto.** Think ENS meets a premium Bitcoin-native product. The design should feel:
- **Trustworthy**: This is critical financial infrastructure, not a meme. Clean hierarchy, ample whitespace, measured typography.
- **Bitcoin-native**: Subtle orange/amber warmth without being garish. Dark mode primary. The site should feel like it belongs to Bitcoin culture — understated confidence, not flashy.
- **Modern but not trendy**: No gradients-for-the-sake-of-gradients, no glassmorphism, no excessive blur effects. Timeless, like a well-designed financial product.
- **ENS-level polish**: ENS uses generous whitespace, clear typography hierarchy (grotesk sans-serif + elegant serif), smooth purposeful animations, and a centered columnar layout. BNS should match this level of refinement but with Bitcoin's identity.

### Color Palette
- **Background**: Deep dark — not pure black. Something like `#0a0a0c` or `#0d0f12` with subtle warm undertones
- **Surface/Cards**: Slightly elevated dark `#141418` or `#161820` with subtle borders `rgba(255,255,255,0.06)`
- **Primary Accent**: Bitcoin amber/orange — not the harsh `#F7931A` but a refined warm amber like `#E8910C` or `#D4850A`, used sparingly for CTAs, highlights, active states
- **Secondary Accent**: A cool tone for contrast — muted blue `#4A8CCC` or teal, used for links and secondary actions
- **Text Primary**: Off-white `#E8E8EC` — not pure white, softer on dark backgrounds
- **Text Secondary**: Muted `#8A8A96`
- **Success**: Warm green `#2DD4A0`
- **Error**: `#E54D4D`
- **Borders/Dividers**: `rgba(255,255,255,0.08)` — barely visible structure

### Typography
- **Headings**: A modern grotesk sans-serif — Inter, Satoshi, or Monument Grotesk. Weight 600-800. Clean, geometric, authoritative.
- **Body**: Same family at weight 400-500, generous line-height (1.6), size 15-16px
- **Monospace accent**: For addresses, hashes, domain names — a clean monospace like JetBrains Mono or IBM Plex Mono
- **Domain names in search/cards**: Slightly larger, weight 600, with the `.btc` suffix styled in the accent amber color
- **Hierarchy**: Very clear — large hero text (48-64px desktop), section headings (28-36px), card titles (18-20px), body (15-16px), captions (13px)

### Layout Structure

#### Navigation (sticky top)
- Clean horizontal bar, dark, minimal
- Left: BNS logo (wordmark, clean typography, subtle amber dot or accent)
- Center or right: Navigation links — Domains, Pricing, FAQ, Docs
- Far right: "Connect Wallet" button (pill-shaped, outlined, becomes amber-filled when connected showing truncated address)
- Height: ~64px, subtle bottom border or shadow on scroll

#### Hero Section (above the fold — THIS IS THE MOST IMPORTANT SECTION)
- Centered layout, maximum width ~800px
- **Countdown banner** at the very top or integrated into hero:
  - "OP_WALLET SUPPORT LIVE IN" followed by large countdown digits: `XX d  XX h  XX m  XX s`
  - Digits should be in a monospace font, slightly larger, with subtle amber glow or accent
  - Clean, not flashy — think airport departure board aesthetic
- **Main headline**: Large, bold, commanding:
  - "Your identity on Bitcoin" or "Claim your .btc name" — something short, authoritative
  - The `.btc` part in amber accent color
- **Subtitle**: One sentence explaining the value — "Register human-readable .btc domains on Bitcoin Layer 1. Search, own, and resolve — powered by OPNet."
- **Search bar**: The centerpiece interaction
  - Large, prominent input field with generous padding (16-20px vertical)
  - Placeholder: "Search for a .btc name..."
  - Right-aligned search button (amber, pill-shaped) or icon
  - Border-radius: 12-16px, subtle shadow, slight border glow on focus
  - When user types, show `.btc` suffix automatically appended in muted text
- **"PRESALE NOW" badge/tag**: Positioned near the search bar or hero
  - Small, attention-grabbing but not garish
  - Could be a pill badge with subtle pulse animation: "PRESALE LIVE" in amber with a soft glow
  - Or integrated into the hero subtitle: "Presale is live — secure your name before OP_WALLET integration"

#### Search Results (appears below search after query)
- Animated slide-down reveal
- If available: Green checkmark, domain name in bold, price breakdown (total sats, USD equivalent), "Register" amber CTA button, year selector (1-5 years)
- If taken: Red/muted indicator, owner address (truncated), expiry date, grace period status if applicable
- If in grace period: Warning amber state — "Expiring soon, available for re-registration on [date]"
- Price card: Clean breakdown — base price, auction premium (if short name), renewal rate, total

#### Registration Flow (step-by-step)
- When user clicks "Register", expand into a stepped flow:
  1. **Step 1 — Reserve**: "Locking your domain..." with transaction status
  2. **Step 2 — Payment**: Show treasury address, exact BTC amount, QR code, payment status
  3. **Step 3 — Complete**: "Finalizing registration..." with confirmation
- Each step: clean card, progress indicator (1-2-3), status icons (pending spinner, success check, error X)
- Smooth transitions between steps

#### Features Section (below hero)
- Grid of 3-4 feature cards explaining capabilities:
  - "Own Your .btc Identity" — human-readable Bitcoin addresses
  - "Subdomains" — create unlimited subdomains under your name
  - "Decentralized Web" — point your domain to IPFS/IPNS content
  - "Transfer & Trade" — secure domain transfers with ML-DSA signatures
- Cards: dark surface, subtle border, small icon (line-style, not filled), heading, 1-2 line description
- Minimal, informational, builds trust

#### Stats Section (optional but impactful)
- If data available: Total domains registered, unique owners, total names — large numbers, amber accent, ENS-style counter display

#### How It Works Section
- 3-step horizontal flow with connecting lines/arrows:
  1. "Search" — find your perfect .btc name
  2. "Reserve & Pay" — lock the name and send BTC
  3. "Own" — your domain is live on Bitcoin L1
- Simple icons, clean typography, muted connecting lines

#### Footer
- Dark, minimal
- BNS logo, tagline: "Bitcoin Name Service — .btc domains on Bitcoin L1"
- Links: Docs, GitHub, Discord/Telegram, Terms
- "Powered by OPNet" with subtle OPNet logo
- Copyright line

### UI Components

#### Buttons
- Primary: Amber fill, dark text, pill-shaped (border-radius: 9999px), padding 12px 24px, hover: slightly lighter with subtle shadow
- Secondary: Outlined, light border, light text, pill-shaped, hover: fill with subtle dark
- Disabled: Muted, reduced opacity
- All buttons: smooth 150ms transition, no jarring state changes

#### Input Fields
- Dark surface background, subtle border, rounded (12px)
- Focus: amber border glow (box-shadow with amber at low opacity)
- Placeholder text: muted secondary color
- Error state: red border, error message below

#### Cards
- Dark surface `#141418`, border `rgba(255,255,255,0.06)`, border-radius 16px
- Padding: 24-32px
- Hover on interactive cards: subtle border brightness increase, micro-shadow

#### Domain Name Display
- Name part: white, weight 600
- `.btc` suffix: amber accent color
- Address displays: monospace, truncated with copy button

#### Countdown Timer
- Monospace digits, clean separators
- Subtle amber glow on numbers
- Labels below each unit (days, hours, minutes, seconds) in small muted text
- Should feel precise and technical, not playful

### Animations & Motion
- **Purposeful, not decorative**: Every animation should serve UX, not show off
- Search bar: subtle scale-up on focus, smooth results slide-in
- Countdown: digit flip or smooth number transition (not flashy, think mechanical clock)
- Page sections: subtle fade-in-up on scroll (IntersectionObserver, staggered)
- Loading states: clean spinner or skeleton, amber accent
- Transaction steps: smooth slide transitions between steps
- Presale badge: very subtle pulse glow (not a strobe, just a gentle breathing animation)

### Responsive Behavior
- **Mobile-first**: Single column, full-width search bar, stacked cards
- **Tablet** (768px+): Two-column feature grid, slightly larger type
- **Desktop** (1024px+): Full layout, centered content max-width ~1100px, generous padding
- Navigation: hamburger menu on mobile, horizontal on desktop
- Countdown: horizontal on desktop, 2x2 grid on mobile

### What to Absolutely Avoid
- Generic AI aesthetics (random gradients, excessive glassmorphism, neon glows)
- Crypto bro vibes (rockets, moons, diamond hands imagery)
- Overly complex animations that distract from the product
- Pure black backgrounds (too harsh)
- Cluttered layouts — whitespace is a feature
- Stock illustrations or generic 3D renders
- Rainbow/multicolor schemes — this is Bitcoin, warm and focused

### Tech Stack
- React + Vite + TypeScript
- Tailwind CSS (or CSS modules for precision)
- `opnet` npm package for contract interaction
- OP_WALLET integration for wallet connection and transaction signing
- `@btc-vision/bitcoin` for Bitcoin utilities (NEVER bitcoinjs-lib)
- `networks.opnetTestnet` for OPNet testnet (MUST use this — NOT `networks.testnet` which is Testnet4)
- RPC endpoint: `https://testnet.opnet.org`
- **Currently targeting OPNet Testnet** — all contract interactions, wallet connections, and network config must use testnet
