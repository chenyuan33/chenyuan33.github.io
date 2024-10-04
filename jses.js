let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)), scripts = () => {
	document.getElementById("headerBlanks").style.width = document.getElementById("header").offsetWidth + "px";
	document.getElementById("headerBlanks").style.height = document.getElementById("header").offsetHeight + "px";
	document.getElementById("footerBlanks").style.width = document.getElementById("footer").offsetWidth + "px";
	document.getElementById("footerBlanks").style.height = document.getElementById("footer").offsetHeight + "px";
	if (cookie_operator.get("lightMode") === undefined)
	{
		cookie_operator.set("lightMode", "dark");
	}
	else
	{
		if (cookie_operator.get("lightMode") === "light")
		{
			document.getElementById("lightSwitch").innerHTML = "🌞";
			document.body.style.backgroundColor = "white";
			document.body.style.color = "black";
		}
	}
	console.log(`Welcome to chenyuan33.github.io!
© Copyright 2024 @chenyuan33, All rights reserved.`);
}, cookie_operator = {
	get: (name) => {
		let key_value = document.cookie.split("; ").find(str => str.startsWith(name + "="));
		return key_value === undefined ? undefined : key_value.split("=")[1];
	},
	set: (name, value) => document.cookie = name + "=" + value + "; expires=" + new Date(Date.now() + 60 * 60 * 24 * 180).toUTCString() + "; path=/"
}, switchLight = () => {
	if (cookie_operator.get("lightMode") === "dark")
	{
		cookie_operator.set("lightMode", "light");
		document.getElementById("lightSwitch").innerHTML = "🌞";
		document.body.style.backgroundColor = "white";
		document.body.style.color = "black";
	}
	else
	{
		cookie_operator.set("lightMode", "dark");
		document.getElementById("lightSwitch").innerHTML = "🌙";
		document.body.style.backgroundColor = "black";
		document.body.style.color = "white";
	}
};