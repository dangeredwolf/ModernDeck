// TDEFix.js
// Copyright (c) 2015 Ryan Dolan (ryandolan123)

// Attempts to remove old load from appearing for split second. Unfortunately doesn't work as well as hoped. Oh well.

function CheckForLoadStart() {

	if (typeof document.getElementsByTagName("html")[0] !== "undefined") {
		document.getElementsByTagName("html")[0].style = "background:#55acee!important;background-color:#55acee!important;";
	}

	if (typeof document.body === "undefined")
	{
		setTimeout(CheckForLoadStart,10);
		return;
	}

	else
	{
		if (document.body === null) {
			setTimeout(CheckForLoadStart,10);
			return;
		}

		else
		{
			document.body.style = "background:#55acee!important;background-color:#55acee!important;";
		}
	}
}

CheckForLoadStart();