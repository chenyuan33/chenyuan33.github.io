let sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)), scripts = () => {
	document.head.appendChild(document.createElement("script")).src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
	document.getElementById("header").innerHTML = `
		<p>
			<a href="/${document.URL.split("/")[3]}/index.html">${document.URL.split("/")[3] == "en-us" ? "Main Page" : "主页"}</a>
			<a id="lightSwitch" href="javascript:switchLight()">🌙</a>
			<a href="/${document.URL.split("/")[3]}/blog/index.html" id="headerBlogShower">${document.URL.split("/")[3] == "en-us" ? "Blog" : "博客"} <div id="headerBlogShowerArrow">&lt;</div></a>
		</p>
		<p>
			${document.URL.split("/")[3] == "en-us" ? "Languages: " : "语言: "}
			<a href="/en-us/${document.URL.split("/").slice(4).join("/")}">English</a>
			<a href="/zh-cn/${document.URL.split("/").slice(4).join("/")}">简体中文</a>
		</p>
		<p><a href="#footerBlanks">${document.URL.split("/")[3] == "en-us" ? "Jump to the bottom" : "跳转至底部"}</a></p>
	`;
	document.getElementById("footer").innerHTML = `
		<p><a href="#headerBlanks">${document.URL.split("/")[3] == "en-us" ? "Jump to the top" : "跳转至顶部"}</a></p>
		<p>© Copyright 2024-${new Date().getFullYear()} @<a href="https://github.com/chenyuan33">chenyuan33</a>, All rights reserved.</p>
	`;
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