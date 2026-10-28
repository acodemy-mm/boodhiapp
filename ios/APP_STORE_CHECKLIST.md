# Bodhi Path — App Store submission checklist

## Before Xcode

- [ ] Apple Developer Program active ($99/year)
- [ ] Web app deployed and public: https://bodhi-path.vercel.app
- [ ] **Required:** turn off Vercel Deployment Protection for Production (Dashboard → Project → Settings → Deployment Protection). Capacitor WKWebView cannot pass Vercel Authentication; without this the iOS app shows a login wall.
- [ ] Optional: set Supabase env vars on Vercel for cloud auth
- [ ] Run `npm run cap:sync` after web deploys

## Xcode project (`ios/App`)

1. Open Xcode project: `npm run ios` (or `npx cap open ios`) — Capacitor 8 uses SPM (`App.xcodeproj`), not CocoaPods
2. Select target **App**
3. **Signing & Capabilities**
   - Team: your Apple Developer team
   - Bundle ID: `com.bodhipath.app` (must be unique; change if taken)
   - Automatically manage signing: ON
4. **General**
   - Display Name: Bodhi Path
   - Version / Marketing: `1.0`
   - Build: increment for every upload (`CURRENT_PROJECT_VERSION`)
5. Run on a physical iPhone (local notifications need a device)
6. **Product → Archive** → **Distribute App** → App Store Connect

## App Store Connect listing

- [ ] Create app with same bundle ID
- [ ] Privacy Policy URL (required)
- [ ] Support URL
- [ ] Category: Lifestyle or Education
- [ ] Age rating questionnaire
- [ ] Privacy nutrition labels:
  - Contact Info / User ID if Supabase auth is enabled
  - Product Interaction / Usage Data if you later add analytics
  - Demo mode stores progress on-device only
- [ ] Screenshots: iPhone 6.7" and 6.1" (Home, Practice, Meditate, Profile)
- [ ] Description mentioning meditation timer, beads, worship plans, Dhamma learning
- [ ] Review notes: explain Capacitor loads hosted Next.js; local notifications for worship reminders; YouTube opens externally

## Export compliance

`ITSAppUsesNonExemptEncryption` is set to `false` in Info.plist (HTTPS only). Confirm on first upload if prompted.

## After approval

- [ ] Promote release
- [ ] Keep `CAPACITOR_SERVER_URL` / production URL stable; ship native updates only when plugins or shell change
- [ ] Redeploy web for most feature updates: `npm run deploy:web` then optionally bump native only if needed
