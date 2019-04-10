

ModernDeck Full Source

==================

Hello fellow Mozilla reviewer!

ModernDeck is an extension, originally for Chrome, that refreshes TweetDeck's interface with a nice looking Material-design-inspired interface, as well as offering its users extra customization options.


This is ModernDeck's full source tree. I've been working on it with Chrome for a long time and I am excited to bring it to Firefox.

There are no special build instructions. It is ready to test using about:debugging and loading the unpacked folder.



Why the extra source code submission if it doesn't need built?

==================

ModernDeck, as a material design theme/customization extension, uses Roboto and Noto Sans to render fonts. Roboto isn't particularly big, but the Noto Sans collection absolutely dwarfs it, pushing it over 70 MB in size. A lot of this space is not necessary if you aren't viewing tweets in languages such as Chinese or Japanese. So, ModernDeck loads it over the Internet, specifically GitHub, and the browser caches it. 

CSS files are also loaded on the fly. The main file, moderndeck.css, styles the main page, but one of ModernDeck's prominent features is having several themes to choose from.

The primary CSS file is sources\moderndeck.css. This is the theme-neutral base for the extension. in sources\cssextensions, it includes every css extension, which is usually only loaded via GitHub if the user requests it.

As TweetDeck releases updates big and small at random, it is not uncommon to make emergency patches to ModernDeck to fix it.
Due to this, moderndeck.css and MTDinject.js are also streamed.

moderndeck.css updates mean minor visual issues can be fixed by simply refreshing after a fix is out.

MTDinject.js is also streamed, but it is isolated from all Web Extension APIs, and functions much like a user's own userscript. The background and main load scripts are contained within the extension itself, and must be updated through the extension marketplace (AMO, Chrome Webstore, etc)

Because of how Twitter's API and Oauth authentication works with TweetDeck, ModernDeck cannot under any circumstances ever see, let alone process your Twitter password, and no user data is sent to me or third parties, even for analytics, unless a serious error/crash occurs, in which case the user is prompted to send a stacktrace, or if the user writes a submission using the "Send Feedback" option.

How to test ModernDeck

==================

ModernDeck's code does not require extra building. In Firefox, it's a matter of going to about:debugging and adding the ModernDeck folder. It is also ready for testing in Chromium-based browsers, as well as Microsoft Edge.

From there, it is a matter of either clicking the new "Launch TweetDeck" icon, or going to https://tweetdeck.twitter.com. Both will take you to the same place.

To test, you will need a Twitter account. You can make a free one at twitter.com, or use any existing account.

Once you open TweetDeck, it is a matter of authenticating, which takes you outside of TweetDeck, to Twitter's main site, where you login over Oauth.



From there, I invite you to test whatever features you like!

If you have any other questions, please don't hesitate to contact me through AMO's Developer Hub, or by email at d@ngeredwolf.me