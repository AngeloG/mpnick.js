// mpnick.js
// git.io/ag
// Colorize Maniaplanet nicknames from raw codes to HTML markup

window.mpnick = {
	processAll: function()
	{
		var elms = document.getElementsByClassName('mpnick');
		for (var i = 0; i < elms.length; i++) {
			var code = elms[i].getAttribute('data-code');
			if (code !== null) {
				var html = this.process(code);
				elms[i].innerHTML = html;
			}
		}
	},

	encode: function(str)
	{
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	},

	currentHtml: '',
	currentBuffer: '',

	state: {
		inCode: false,
		inCodeCount: 0,
		inCodeLink: false,

		inColorCode: '',
		inWide: false,
		inItalic: false,
		inLink: false,
		inLinkMania: false,
		inLinkUrl: '',
		inShadow: true,

		start: function()
		{
			this.inCode = false;
			this.inCodeCount = 0;
			this.reset();
		},

		reset: function()
		{
			this.inColorCode = 'fff';
			this.inBold = false;
			this.inItalic = false;
			this.inLink = false;
			this.inLinkMania = false;
			this.inLinkUrl = '';
			this.inShadow = true;
		},
	},

	resetState: function()
	{
		this.currentHtml = '';
		this.currentBuffer = '';
		this.state.start();
	},

	flushState: function()
	{
		if (this.currentBuffer == '') {
			return;
		}
		var ret = '<span style="color: #%COL; %WID %ITA %SHD">'
			.replace('%COL', this.state.inColorCode)
			.replace('%WID', this.state.inWide ? 'font-weight: bold;' : '')
			.replace('%ITA', this.state.inItalic ? 'font-style: italic;' : '')
			.replace('%SHD', this.state.inShadow ? 'text-shadow: 1px 1px 0px rgba(0,0,0,0.6);' : '')
			+ this.encode(this.currentBuffer) + '</span>';
		if (this.state.inLink) {
			if (this.state.inLinkUrl != '') {
				if (this.state.inLinkMania) {
					ret = '<a href="maniaplanet:///:' + this.encode(this.state.inLinkUrl) + '">' + ret + '</a>';
				} else {
					this.state.inLinkUrl = this.state.inLinkUrl.trim();
					if (this.state.inLinkUrl.match(/^(https?:)?\/\//) === null) {
						// yes, this is always https, use letsencrypt already you doofus
						this.state.inLinkUrl = 'https://' + this.state.inLinkUrl;
					}
					ret = '<a href="' + this.encode(this.state.inLinkUrl) + '">' + ret + '</a>';
				}
			} else {
				ret = '<a href="' + this.encode(this.currentBuffer) + '">' + ret + '</a>';
			}
		}
		this.currentHtml += ret;
		this.currentBuffer = '';
	},

	process: function(code)
	{
		this.resetState();

		for (var i = 0; i < code.length; i++) {
			var c = code[i];

			if (this.state.inCodeLink) {
				if (c == ']') {
					this.state.inCodeLink = false;
				} else {
					this.state.inLinkUrl += c;
				}
			} else if (this.state.inCode) {
				var isHex = false;
				var cn = String.charCodeAt(c.toLowerCase());
				if ((cn >= 48 && cn <= 57) || (cn >= 97 && cn <= 102) || this.state.inCodeCount > 0) {
					if (this.state.inCodeCount == 0) {
						this.state.inColorCode = '';
					}
					this.state.inColorCode += c;
					if (++this.state.inCodeCount == 3) {
						this.state.inCode = false;
						continue;
					}
				} else {
					if (c == 'w') { this.state.inWide = !this.state.inWide; }
					if (c == 'i') { this.state.inItalic = !this.state.inItalic; }
					if (c == 's') { this.state.inShadow = !this.state.inShadow; }
					if (c == 'l' || c == 'h') {
						this.state.inLink = !this.state.inLink;
						this.state.inLinkUrl = '';
						this.state.inLinkMania = (c == 'h');
						if (this.state.inLink && (code.length >= i + 1 && code[i + 1] == '[')) {
							this.state.inCodeLink = true;
							i++;
						}
					}
					if (c == 'z') { this.state.reset(); }
					this.state.inCode = false;
				}
			} else {
				if (c == '$') {
					this.flushState();
					this.state.inCode = true;
					this.state.inCodeCount = 0;
					continue;
				}
				this.currentBuffer += c;
			}
		}
		if (this.currentBuffer != "") {
			this.flushState();
		}
		return this.currentHtml;
	},
};

window.mpnick.processAll();

