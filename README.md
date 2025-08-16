# www.mycountdownto.com

This website lets you create beautiful countdown clocks.

It consists of:

- a landing page describing the purpose and functionality of the site
- a countdown page which renders a beautiful countdown using query parameters to convey the settings
- a builder page which lets a user configure a countdown
- a feedback page which links to a google form

On the countdown and builder page is a share button which copies the URL to the clipboard and shows the user a message with instructions to paste into their favourite social media channels.

Users can configure:

- Date and time (with timezone)
- Title
- Background image (selected from unsplash)
- Font and font effect (styling to apply to font such as gradient or pulse)

These parameters are used on the querystring to build a URL to the countdown page.

Example URL:

https://www.mycountdownto.com/countdown.html?title=New%20Years%20Day&date=2026-01-01T00:00&image=&font=lcd14&effect=gradient

A builder page lets the user configure these settings in an inline style so they can see the countdown as they configure it. Once they are happy with it they can share the url via any means they want.

The builder page starts by rendering a preview of a default countdown

- date and time is new years day, midnight
- background image is a generic timer image
- title is "New Years Day"

These elements highlight when hovered over and can be clicked on to be edited.

When selecting the date and time, a beautiful date time picker is shown in a dialog box. When applied, the page updates to show this selected date in the countdown timer by updating the url.

When selecting the timezone, a dialog opens to let the user select:

- "Viewers local timezone" which means no timezone will be specifically selected. Any viewer will see it in their local timezone.
- The builders timezone so they can easily choose their own timezone
- All the other timezones available in the browser.

Font styles available include

- Retro
- Clean
- Futuristic

Font effects include

- Gradient
- Pulse
- Glow
- Fire

To choose an image, a dialog opens which allows the user to browse, search, filter images from unsplash. The user can find an image they like and choose it to update the preview of the countdown.
