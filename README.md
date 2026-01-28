# X → Twitter Frontend Redirect

Userscript that automatically redirects x.com/twitter.com to your preferred Twitter frontend for a cleaner, restriction-free browsing experience.

## What does it do?

- 🔄 Instantly redirects any `x.com` or `twitter.com` URL to your chosen frontend
- ⚙️ Configurable frontend selection with easy-to-use menu
- ⚡ Replaces the current tab (no new tabs opened)
- 🚫 Allows temporary return to X.com using the `?no` parameter
- 🔗 Automatically modifies frontend links to include `?no` when going back to X

## Supported Frontends

- **XCancel** (xcancel.com) - Default
- **Nitter instances**:
  - nitter.poast.org
  - nitter.privacydev.net
  - nitter.1d4.us
  - nitter.unixfox.eu
  - nitter.hu
- **Bird Makeup** (bird.makeup)
- **TWstalker** (twstalker.com)

## Installation

### 1. Install a userscript manager

You need one of these installed:

- [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Edge, Safari, Opera)
- [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)
- [Greasemonkey](https://www.greasespot.net/) (Firefox)

### 2. Install the script

**[📥 Click here to install](https://raw.githubusercontent.com/Rukko/xcancel-redirect/main/xcancel-redirect.user.js)**

Your userscript manager will automatically detect the script and ask for confirmation to install it.

## Configuration

### Change your preferred frontend

Click on your userscript manager icon → **X → Twitter Frontend Redirect** → **⚙️ Configure Frontend**

Or use the keyboard shortcut (varies by manager).

Select your preferred frontend from the dropdown and click **Save**.

## Usage

### Automatic redirection

Simply navigate to any X.com or Twitter.com URL:
```
https://x.com/username/status/123
  ↓
https://xcancel.com/username/status/123
(or your configured frontend)
```

### Temporary return to X.com

If you need to use X.com without being redirected, add `?no` at the end of the URL:
```
https://x.com/username?no
```

The script will automatically clean the `?no` parameter from the URL without redirecting you.

When you're on any frontend and click the "Open in X" button, the script automatically adds `?no` to the link so you won't be redirected back.

## Updates

The script automatically updates through your userscript manager when new versions are available.

## License

MIT License - feel free to use, modify, and distribute.

## Issues or suggestions

If you encounter any problems or have suggestions, open an [issue](https://github.com/Rukko/xcancel-redirect/issues).

---

**Note**: Some Nitter instances may be down or unavailable at times. If your selected frontend is not working, try changing to a different one in the settings.
