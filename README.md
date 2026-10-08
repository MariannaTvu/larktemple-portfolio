# LarkTemple portfolio

A static, responsive game portfolio for Mariana. No build step, dependencies, paid services, or server are required.

## Preview

From this directory, run `python3 -m http.server 8765 --bind 127.0.0.1`, then open `http://127.0.0.1:8765`.

## Content

- TowerTree: released on Google Play. Screenshots and the description are based on the official store listing.
- Reflections in the Clouds: in development for PC / Steam, with a demo coming soon. The two trailers are linked and can be played in the page. The Steam store URL has not been supplied, so there is no invented store link.
- Spirit Garden: work in progress, currently on hold. Includes original environment art and two animations with play/stop controls.
- Contact: larktemple@gmail.com.
- Social profiles: @spacelarktemple on YouTube, Instagram, and X, as supplied by the owner.

Edit `index.html` for text and links, `styles.css` for appearance, and files in `assets/` for artwork. All displayed art is supplied by Mariana, from the three game folders and the `free-to-use` folder. WebP copies are resized and compressed for the web; original files are unchanged. The two Spirit Garden animations load only after selecting Play, and stop when the page is hidden or another animation starts. Image galleries and animation links also work without JavaScript.

The light page and Economica headings take their direction from Mariana’s Reflections pitch deck. Economica and Roboto are served locally; their open font licenses are included in `assets/fonts/`.

## Publish to a separate GitHub Pages site

The existing website at `https://larktemple.github.io/` serves TowerTree's advertising file. Leave that repository and URL unchanged. This portfolio belongs in a separate public repository, `MariannaTvu/larktemple-portfolio`, using the connected GitHub account.

The included `app-ads.txt` is an exact copy of the existing 59-byte public file (Git blob SHA `ec24a53cbc447667b8b615991f8807cb954369e6`). Keep it intact on the new site too.

The site is published from `main` / root in Settings → Pages at https://mariannatvu.github.io/larktemple-portfolio/. Push updates to `main` to publish them. `.nojekyll` makes GitHub serve the HTML directly. The custom domain is not connected yet.

## Connect larktemple.com

1. Verify `larktemple.com` under the owning account's Settings → Pages using the exact TXT record GitHub supplies.
2. Add `larktemple.com` as the repository's custom domain under Settings → Pages. This creates a `CNAME` file for branch-based publishing.
3. In Wix → Domains → larktemple.com → Manage DNS Records, replace only the root website A records with all four of these values (leave the Wix host-name field blank for the root):

   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153

4. Change the `www` CNAME to `mariannatvu.github.io`. Keep unrelated DNS records, including mail records, unchanged.
5. Wait for GitHub's DNS check and certificate issuance, then enable Enforce HTTPS. Check both `https://larktemple.com` and `https://www.larktemple.com`.

Do not add a local `CNAME` file before the GitHub custom-domain setup is ready, because doing so would redirect visitors before the domain is connected. Domain ownership remains at Wix and its renewal is separate from the free website hosting.

Official references:
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages
- https://support.wix.com/en/article/connecting-a-wix-domain-to-an-external-site
