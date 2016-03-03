# mpnick.js

Include the script before your `</body>` tag. Then, for each colored string, set the `mpnick` class on an element (like a `span`) and set `data-code` to the formatted string, and put the original string without any codes as the content of the element. For example:

```html
<span class="mpnick" data-code="$f00frank$0f02012">frank2012</span>
```

You can use this regex to trim all formatting codes from names:

```regex
/\$([0-9a-f]{3}|[ibnwsz<>]|[lh](\[[^\]]+\])?)/i
```

# License

Consider this public domain.

## Todo

There's 1 or 2 missing tags, as well as missing a formatting stack.
