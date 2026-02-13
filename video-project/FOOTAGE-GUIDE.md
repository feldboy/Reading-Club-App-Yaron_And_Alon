# Recording Guide for Real Footage

## Quick Start

1. **Record your screen** using OBS, QuickTime, or Loom
2. **Save videos** to `video-project/public/footage/`
3. **Run preview**: `npm start` and select `MainWithFootage`
4. **Render final video**: `npm run render:footage`

## Required Video Files

Place these files in `public/footage/`:

| Filename | Duration | Content |
|----------|----------|---------|
| `login.mp4` | ~60s | Registration, login, Google OAuth button |
| `home-feed.mp4` | ~75s | Home page, infinite scroll, welcome message |
| `ai-search.mp4` | ~60s | AI search bar, typing query, results |
| `create-review.mp4` | ~90s | Book search, rating, writing review, submit |
| `social.mp4` | ~90s | Like/unlike, view detail, add comment |
| `discover.mp4` | ~60s | Categories, search, add to wishlist |
| `clubs.mp4` | ~75s | Browse clubs, join, create new club |
| `wishlist.mp4` | ~45s | View wishlist, remove book |
| `profile.mp4` | ~60s | View profile, edit, upload image |
| `swagger.mp4` | ~60s | Swagger docs, expand endpoints |
| `tests.mp4` | ~45s | Terminal: npm test, show results |
| `responsive.mp4` | ~45s | Resize browser: desktop -> tablet -> mobile |

## Recording Settings

### Resolution
- **Recommended**: 1920x1080 (Full HD)
- **Minimum**: 1280x720 (HD)

### Frame Rate
- 30 FPS (matches Remotion output)

### Format
- MP4 with H.264 codec
- Alternative: WebM, MOV

## Recording Tips

### Before Recording
```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev
```

### Browser Setup
- Clear cache and localStorage
- Set browser zoom to 100%
- Hide bookmarks bar
- Close dev tools
- Enable Do Not Disturb

### During Recording
- Move cursor slowly and deliberately
- Pause 1-2 seconds after each action
- Let animations complete before moving on
- Type at readable speed

## Commands

```bash
# Preview with real footage
npm start
# Then select "MainWithFootage" in Remotion Studio

# Render final video
npx remotion render src/index.ts MainWithFootage out/demo-with-footage.mp4

# Render specific section (for testing)
npx remotion render src/index.ts MainWithFootage out/test.mp4 --frames=0-900
```

## Adjusting Timing

If your footage is longer/shorter, edit `MainWithFootage.tsx`:

```tsx
// Change durationInFrames (30 fps)
// 60 seconds = 1800 frames
// 90 seconds = 2700 frames
<TransitionSeries.Sequence durationInFrames={1800}>
    <VideoScene videoSrc="footage/login.mp4" ... />
</TransitionSeries.Sequence>
```

## File Structure

```
video-project/
├── public/
│   └── footage/
│       ├── login.mp4
│       ├── home-feed.mp4
│       ├── ai-search.mp4
│       ├── create-review.mp4
│       ├── social.mp4
│       ├── discover.mp4
│       ├── clubs.mp4
│       ├── wishlist.mp4
│       ├── profile.mp4
│       ├── swagger.mp4
│       ├── tests.mp4
│       └── responsive.mp4
├── src/
│   ├── MainWithFootage.tsx  <- Uses real footage
│   ├── Main.tsx             <- Animated version
│   └── scenes/
│       └── VideoScene.tsx   <- Reusable video component
└── out/
    └── demo-with-footage.mp4
```

## Troubleshooting

**Video not showing?**
- Check file is in `public/footage/`
- Verify filename matches exactly (case-sensitive)
- Ensure video codec is H.264

**Audio issues?**
- Videos should NOT have audio (voiceover added in post)
- Or set volume in VideoScene component

**Performance issues?**
- Use `<OffthreadVideo>` (already configured)
- Reduce preview resolution in Remotion Studio
